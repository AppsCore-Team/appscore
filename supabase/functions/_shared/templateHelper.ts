import { createClient } from 'npm:@supabase/supabase-js@2';

export async function getCompiledEmailTemplate(
  slug: string,
  variables: Record<string, string | undefined>,
  fallbackHtml: string,
  fallbackSubject: string
): Promise<{ subject: string; htmlContent: string }> {
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (supabaseUrl && supabaseServiceKey) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      const { data, error } = await supabase
        .from('email_templates')
        .select('subject, html_content')
        .eq('slug', slug)
        .single();

      if (!error && data && data.html_content) {
        let compiledHtml = data.html_content;
        let compiledSubject = data.subject || fallbackSubject;

        for (const [key, val] of Object.entries(variables)) {
          const replacement = val !== undefined && val !== null ? String(val) : '';
          const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
          compiledHtml = compiledHtml.replace(regex, replacement);
          compiledSubject = compiledSubject.replace(regex, replacement);
        }

        return {
          subject: compiledSubject,
          htmlContent: compiledHtml,
        };
      }
    }
  } catch (err) {
    console.error(`[getCompiledEmailTemplate] Error fetching template for ${slug}:`, err);
  }

  // Fallback to hardcoded template
  return {
    subject: fallbackSubject,
    htmlContent: fallbackHtml,
  };
}
