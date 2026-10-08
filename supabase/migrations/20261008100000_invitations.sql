-- =====================================================================
-- Migración: Nuevo sistema de invitaciones (Reemplaza admin_codes)
-- =====================================================================

-- 1. Eliminar sistema antiguo
DROP TRIGGER IF EXISTS validate_admin_code_trigger ON auth.users;
DROP FUNCTION IF EXISTS public.validate_admin_code_before_signup();

ALTER TABLE public.profiles DROP COLUMN IF EXISTS admin_code;
DROP TABLE IF EXISTS public.admin_codes CASCADE;

-- 2. Crear tabla de invitaciones
CREATE TABLE public.invitations (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    email text NOT NULL,
    role_id uuid NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    code text NOT NULL UNIQUE,
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'registered', 'cancelled')),
    created_at timestamptz DEFAULT now(),
    created_by uuid REFERENCES auth.users(id)
);

-- Solo el administrador puede ver/gestionar invitaciones
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin manage invitations" ON public.invitations
  FOR ALL TO authenticated
  USING (public.my_role_slug() = 'administrador')
  WITH CHECK (public.my_role_slug() = 'administrador');

-- 3. Trigger para validar la invitación antes del registro
CREATE OR REPLACE FUNCTION public.validate_invitation_before_signup()
RETURNS TRIGGER AS $$
DECLARE
    v_invite RECORD;
BEGIN
    -- Si es el admin creando un usuario silenciosamente (Edge Function admin-create-user),
    -- le pondremos un flag en raw_user_meta_data para saltar la validación.
    IF NEW.raw_user_meta_data->>'is_admin_creation' = 'true' THEN
        RETURN NEW;
    END IF;

    -- Validar que el código haya sido proporcionado en el meta_data
    IF NEW.raw_user_meta_data->>'invite_code' IS NULL THEN
        RAISE EXCEPTION 'Se requiere un código de invitación para registrarse.';
    END IF;

    -- Buscar la invitación por email y código
    SELECT * INTO v_invite FROM public.invitations 
     WHERE email = NEW.email 
       AND code = NEW.raw_user_meta_data->>'invite_code' 
       AND status = 'pending';

    IF NOT FOUND THEN
        RAISE EXCEPTION 'El código de invitación es inválido, no coincide con tu correo, o ya fue usado.';
    END IF;

    -- Inyectar el role_id de la invitación en el meta_data para que el trigger handle_new_user lo asigne
    NEW.raw_user_meta_data := jsonb_set(
        COALESCE(NEW.raw_user_meta_data, '{}'::jsonb),
        '{assigned_role_id}',
        to_jsonb(v_invite.role_id)
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER validate_invitation_trigger
    BEFORE INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.validate_invitation_before_signup();

-- 4. Modificar el trigger de nuevo usuario para marcar la invitación y asignar el rol
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
    v_role_id uuid;
BEGIN
    -- 1. Marcar la invitación como registrada si se usó código
    IF NEW.raw_user_meta_data->>'invite_code' IS NOT NULL THEN
        UPDATE public.invitations
           SET status = 'registered'
         WHERE email = NEW.email AND code = NEW.raw_user_meta_data->>'invite_code';
    END IF;

    -- 2. Determinar el rol: 
    -- Puede venir de la invitación (assigned_role_id) o directamente inyectado (por admin-create-user)
    v_role_id := (NEW.raw_user_meta_data->>'assigned_role_id')::uuid;
    IF v_role_id IS NULL THEN
        -- Fallback: Asignar el rol 'Cliente' por defecto si no hay nada
        SELECT id INTO v_role_id FROM public.roles WHERE slug = 'cliente' LIMIT 1;
    END IF;

    -- 3. Crear el perfil
    INSERT INTO public.profiles (id, role_id, full_name, company, phone)
    VALUES (
        NEW.id,
        v_role_id,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'company',
        NEW.raw_user_meta_data->>'phone'
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Función para generar código aleatorio
CREATE OR REPLACE FUNCTION public.generate_invite_code(length int DEFAULT 8) RETURNS text
LANGUAGE plpgsql AS $$
DECLARE
  chars text := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result text := '';
  i int;
BEGIN
  FOR i IN 1..length LOOP
    result := result || substr(chars, (random() * (length(chars) - 1) + 1)::int, 1);
  END LOOP;
  RETURN result;
END $$;

-- 6. RPC para invitar
CREATE OR REPLACE FUNCTION public.admin_create_invitation(p_email text, p_role_id uuid) RETURNS text
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_code text;
BEGIN
    PERFORM assert_admin();
    
    -- Chequear que no haya una invitación pendiente
    IF EXISTS (SELECT 1 FROM invitations WHERE email = p_email AND status = 'pending') THEN
        RAISE EXCEPTION 'El usuario % ya tiene una invitación pendiente.', p_email;
    END IF;

    -- Generar código único
    LOOP
        v_code := generate_invite_code(8);
        EXIT WHEN NOT EXISTS (SELECT 1 FROM invitations WHERE code = v_code);
    END LOOP;

    INSERT INTO invitations (email, role_id, code, created_by)
    VALUES (p_email, p_role_id, v_code, auth.uid());

    RETURN v_code;
END $$;

-- 7. RPC para listar invitaciones (usado en el frontend)
CREATE OR REPLACE FUNCTION public.admin_list_invitations()
RETURNS TABLE (id uuid, email text, code text, status text, created_at timestamptz, role_id uuid)
LANGUAGE plpgsql STABLE SECURITY DEFINER AS $$
#variable_conflict use_column
BEGIN
    PERFORM assert_admin();
    RETURN QUERY
        SELECT id, email, code, status, created_at, role_id
          FROM invitations
         ORDER BY created_at DESC;
END $$;

-- 8. Permisos de ejecución
GRANT EXECUTE ON FUNCTION public.admin_create_invitation(text, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_list_invitations() TO authenticated;
