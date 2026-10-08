-- =====================================================================
-- Migración: Tabla para disponibilidad horaria de administradores
-- =====================================================================

CREATE TABLE public.admin_availability (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) NOT NULL UNIQUE,
    schedule_type text NOT NULL DEFAULT 'fixed', -- 'fixed' o 'custom'
    schedule_data jsonb NOT NULL DEFAULT '{}'::jsonb,
    updated_at timestamptz DEFAULT now(),
    created_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.admin_availability ENABLE ROW LEVEL SECURITY;

-- Políticas
-- Los administradores pueden ver todas las disponibilidades
CREATE POLICY "Admins can view all availabilities" 
  ON public.admin_availability FOR SELECT TO authenticated 
  USING (public.my_role_slug() = 'administrador');

-- Los administradores pueden insertar/actualizar su PROPIA disponibilidad
CREATE POLICY "Admins can manage their own availability" 
  ON public.admin_availability FOR ALL TO authenticated 
  USING (auth.uid() = user_id AND public.my_role_slug() = 'administrador')
  WITH CHECK (auth.uid() = user_id AND public.my_role_slug() = 'administrador');

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at() 
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_admin_availability_updated_at
  BEFORE UPDATE ON public.admin_availability
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Insertar el módulo en el sistema de RBAC
INSERT INTO public.modules (slug, label, icon, route, sort_order) VALUES 
('disponibilidad', 'Mi Disponibilidad', 'schedule', '/panel/disponibilidad', 5)
ON CONFLICT (slug) DO NOTHING;
