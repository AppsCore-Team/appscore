-- =====================================================================
-- Migración: Sistema de solicitudes de proyectos
-- =====================================================================

CREATE TABLE public.project_requests (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) NOT NULL,
    status text DEFAULT 'Pendiente',
    
    -- Sección 1
    contact_name text NOT NULL,
    company text NOT NULL,
    email text NOT NULL,
    role_in_company text,
    
    -- Sección 2
    main_problem text NOT NULL,
    current_solution text,
    
    -- Sección 3
    project_stage text NOT NULL,
    critical_deadline text,
    
    -- Sección 4
    success_criteria text NOT NULL,
    investment_range text,
    
    created_at timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.project_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own requests" 
  ON public.project_requests FOR INSERT TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own requests" 
  ON public.project_requests FOR SELECT TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all requests" 
  ON public.project_requests FOR ALL TO authenticated 
  USING (public.my_role_slug() = 'administrador')
  WITH CHECK (public.my_role_slug() = 'administrador');

-- Insertar los módulos en el sistema de RBAC
INSERT INTO public.modules (slug, label, icon, route, sort_order) VALUES 
('proyectos', 'Proyectos', 'folder_open', '/panel/proyectos', 2),
('nuevo_proyecto', 'Nuevo Proyecto', 'rocket_launch', '/panel/nuevo-proyecto', 3)
ON CONFLICT (slug) DO NOTHING;

-- Insertar acción rápida
INSERT INTO public.quick_actions (slug, title, subtitle, icon, route, sort_order) VALUES
('crear_proyecto', 'Crear nuevo proyecto', 'Cuéntanos tu idea', 'rocket_launch', '/panel/nuevo-proyecto', 1)
ON CONFLICT (slug) DO UPDATE SET route = EXCLUDED.route;
