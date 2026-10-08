-- Permitir que cualquier usuario autenticado (incluyendo clientes) pueda leer la disponibilidad de los administradores
-- Esto es necesario para que el formulario de creación de proyectos calcule los horarios disponibles.

DROP POLICY IF EXISTS "Admins can view all availabilities" ON public.admin_availability;

CREATE POLICY "Authenticated users can view all availabilities" 
  ON public.admin_availability FOR SELECT TO authenticated 
  USING (true);

-- Función segura para obtener reuniones ocupadas sin exponer datos del proyecto de otros clientes
CREATE OR REPLACE FUNCTION public.get_booked_meetings(p_date date)
RETURNS TABLE (meeting_time text, meeting_admin_id uuid)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  RETURN QUERY
    SELECT pr.meeting_time, pr.meeting_admin_id
    FROM public.project_requests pr
    WHERE pr.meeting_date = p_date
      AND pr.meeting_time IS NOT NULL
      AND pr.meeting_admin_id IS NOT NULL;
END $$;
