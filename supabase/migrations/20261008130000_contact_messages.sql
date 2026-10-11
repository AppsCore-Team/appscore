-- =====================================================================
-- Migración: Tabla para mensajes del formulario web de contacto
-- =====================================================================

CREATE TABLE public.contact_messages (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_name text NOT NULL,
    user_email text NOT NULL,
    company_name text NOT NULL,
    project_type text NOT NULL,
    message text NOT NULL,
    status text DEFAULT 'No leído',
    created_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Permitir que CUALQUIERA (incluso sin login) pueda insertar un mensaje desde la web pública
CREATE POLICY "Anyone can insert contact messages" 
  ON public.contact_messages FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Solo los administradores pueden ver los mensajes
CREATE POLICY "Admins can view contact messages" 
  ON public.contact_messages FOR SELECT TO authenticated 
  USING (public.my_role_slug() = 'administrador');

-- Solo los administradores pueden actualizar el estado de los mensajes
CREATE POLICY "Admins can update contact messages" 
  ON public.contact_messages FOR UPDATE TO authenticated 
  USING (public.my_role_slug() = 'administrador')
  WITH CHECK (public.my_role_slug() = 'administrador');

-- Insertar el módulo en el sistema de RBAC
INSERT INTO public.modules (slug, label, icon, route, sort_order) VALUES 
('contactos', 'Mensajes Web', 'mail', '/panel/contactos', 4)
ON CONFLICT (slug) DO NOTHING;
