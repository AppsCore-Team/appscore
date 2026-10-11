-- =====================================================================
-- Migración: Agregado de agenda de reuniones a project_requests
-- =====================================================================

ALTER TABLE public.project_requests ADD COLUMN IF NOT EXISTS meeting_date date;
ALTER TABLE public.project_requests ADD COLUMN IF NOT EXISTS meeting_time text;
ALTER TABLE public.project_requests ADD COLUMN IF NOT EXISTS meeting_admin_id uuid REFERENCES auth.users(id);

-- Índice para acelerar las búsquedas de disponibilidad en una fecha específica
CREATE INDEX IF NOT EXISTS idx_project_requests_meeting ON public.project_requests(meeting_date, meeting_time);
