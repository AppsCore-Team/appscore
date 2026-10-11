-- Migration: Create email_templates table and register template_emails module
CREATE TABLE IF NOT EXISTS public.email_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  subject text NOT NULL,
  html_content text NOT NULL,
  available_variables jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'email_templates' AND policyname = 'Admins can view email templates'
  ) THEN
    CREATE POLICY "Admins can view email templates"
      ON public.email_templates
      FOR SELECT
      TO authenticated
      USING (
        my_role_slug() = 'administrador'
        OR EXISTS (
          SELECT 1 FROM public.profiles p
          JOIN public.roles r ON p.role_id = r.id
          WHERE p.id = auth.uid() AND (r.slug = 'administrador' OR lower(r.name) = 'administrador')
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'email_templates' AND policyname = 'Admins can insert email templates'
  ) THEN
    CREATE POLICY "Admins can insert email templates"
      ON public.email_templates
      FOR INSERT
      TO authenticated
      WITH CHECK (
        my_role_slug() = 'administrador'
        OR EXISTS (
          SELECT 1 FROM public.profiles p
          JOIN public.roles r ON p.role_id = r.id
          WHERE p.id = auth.uid() AND (r.slug = 'administrador' OR lower(r.name) = 'administrador')
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'email_templates' AND policyname = 'Admins can update email templates'
  ) THEN
    CREATE POLICY "Admins can update email templates"
      ON public.email_templates
      FOR UPDATE
      TO authenticated
      USING (
        my_role_slug() = 'administrador'
        OR EXISTS (
          SELECT 1 FROM public.profiles p
          JOIN public.roles r ON p.role_id = r.id
          WHERE p.id = auth.uid() AND (r.slug = 'administrador' OR lower(r.name) = 'administrador')
        )
      )
      WITH CHECK (
        my_role_slug() = 'administrador'
        OR EXISTS (
          SELECT 1 FROM public.profiles p
          JOIN public.roles r ON p.role_id = r.id
          WHERE p.id = auth.uid() AND (r.slug = 'administrador' OR lower(r.name) = 'administrador')
        )
      );
  END IF;
END $$;

INSERT INTO public.modules (slug, label, route, icon, access_mode, sort_order)
VALUES ('template_emails', 'Template Emails', '/panel/template-emails', 'mark_email_read', 'admin', 7)
ON CONFLICT (slug) DO UPDATE
SET label = EXCLUDED.label,
    route = EXCLUDED.route,
    icon = EXCLUDED.icon,
    access_mode = EXCLUDED.access_mode,
    sort_order = EXCLUDED.sort_order;
