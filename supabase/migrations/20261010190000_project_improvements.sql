-- 1. Add project_name to project_requests
ALTER TABLE public.project_requests ADD COLUMN IF NOT EXISTS project_name text DEFAULT 'Proyecto sin nombre';

-- 2. Create project_internal_notes table
CREATE TABLE IF NOT EXISTS public.project_internal_notes (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id uuid REFERENCES public.project_requests(id) ON DELETE CASCADE,
    admin_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    content text NOT NULL,
    created_at timestamptz DEFAULT now()
);

ALTER TABLE public.project_internal_notes ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin/Dev can view internal notes' AND tablename = 'project_internal_notes') THEN
        CREATE POLICY "Admin/Dev can view internal notes" ON public.project_internal_notes
            FOR SELECT TO authenticated
            USING (public.my_role_slug() IN ('administrador', 'developer', 'desarrollador'));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin/Dev can insert internal notes' AND tablename = 'project_internal_notes') THEN
        CREATE POLICY "Admin/Dev can insert internal notes" ON public.project_internal_notes
            FOR INSERT TO authenticated
            WITH CHECK (public.my_role_slug() IN ('administrador', 'developer', 'desarrollador'));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin/Dev can delete internal notes' AND tablename = 'project_internal_notes') THEN
        CREATE POLICY "Admin/Dev can delete internal notes" ON public.project_internal_notes
            FOR DELETE TO authenticated
            USING (public.my_role_slug() IN ('administrador', 'developer', 'desarrollador'));
    END IF;
END
$$;

-- 3. Create project_documents table
CREATE TABLE IF NOT EXISTS public.project_documents (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id uuid REFERENCES public.project_requests(id) ON DELETE CASCADE,
    uploaded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    file_name text NOT NULL,
    file_path text NOT NULL,
    file_type text,
    file_size integer,
    created_at timestamptz DEFAULT now()
);

ALTER TABLE public.project_documents ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins/Devs can view all project documents' AND tablename = 'project_documents') THEN
        CREATE POLICY "Admins/Devs can view all project documents" ON public.project_documents
            FOR SELECT TO authenticated
            USING (public.my_role_slug() IN ('administrador', 'developer', 'desarrollador'));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins/Devs can insert project documents' AND tablename = 'project_documents') THEN
        CREATE POLICY "Admins/Devs can insert project documents" ON public.project_documents
            FOR INSERT TO authenticated
            WITH CHECK (public.my_role_slug() IN ('administrador', 'developer', 'desarrollador'));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins/Devs can delete project documents' AND tablename = 'project_documents') THEN
        CREATE POLICY "Admins/Devs can delete project documents" ON public.project_documents
            FOR DELETE TO authenticated
            USING (public.my_role_slug() IN ('administrador', 'developer', 'desarrollador'));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Clients can view their project documents' AND tablename = 'project_documents') THEN
        CREATE POLICY "Clients can view their project documents" ON public.project_documents
            FOR SELECT TO authenticated
            USING (EXISTS (SELECT 1 FROM public.project_requests WHERE id = project_documents.project_id AND user_id = auth.uid()));
    END IF;
END
$$;

-- 4. Storage Bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('project-files', 'project-files', false)
ON CONFLICT (id) DO NOTHING;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins/Devs can manage project files' AND tablename = 'objects') THEN
        CREATE POLICY "Admins/Devs can manage project files" ON storage.objects
            FOR ALL TO authenticated
            USING (bucket_id = 'project-files' AND public.my_role_slug() IN ('administrador', 'developer', 'desarrollador'));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Clients can read project files' AND tablename = 'objects') THEN
        CREATE POLICY "Clients can read project files" ON storage.objects
            FOR SELECT TO authenticated
            USING (bucket_id = 'project-files');
    END IF;
END
$$;

-- 5. RPC function to check invitation validity with normalization (O <-> 0, I <-> 1)
CREATE OR REPLACE FUNCTION public.check_invitation_validity(p_email text, p_code text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_inv record;
    v_norm_code text;
    v_clean_email text;
BEGIN
    v_norm_code := replace(replace(upper(trim(COALESCE(p_code, ''))), 'O', '0'), 'I', '1');
    v_clean_email := lower(trim(COALESCE(p_email, '')));

    IF v_norm_code = '' THEN
        RETURN jsonb_build_object('valid', false, 'error', 'Debes ingresar un código de invitación.');
    END IF;

    SELECT * INTO v_inv FROM public.invitations 
     WHERE replace(replace(upper(trim(code)), 'O', '0'), 'I', '1') = v_norm_code;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('valid', false, 'error', 'El código de invitación no existe o es incorrecto.');
    END IF;

    IF lower(trim(v_inv.email)) != v_clean_email THEN
        RETURN jsonb_build_object(
            'valid', false, 
            'error', 'El código ingresado fue asignado a otro correo electrónico (' || v_inv.email || '). Por favor usa el correo al cual fue enviada la invitación.'
        );
    END IF;

    IF v_inv.status = 'cancelled' THEN
        RETURN jsonb_build_object('valid', false, 'error', 'Esta invitación fue cancelada por un administrador.');
    ELSIF v_inv.status = 'registered' THEN
        RETURN jsonb_build_object('valid', false, 'error', 'Este código de invitación ya fue utilizado para registrar una cuenta.');
    ELSIF v_inv.status != 'pending' THEN
        RETURN jsonb_build_object('valid', false, 'error', 'La invitación no está activa (estado actual: ' || v_inv.status || ').');
    END IF;

    RETURN jsonb_build_object('valid', true);
END;
$$;
GRANT EXECUTE ON FUNCTION public.check_invitation_validity(text, text) TO anon, authenticated;

-- Actualizar validate_invitation_before_signup
CREATE OR REPLACE FUNCTION public.validate_invitation_before_signup()
RETURNS TRIGGER AS $$
DECLARE
    v_invite RECORD;
    v_clean_code text;
    v_clean_email text;
BEGIN
    IF NEW.raw_user_meta_data->>'is_admin_creation' = 'true' THEN
        RETURN NEW;
    END IF;

    v_clean_code := upper(trim(COALESCE(NEW.raw_user_meta_data->>'invite_code', '')));
    v_clean_email := lower(trim(COALESCE(NEW.email, '')));

    IF v_clean_code = '' THEN
        RAISE EXCEPTION 'Se requiere un código de invitación para registrarse.';
    END IF;

    SELECT * INTO v_invite FROM public.invitations 
     WHERE lower(trim(email)) = v_clean_email 
       AND upper(trim(code)) = v_clean_code
       AND status = 'pending';

    IF NOT FOUND THEN
        RAISE EXCEPTION 'El código de invitación es inválido, no coincide con tu correo, o ya fue usado.';
    END IF;

    NEW.raw_user_meta_data := jsonb_set(
        COALESCE(NEW.raw_user_meta_data, '{}'::jsonb),
        '{assigned_role_id}',
        to_jsonb(v_invite.role_id)
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Actualizar handle_new_user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
    v_role_id uuid;
    v_clean_code text;
    v_clean_email text;
BEGIN
    v_clean_code := upper(trim(COALESCE(NEW.raw_user_meta_data->>'invite_code', '')));
    v_clean_email := lower(trim(COALESCE(NEW.email, '')));

    IF v_clean_code != '' THEN
        UPDATE public.invitations
           SET status = 'registered'
         WHERE lower(trim(email)) = v_clean_email 
           AND upper(trim(code)) = v_clean_code;
    END IF;

    v_role_id := (NEW.raw_user_meta_data->>'assigned_role_id')::uuid;
    IF v_role_id IS NULL THEN
        SELECT id INTO v_role_id FROM public.roles WHERE slug = 'cliente' LIMIT 1;
    END IF;

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

-- Actualizar generate_invite_code sin caracteres ambiguos (sin O, 0, I, 1)
CREATE OR REPLACE FUNCTION public.generate_invite_code(length int DEFAULT 8) RETURNS text
LANGUAGE plpgsql AS $$
DECLARE
  chars text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result text := '';
  i int;
BEGIN
  FOR i IN 1..length LOOP
    result := result || substr(chars, (random() * (length(chars) - 1) + 1)::int, 1);
  END LOOP;
  RETURN result;
END $$;

-- 6. Add Foreign Keys to profiles table for PostgREST joins
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_internal_notes_profiles'
    ) THEN
        ALTER TABLE public.project_internal_notes 
        ADD CONSTRAINT fk_internal_notes_profiles 
        FOREIGN KEY (admin_id) REFERENCES public.profiles(id) ON DELETE SET NULL;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_project_docs_profiles'
    ) THEN
        ALTER TABLE public.project_documents 
        ADD CONSTRAINT fk_project_docs_profiles 
        FOREIGN KEY (uploaded_by) REFERENCES public.profiles(id) ON DELETE SET NULL;
    END IF;
END
$$;
