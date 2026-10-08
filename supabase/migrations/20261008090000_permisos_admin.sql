-- =====================================================================
-- Pestaña "Permisos": administración de roles
-- =====================================================================

-- ===== 0. Terminar la migración RBAC pendiente (seguridad) =====
-- Cerrar la escalada de rol: el usuario solo puede editar sus datos básicos.
DROP POLICY IF EXISTS "Users can update their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile fields" ON public.profiles;
CREATE POLICY "Users can update their own profile fields" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

REVOKE UPDATE ON public.profiles FROM authenticated, anon;
GRANT  UPDATE (full_name, company, phone) ON public.profiles TO authenticated;

-- Columna/tipo legado (reemplazados por profiles.role_id -> roles)
ALTER TABLE public.profiles DROP COLUMN IF EXISTS role;
DROP TYPE IF EXISTS public.user_role;

-- ===== 1. Modo de acceso de cada pestaña =====
-- 'role'  = según role_modules (la matriz de permisos)
-- 'all'   = siempre visible para todos (Inicio)
-- 'admin' = exclusiva del Administrador, no editable (Permisos)
ALTER TABLE public.modules ADD COLUMN IF NOT EXISTS access_mode text NOT NULL DEFAULT 'role';
ALTER TABLE public.modules DROP CONSTRAINT IF EXISTS modules_access_mode_check;
ALTER TABLE public.modules ADD CONSTRAINT modules_access_mode_check
  CHECK (access_mode IN ('role','all','admin'));

UPDATE public.modules SET access_mode = 'all' WHERE slug = 'inicio';

INSERT INTO public.modules (slug, label, icon, route, sort_order, access_mode)
VALUES ('permisos', 'Permisos', 'admin_panel_settings', '/panel/permisos', 99, 'admin')
ON CONFLICT (slug) DO UPDATE SET access_mode = 'admin';

DELETE FROM public.role_modules rm USING public.modules m
 WHERE rm.module_id = m.id AND m.access_mode <> 'role';

-- ===== 2. Apariencia del rol + protecciones =====
ALTER TABLE public.roles ADD COLUMN IF NOT EXISTS icon  text NOT NULL DEFAULT 'badge';
ALTER TABLE public.roles ADD COLUMN IF NOT EXISTS color text NOT NULL DEFAULT 'lime';
ALTER TABLE public.roles DROP CONSTRAINT IF EXISTS roles_color_check;
ALTER TABLE public.roles ADD CONSTRAINT roles_color_check
  CHECK (color IN ('lime','sky','violet','amber','rose','teal'));
ALTER TABLE public.roles ALTER COLUMN is_system SET NOT NULL;

UPDATE public.roles SET icon = 'shield_person', color = 'lime'   WHERE slug = 'administrador';
UPDATE public.roles SET icon = 'terminal',      color = 'violet' WHERE slug = 'desarrollador';
UPDATE public.roles SET icon = 'person',        color = 'sky'    WHERE slug = 'cliente';

CREATE UNIQUE INDEX IF NOT EXISTS roles_name_lower_key ON public.roles (lower(name));

-- Los roles de sistema no se pueden borrar
DROP POLICY IF EXISTS "Admin all roles" ON public.roles;
DROP POLICY IF EXISTS "Admin insert roles" ON public.roles;
DROP POLICY IF EXISTS "Admin update roles" ON public.roles;
DROP POLICY IF EXISTS "Admin delete non-system roles" ON public.roles;
CREATE POLICY "Admin insert roles" ON public.roles FOR INSERT TO authenticated
  WITH CHECK (public.my_role_slug() = 'administrador');
CREATE POLICY "Admin update roles" ON public.roles FOR UPDATE TO authenticated
  USING (public.my_role_slug() = 'administrador') WITH CHECK (public.my_role_slug() = 'administrador');
CREATE POLICY "Admin delete non-system roles" ON public.roles FOR DELETE TO authenticated
  USING (public.my_role_slug() = 'administrador' AND NOT is_system);

-- ===== 3. Config del panel respeta access_mode =====
CREATE OR REPLACE FUNCTION public.get_my_panel_config() RETURNS jsonb
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT jsonb_build_object(
    'role',    (SELECT to_jsonb(r) FROM roles r WHERE r.id = my_role_id()),
    'modules', COALESCE((SELECT jsonb_agg(m ORDER BY m.sort_order) FROM modules m
                 WHERE m.is_enabled AND (
                      m.access_mode = 'all'
                   OR (m.access_mode = 'admin' AND my_role_slug() = 'administrador')
                   OR (m.access_mode = 'role' AND EXISTS (
                         SELECT 1 FROM role_modules rm
                          WHERE rm.module_id = m.id AND rm.role_id = my_role_id())))
               ), '[]'::jsonb),
    'widgets', COALESCE((SELECT jsonb_agg(w ORDER BY w.sort_order) FROM widgets w
                 JOIN role_widgets rw ON rw.widget_id = w.id
                 WHERE rw.role_id = my_role_id() AND w.is_enabled), '[]'::jsonb),
    'quick_actions', COALESCE((SELECT jsonb_agg(q ORDER BY q.sort_order) FROM quick_actions q
                 JOIN role_quick_actions rq ON rq.quick_action_id = q.id
                 WHERE rq.role_id = my_role_id() AND q.is_enabled), '[]'::jsonb)
  )
$$;

-- ===== 4. RPCs de administración =====
CREATE OR REPLACE FUNCTION public.assert_admin() RETURNS void
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF auth.uid() IS NULL OR my_role_slug() IS DISTINCT FROM 'administrador' THEN
    RAISE EXCEPTION 'Solo el Administrador puede realizar esta acción.' USING ERRCODE = '42501';
  END IF;
END $$;

-- Usuarios con su correo (auth.users no es accesible desde el cliente)
CREATE OR REPLACE FUNCTION public.admin_list_users()
RETURNS TABLE (id uuid, full_name text, company text, email text, role_id uuid, created_at timestamptz)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
#variable_conflict use_column
BEGIN
  PERFORM assert_admin();
  RETURN QUERY
    SELECT p.id, p.full_name, p.company, u.email::text, p.role_id, p.created_at
      FROM profiles p JOIN auth.users u ON u.id = p.id
     ORDER BY p.created_at DESC;
END $$;

-- Cambiar el rol de un usuario (nunca el propio, para no quedarse fuera)
CREATE OR REPLACE FUNCTION public.admin_set_user_role(p_user uuid, p_role uuid) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  PERFORM assert_admin();
  IF p_user = auth.uid() THEN
    RAISE EXCEPTION 'No puedes cambiar tu propio rol.';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM roles WHERE id = p_role) THEN
    RAISE EXCEPTION 'El rol seleccionado no existe.';
  END IF;
  UPDATE profiles SET role_id = p_role WHERE id = p_user;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'El usuario no existe.';
  END IF;
END $$;

-- Crear rol (slug automático) y opcionalmente copiar permisos de otro rol
CREATE OR REPLACE FUNCTION public.admin_create_role(
  p_name text, p_description text DEFAULT NULL, p_icon text DEFAULT 'badge',
  p_color text DEFAULT 'lime', p_copy_from uuid DEFAULT NULL
) RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_name text := trim(coalesce(p_name, ''));
  v_base text; v_slug text; v_n int := 1; v_id uuid;
BEGIN
  PERFORM assert_admin();
  IF v_name = '' THEN
    RAISE EXCEPTION 'El nombre del rol es obligatorio.';
  END IF;
  IF EXISTS (SELECT 1 FROM roles WHERE lower(name) = lower(v_name)) THEN
    RAISE EXCEPTION 'Ya existe un rol llamado "%".', v_name;
  END IF;

  v_base := trim(both '_' from regexp_replace(
              translate(lower(v_name), 'áéíóúüñ', 'aeiouun'), '[^a-z0-9]+', '_', 'g'));
  IF v_base = '' THEN v_base := 'rol'; END IF;
  v_slug := v_base;
  WHILE EXISTS (SELECT 1 FROM roles WHERE slug = v_slug) LOOP
    v_n := v_n + 1;
    v_slug := v_base || '_' || v_n;
  END LOOP;

  INSERT INTO roles (slug, name, description, icon, color, is_system)
  VALUES (v_slug, v_name, nullif(trim(p_description), ''),
          coalesce(nullif(p_icon, ''), 'badge'), coalesce(nullif(p_color, ''), 'lime'), false)
  RETURNING id INTO v_id;

  IF p_copy_from IS NOT NULL THEN
    INSERT INTO role_modules (role_id, module_id)
      SELECT v_id, module_id FROM role_modules WHERE role_id = p_copy_from;
    INSERT INTO role_widgets (role_id, widget_id)
      SELECT v_id, widget_id FROM role_widgets WHERE role_id = p_copy_from;
    INSERT INTO role_quick_actions (role_id, quick_action_id)
      SELECT v_id, quick_action_id FROM role_quick_actions WHERE role_id = p_copy_from;
  END IF;

  RETURN v_id;
END $$;

-- Reemplaza todos los permisos de un rol en una sola transacción (botón Guardar)
CREATE OR REPLACE FUNCTION public.admin_save_role_permissions(
  p_role uuid, p_modules uuid[], p_widgets uuid[], p_quick_actions uuid[]
) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  PERFORM assert_admin();
  IF NOT EXISTS (SELECT 1 FROM roles WHERE id = p_role) THEN
    RAISE EXCEPTION 'El rol no existe.';
  END IF;

  DELETE FROM role_modules WHERE role_id = p_role;
  INSERT INTO role_modules (role_id, module_id)
    SELECT p_role, m.id FROM modules m
     WHERE m.id = ANY (coalesce(p_modules, '{}')) AND m.access_mode = 'role';

  DELETE FROM role_widgets WHERE role_id = p_role;
  INSERT INTO role_widgets (role_id, widget_id)
    SELECT p_role, w.id FROM widgets w WHERE w.id = ANY (coalesce(p_widgets, '{}'));

  DELETE FROM role_quick_actions WHERE role_id = p_role;
  INSERT INTO role_quick_actions (role_id, quick_action_id)
    SELECT p_role, q.id FROM quick_actions q WHERE q.id = ANY (coalesce(p_quick_actions, '{}'));
END $$;

-- Eliminar rol: reasigna sus usuarios y luego lo borra (nunca roles de sistema)
CREATE OR REPLACE FUNCTION public.admin_delete_role(p_role uuid, p_reassign_to uuid DEFAULT NULL)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_system boolean;
BEGIN
  PERFORM assert_admin();
  SELECT is_system INTO v_system FROM roles WHERE id = p_role;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'El rol no existe.';
  END IF;
  IF v_system THEN
    RAISE EXCEPTION 'Los roles del sistema no se pueden eliminar.';
  END IF;

  IF EXISTS (SELECT 1 FROM profiles WHERE role_id = p_role) THEN
    IF p_reassign_to IS NULL OR p_reassign_to = p_role
       OR NOT EXISTS (SELECT 1 FROM roles WHERE id = p_reassign_to) THEN
      RAISE EXCEPTION 'Elige un rol válido para reasignar a los usuarios.';
    END IF;
    UPDATE profiles SET role_id = p_reassign_to WHERE role_id = p_role;
  END IF;

  DELETE FROM roles WHERE id = p_role;
END $$;

-- ===== 5. Permisos de ejecución =====
REVOKE EXECUTE ON FUNCTION public.assert_admin()                                        FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.admin_list_users()                                    FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.admin_set_user_role(uuid, uuid)                       FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.admin_create_role(text, text, text, text, uuid)       FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.admin_save_role_permissions(uuid, uuid[], uuid[], uuid[]) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.admin_delete_role(uuid, uuid)                         FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.assert_admin()                                        TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_list_users()                                    TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_set_user_role(uuid, uuid)                       TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_create_role(text, text, text, text, uuid)       TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_save_role_permissions(uuid, uuid[], uuid[], uuid[]) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_delete_role(uuid, uuid)                         TO authenticated;
