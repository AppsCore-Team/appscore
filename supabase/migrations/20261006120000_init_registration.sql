-- 1. Crear el ENUM para los roles
CREATE TYPE user_role AS ENUM ('Administrador', 'Cliente', 'Desarrollador');

-- 2. Tabla para almacenar los códigos generados por el administrador
CREATE TABLE public.admin_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    is_used BOOLEAN DEFAULT false,
    used_by UUID REFERENCES auth.users(id), -- Se llena cuando un usuario se registra
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    created_by UUID REFERENCES auth.users(id) -- Administrador que lo creó (para el panel futuro)
);

-- Habilitar RLS para admin_codes
ALTER TABLE public.admin_codes ENABLE ROW LEVEL SECURITY;

-- Insertar códigos de prueba
INSERT INTO public.admin_codes (code) VALUES 
('123456'), 
('123455'), 
('123444'), 
('123333');

-- 3. Tabla para almacenar los perfiles de los usuarios
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role DEFAULT 'Cliente',
    admin_code TEXT REFERENCES public.admin_codes(code),
    full_name TEXT,
    company TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Permitir a los usuarios leer/actualizar su propio perfil
CREATE POLICY "Users can view their own profile." ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 4. Trigger BEFORE INSERT: Validar el código ANTES de crear el usuario en auth.users
CREATE OR REPLACE FUNCTION public.validate_admin_code_before_signup()
RETURNS TRIGGER AS $$
DECLARE
    valid_code BOOLEAN;
BEGIN
    -- Verificar si el código existe y no ha sido usado
    SELECT EXISTS (
        SELECT 1 FROM public.admin_codes 
        WHERE code = NEW.raw_user_meta_data->>'admin_code' AND is_used = false
    ) INTO valid_code;

    IF NOT valid_code THEN
        RAISE EXCEPTION 'Código de administrador inválido o ya ha sido utilizado.';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER validate_admin_code_trigger
    BEFORE INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.validate_admin_code_before_signup();

-- 5. Trigger AFTER INSERT: Crear perfil y marcar código como usado
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Marcar el código como usado
    UPDATE public.admin_codes
    SET is_used = true, used_by = NEW.id
    WHERE code = NEW.raw_user_meta_data->>'admin_code';

    -- Crear el perfil del usuario asignando el rol Cliente y los metadatos
    INSERT INTO public.profiles (id, role, admin_code, full_name, company, phone)
    VALUES (
        NEW.id, 
        'Cliente', 
        NEW.raw_user_meta_data->>'admin_code',
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'company',
        NEW.raw_user_meta_data->>'phone'
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
