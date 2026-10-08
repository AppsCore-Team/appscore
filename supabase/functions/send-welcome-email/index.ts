import { getWelcomeEmailTemplate } from "../_shared/templates/welcomeTemplate.ts";

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
    
    // Asumiendo que el webhook o la app nos envía user_name y user_email
    // Si viene desde un webhook de Supabase (inserción en profiles), `data.record` tendría los datos
    let user_name = data.user_name;
    let user_email = data.user_email;

    // Soporte para Webhook de Supabase
    if (data.type === 'INSERT' && data.table === 'profiles') {
        user_name = data.record.full_name;
        // Necesitaríamos obtener el email del usuario. 
        // Si el webhook viene de `auth.users`, tendríamos el email.
        // Pero como es desde profiles, vamos a asumir que el frontend invoca esta función directamente
        // después de registrarse, para mantenerlo simple y coherente con `send-contact-email`.
    }

    if (!user_name || !user_email) {
        throw new Error('Faltan datos obligatorios: user_name o user_email');
    }

    const brevoApiKey = Deno.env.get('BREVO_API_KEY');
    const senderEmail = Deno.env.get('BREVO_SENDER_EMAIL') || 'no-reply@gimicode.com';
    
    if (!brevoApiKey) {
      throw new Error('BREVO_API_KEY no está configurada.');
    }

    const app_url = req.headers.get('origin') || 'https://gimicode.vercel.app';

    const htmlContent = getWelcomeEmailTemplate({ 
      user_name, 
      reset_link: data.reset_link,
      app_url
    });

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
        subject: `¡Bienvenido a GimiCode, ${user_name}!`,
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
