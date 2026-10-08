-- ========== 1. Catálogo de roles ==========
CREATE TABLE public.roles (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        text UNIQUE NOT NULL,
  name        text NOT NULL,
  description text,
  is_system   boolean DEFAULT false,
  created_at  timestamptz DEFAULT now()
);
INSERT INTO public.roles (slug, name, is_system) VALUES
 ('administrador','Administrador',true), 
 ('desarrollador','Desarrollador',true), 
 ('cliente','Cliente',true);

-- ========== 2. Migrar profiles.role (enum) -> role_id (FK) ==========
ALTER TABLE public.profiles ADD COLUMN role_id uuid REFERENCES public.roles(id);

UPDATE public.profiles p SET role_id = r.id FROM public.roles r WHERE r.name = p.role::text;

ALTER TABLE public.profiles ALTER COLUMN role_id SET NOT NULL;
ALTER TABLE public.profiles ALTER COLUMN role_id SET DEFAULT (SELECT id FROM public.roles WHERE slug = 'cliente' LIMIT 1);

ALTER TABLE public.profiles DROP COLUMN role;
DROP TYPE public.user_role CASCADE;

-- ========== 3. Catálogos ==========
CREATE TABLE public.modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL, 
  label text NOT NULL, 
  icon text NOT NULL,
  route text NOT NULL, 
  sort_order int DEFAULT 0, 
  is_enabled boolean DEFAULT true
);

CREATE TABLE public.widgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL, 
  name text NOT NULL,
  zone text NOT NULL CHECK (zone IN ('top','main','side')),
  sort_order int DEFAULT 0, 
  is_enabled boolean DEFAULT true
);

CREATE TABLE public.quick_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL, 
  title text NOT NULL, 
  subtitle text NOT NULL,
  icon text NOT NULL, 
  route text DEFAULT '#',
  sort_order int DEFAULT 0, 
  is_enabled boolean DEFAULT true
);

-- ========== 4. Tablas puente ==========
CREATE TABLE public.role_modules       (role_id uuid REFERENCES public.roles ON DELETE CASCADE, module_id uuid REFERENCES public.modules ON DELETE CASCADE, PRIMARY KEY (role_id, module_id));
CREATE TABLE public.role_widgets       (role_id uuid REFERENCES public.roles ON DELETE CASCADE, widget_id uuid REFERENCES public.widgets ON DELETE CASCADE, PRIMARY KEY (role_id, widget_id));
CREATE TABLE public.role_quick_actions (role_id uuid REFERENCES public.roles ON DELETE CASCADE, quick_action_id uuid REFERENCES public.quick_actions ON DELETE CASCADE, PRIMARY KEY (role_id, quick_action_id));

-- Habilitar RLS en todo
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.widgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quick_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_widgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_quick_actions ENABLE ROW LEVEL SECURITY;

-- ========== 5. Helpers y RPC ==========
CREATE OR REPLACE FUNCTION public.my_role_id() RETURNS uuid
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT role_id FROM profiles WHERE id = auth.uid()
$$;

CREATE OR REPLACE FUNCTION public.my_role_slug() RETURNS text
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT slug FROM roles WHERE id = my_role_id()
$$;

CREATE OR REPLACE FUNCTION public.get_my_panel_config() RETURNS jsonb
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT jsonb_build_object(
    'role',    (SELECT to_jsonb(r) FROM roles r WHERE r.id = my_role_id()),
    'modules', COALESCE((SELECT jsonb_agg(m ORDER BY m.sort_order) FROM modules m
                 JOIN role_modules rm ON rm.module_id = m.id
                 WHERE rm.role_id = my_role_id() AND m.is_enabled), '[]'::jsonb),
    'widgets', COALESCE((SELECT jsonb_agg(w ORDER BY w.sort_order) FROM widgets w
                 JOIN role_widgets rw ON rw.widget_id = w.id
                 WHERE rw.role_id = my_role_id() AND w.is_enabled), '[]'::jsonb),
    'quick_actions', COALESCE((SELECT jsonb_agg(q ORDER BY q.sort_order) FROM quick_actions q
                 JOIN role_quick_actions rq ON rq.quick_action_id = q.id
                 WHERE rq.role_id = my_role_id() AND q.is_enabled), '[]'::jsonb)
  )
$$;

-- ========== 6. RLS Policies ==========
CREATE POLICY "Public read modules" ON public.modules FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public read widgets" ON public.widgets FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public read quick_actions" ON public.quick_actions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public read roles" ON public.roles FOR SELECT TO authenticated USING (true);

CREATE POLICY "Public read role_modules" ON public.role_modules FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public read role_widgets" ON public.role_widgets FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public read role_quick_actions" ON public.role_quick_actions FOR SELECT TO authenticated USING (true);

-- Solo el administrador puede modificar
CREATE POLICY "Admin all roles" ON public.roles FOR ALL TO authenticated USING (my_role_slug() = 'administrador') WITH CHECK (my_role_slug() = 'administrador');
CREATE POLICY "Admin all modules" ON public.modules FOR ALL TO authenticated USING (my_role_slug() = 'administrador') WITH CHECK (my_role_slug() = 'administrador');
CREATE POLICY "Admin all widgets" ON public.widgets FOR ALL TO authenticated USING (my_role_slug() = 'administrador') WITH CHECK (my_role_slug() = 'administrador');
CREATE POLICY "Admin all quick_actions" ON public.quick_actions FOR ALL TO authenticated USING (my_role_slug() = 'administrador') WITH CHECK (my_role_slug() = 'administrador');
CREATE POLICY "Admin all role_modules" ON public.role_modules FOR ALL TO authenticated USING (my_role_slug() = 'administrador') WITH CHECK (my_role_slug() = 'administrador');
CREATE POLICY "Admin all role_widgets" ON public.role_widgets FOR ALL TO authenticated USING (my_role_slug() = 'administrador') WITH CHECK (my_role_slug() = 'administrador');
CREATE POLICY "Admin all role_quick_actions" ON public.role_quick_actions FOR ALL TO authenticated USING (my_role_slug() = 'administrador') WITH CHECK (my_role_slug() = 'administrador');

-- ========== 7. Cerrar la escalada de rol en profiles ==========
DROP POLICY IF EXISTS "Users can update their own profile." ON public.profiles;

CREATE POLICY "Users can update their own profile fields" ON public.profiles 
FOR UPDATE TO authenticated 
USING (auth.uid() = id) 
WITH CHECK (auth.uid() = id);

REVOKE UPDATE ON public.profiles FROM authenticated;
GRANT UPDATE (full_name, company, phone) ON public.profiles TO authenticated;

-- ========== 8. Trigger de alta ==========
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  v_role_id uuid;
BEGIN
    IF NEW.raw_user_meta_data->>'admin_code' IS NOT NULL THEN
        UPDATE public.admin_codes
        SET is_used = true, used_by = NEW.id
        WHERE code = NEW.raw_user_meta_data->>'admin_code';
    END IF;

    SELECT id INTO v_role_id FROM public.roles WHERE slug = 'cliente';

    INSERT INTO public.profiles (id, role_id, admin_code, full_name, company, phone)
    VALUES (
        NEW.id, 
        v_role_id, 
        NEW.raw_user_meta_data->>'admin_code',
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'company',
        NEW.raw_user_meta_data->>'phone'
    );

    RETURN NEW;
END;
$function$;

-- ========== 9. Data Seed ==========
INSERT INTO public.modules (slug, label, icon, route, sort_order) VALUES
('inicio', 'Inicio', 'home', '/panel/', 1),
('proyectos', 'Proyectos', 'code', '/panel/proyectos', 2),
('productos', 'Productos', 'inventory_2', '/panel/productos', 3),
('soporte', 'Soporte', 'support_agent', '/panel/soporte', 4),
('aplicaciones', 'Aplicaciones', 'grid_view', '/panel/aplicaciones', 5),
('base_datos', 'Base de datos', 'database', '/panel/base-datos', 6),
('usuarios', 'Usuarios', 'group', '/panel/usuarios', 7),
('configuracion', 'Configuración', 'settings', '/panel/configuracion', 8);

INSERT INTO public.widgets (slug, name, zone, sort_order) VALUES
('admin_stats', 'Estadísticas', 'top', 1),
('quick_actions', 'Acciones rápidas', 'main', 1),
('call_to_action', '¿Listo para algo grande?', 'main', 2),
('gimi_tip', 'Consejo de Gimi', 'side', 1),
('recent_activity', 'Actividad reciente', 'side', 2);

INSERT INTO public.quick_actions (slug, title, subtitle, icon, route, sort_order) VALUES
('crear_proyecto', 'Crear proyecto', 'Inicia un nuevo proyecto desde cero o con una plantilla.', 'add_circle', '/panel/proyectos/nuevo', 1),
('seguimiento_proyecto', 'Seguimiento proyecto', 'Revisa el avance y métricas de tus proyectos.', 'monitoring', '/panel/proyectos/seguimiento', 2),
('estado_proyecto', 'Estado proyecto', 'Consulta la fase actual de desarrollo.', 'fact_check', '/panel/proyectos/estado', 3),
('solicitudes_proyecto', 'Solicitudes de proyecto', 'Gestiona requerimientos y nuevas solicitudes.', 'assignment', '/panel/proyectos/solicitudes', 4),
('estado_producto', 'Estado producto', 'Verifica el estado de tus productos entregados.', 'inventory_2', '/panel/productos/estado', 5),
('actualizacion_producto', 'Actualización producto', 'Revisa las últimas mejoras y versiones.', 'update', '/panel/productos/actualizaciones', 6),
('ayuda_pqr', 'Ayuda (PQR)', 'Envía peticiones, quejas o reclamos.', 'support_agent', '/panel/soporte/pqr', 7),
('gestionar_aplicaciones', 'Gestionar aplicaciones', 'Despliega, administra y monitorea tus aplicaciones.', 'grid_view', '/panel/aplicaciones', 8),
('ver_bd', 'Ver bases de datos', 'Conecta, administra y explora tus bases de datos.', 'database', '/panel/base-datos', 9),
('configuracion_rapida', 'Configuración', 'Personaliza tu entorno y preferencias.', 'settings', '/panel/configuracion', 10);

DO $$
DECLARE
    r_admin uuid; r_dev uuid; r_cliente uuid;
BEGIN
    SELECT id INTO r_admin FROM public.roles WHERE slug = 'administrador';
    SELECT id INTO r_dev FROM public.roles WHERE slug = 'desarrollador';
    SELECT id INTO r_cliente FROM public.roles WHERE slug = 'cliente';

    INSERT INTO public.role_modules (role_id, module_id) SELECT r_admin, id FROM public.modules WHERE slug = 'inicio';
    INSERT INTO public.role_modules (role_id, module_id) SELECT r_dev, id FROM public.modules WHERE slug = 'inicio';
    INSERT INTO public.role_modules (role_id, module_id) SELECT r_cliente, id FROM public.modules WHERE slug = 'inicio';
    
    INSERT INTO public.role_modules (role_id, module_id) SELECT r_admin, id FROM public.modules WHERE slug = 'proyectos';
    INSERT INTO public.role_modules (role_id, module_id) SELECT r_dev, id FROM public.modules WHERE slug = 'proyectos';
    INSERT INTO public.role_modules (role_id, module_id) SELECT r_cliente, id FROM public.modules WHERE slug = 'proyectos';

    INSERT INTO public.role_modules (role_id, module_id) SELECT r_cliente, id FROM public.modules WHERE slug = 'productos';
    INSERT INTO public.role_modules (role_id, module_id) SELECT r_cliente, id FROM public.modules WHERE slug = 'soporte';

    INSERT INTO public.role_modules (role_id, module_id) SELECT r_admin, id FROM public.modules WHERE slug IN ('aplicaciones', 'base_datos', 'usuarios', 'configuracion');
    INSERT INTO public.role_modules (role_id, module_id) SELECT r_dev, id FROM public.modules WHERE slug IN ('aplicaciones', 'base_datos', 'usuarios', 'configuracion');

    INSERT INTO public.role_widgets (role_id, widget_id) SELECT r_admin, id FROM public.widgets WHERE slug = 'admin_stats';
    
    INSERT INTO public.role_widgets (role_id, widget_id) SELECT r_admin, id FROM public.widgets WHERE slug IN ('quick_actions', 'call_to_action', 'gimi_tip', 'recent_activity');
    INSERT INTO public.role_widgets (role_id, widget_id) SELECT r_dev, id FROM public.widgets WHERE slug IN ('quick_actions', 'call_to_action', 'gimi_tip', 'recent_activity');
    INSERT INTO public.role_widgets (role_id, widget_id) SELECT r_cliente, id FROM public.widgets WHERE slug IN ('quick_actions', 'call_to_action', 'gimi_tip', 'recent_activity');

    INSERT INTO public.role_quick_actions (role_id, quick_action_id) SELECT r_admin, id FROM public.quick_actions WHERE slug = 'crear_proyecto';
    INSERT INTO public.role_quick_actions (role_id, quick_action_id) SELECT r_dev, id FROM public.quick_actions WHERE slug = 'crear_proyecto';
    INSERT INTO public.role_quick_actions (role_id, quick_action_id) SELECT r_cliente, id FROM public.quick_actions WHERE slug = 'crear_proyecto';

    INSERT INTO public.role_quick_actions (role_id, quick_action_id) SELECT r_cliente, id FROM public.quick_actions WHERE slug IN ('seguimiento_proyecto', 'estado_proyecto', 'solicitudes_proyecto', 'estado_producto', 'actualizacion_producto', 'ayuda_pqr');

    INSERT INTO public.role_quick_actions (role_id, quick_action_id) SELECT r_admin, id FROM public.quick_actions WHERE slug IN ('gestionar_aplicaciones', 'ver_bd', 'configuracion_rapida');
    INSERT INTO public.role_quick_actions (role_id, quick_action_id) SELECT r_dev, id FROM public.quick_actions WHERE slug IN ('gestionar_aplicaciones', 'ver_bd', 'configuracion_rapida');
END $$;

-- ========== 10. Limpieza antigua ==========
DROP TABLE IF EXISTS public.sidebar_menu CASCADE;
DROP TABLE IF EXISTS public.quick_actions_menu CASCADE;
