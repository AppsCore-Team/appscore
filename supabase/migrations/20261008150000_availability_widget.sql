-- =====================================================================
-- Migración: Widget de disponibilidad para el Dashboard
-- =====================================================================

-- 1. Actualizar orden de los widgets existentes
UPDATE public.widgets SET sort_order = 2 WHERE slug = 'recent_activity';
UPDATE public.widgets SET sort_order = 3 WHERE slug = 'gimi_tip';

-- 2. Insertar o actualizar el nuevo widget de disponibilidad
INSERT INTO public.widgets (slug, name, zone, sort_order) 
VALUES ('availability', 'Tu Semana', 'side', 1)
ON CONFLICT (slug) DO UPDATE SET sort_order = 1;

-- 2. Asignarlo al rol de administrador
-- Primero verificamos si existe el rol, luego lo vinculamos
DO $$
DECLARE
  v_role_id uuid;
  v_widget_id uuid;
BEGIN
  SELECT id INTO v_role_id FROM public.roles WHERE slug = 'administrador' LIMIT 1;
  SELECT id INTO v_widget_id FROM public.widgets WHERE slug = 'availability' LIMIT 1;

  IF v_role_id IS NOT NULL AND v_widget_id IS NOT NULL THEN
    INSERT INTO public.role_widgets (role_id, widget_id)
    VALUES (v_role_id, v_widget_id)
    ON CONFLICT (role_id, widget_id) DO NOTHING;
  END IF;
END $$;
