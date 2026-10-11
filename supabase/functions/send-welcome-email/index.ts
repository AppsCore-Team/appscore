import { getWelcomeEmailTemplate } from "../_shared/templates/welcomeTemplate.ts";
import { getCompiledEmailTemplate } from "../_shared/templateHelper.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const data = await req.json();

    let user_name = data.user_name;
    let user_email = data.user_email;

    if (data.type === 'INSERT' && data.table === 'profiles') {
      user_name = data.record.full_name;
    }

    if (!user_name || !user_email) {
      throw new Error('Faltan datos obligatorios: user_name o user_email');
    }

    const brevoApiKey = Deno.env.get('BREVO_API_KEY');
    const senderEmail = Deno.env.get('BREVO_SENDER_EMAIL') || 'no-reply@mail.gimicode.com';

    if (!brevoApiKey) {
      throw new Error('BREVO_API_KEY no está configurada.');
    }

    const app_url = req.headers.get('origin') || 'https://gimicode.com';

    const fallbackHtml = getWelcomeEmailTemplate({
      user_name,
      reset_link: data.reset_link,
      app_url
    });
    const fallbackSubject = 'Bienvenido a nuestro portal, Confirma tu correo';

    const { subject, htmlContent } = await getCompiledEmailTemplate(
      'welcome',
      {
        user_name,
        reset_link: data.reset_link || `${app_url}/clientes`,
        app_url
      },
      fallbackHtml,
      fallbackSubject
    );

    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': brevoApiKey,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: { name: "GimiCode", email: senderEmail },
        to: [{ email: user_email, name: user_name }],
        subject: subject,
        htmlContent: htmlContent
      })
    });

    const result = await res.json();
    if (!res.ok) throw new Error(JSON.stringify(result));

    return new Response(JSON.stringify({ success: true, data: result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
