-- =====================================================================
-- Migración: Módulo de Citas y función RPC para leerlas
-- =====================================================================

-- 1. Insertar el módulo
INSERT INTO public.modules (slug, label, icon, route, sort_order) 
VALUES ('citas', 'Citas', 'event', '/panel/citas', 4)
ON CONFLICT (slug) DO NOTHING;

-- 2. Asignar el módulo a los roles Administrador y Cliente
DO $$
DECLARE
  v_admin_id uuid;
  v_client_id uuid;
  v_module_id uuid;
BEGIN
  SELECT id INTO v_admin_id FROM public.roles WHERE slug = 'administrador' LIMIT 1;
  SELECT id INTO v_client_id FROM public.roles WHERE slug = 'cliente' LIMIT 1;
  SELECT id INTO v_module_id FROM public.modules WHERE slug = 'citas' LIMIT 1;

  IF v_admin_id IS NOT NULL AND v_module_id IS NOT NULL THEN
    INSERT INTO public.role_modules (role_id, module_id) VALUES (v_admin_id, v_module_id) ON CONFLICT DO NOTHING;
  END IF;
  IF v_client_id IS NOT NULL AND v_module_id IS NOT NULL THEN
    INSERT INTO public.role_modules (role_id, module_id) VALUES (v_client_id, v_module_id) ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- 3. Función RPC para leer las citas con los nombres de cliente y administrador
CREATE OR REPLACE FUNCTION public.get_appointments()
RETURNS TABLE (
  project_id uuid,
  meeting_date date,
  meeting_time text,
  client_id uuid,
  client_name text,
  admin_id uuid,
  admin_name text,
  project_status text
)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public.my_role_slug() = 'administrador' THEN
    RETURN QUERY
      SELECT pr.id, pr.meeting_date, pr.meeting_time, 
             pr.user_id, c.full_name AS client_name,
             pr.meeting_admin_id, a.full_name AS admin_name,
             pr.status
      FROM public.project_requests pr
      LEFT JOIN public.profiles c ON c.id = pr.user_id
      LEFT JOIN public.profiles a ON a.id = pr.meeting_admin_id
      WHERE pr.meeting_date IS NOT NULL
      ORDER BY pr.meeting_date ASC, pr.meeting_time ASC;
  ELSE
    RETURN QUERY
      SELECT pr.id, pr.meeting_date, pr.meeting_time, 
             pr.user_id, c.full_name AS client_name,
             pr.meeting_admin_id, a.full_name AS admin_name,
             pr.status
      FROM public.project_requests pr
      LEFT JOIN public.profiles c ON c.id = pr.user_id
      LEFT JOIN public.profiles a ON a.id = pr.meeting_admin_id
      WHERE pr.meeting_date IS NOT NULL AND pr.user_id = auth.uid()
      ORDER BY pr.meeting_date ASC, pr.meeting_time ASC;
  END IF;
END $$;
