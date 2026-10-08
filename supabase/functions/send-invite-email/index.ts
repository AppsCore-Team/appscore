import { getInviteEmailTemplate } from "../_shared/templates/inviteTemplate.ts";

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
    
    const user_email = data.user_email;
    const invite_code = data.invite_code;

    if (!invite_code || !user_email) {
        throw new Error('Faltan datos obligatorios: invite_code o user_email');
    }

    const brevoApiKey = Deno.env.get('BREVO_API_KEY');
    const senderEmail = Deno.env.get('BREVO_SENDER_EMAIL') || 'no-reply@gimicode.com';
    
    if (!brevoApiKey) {
      throw new Error('BREVO_API_KEY no está configurada.');
    }

    const app_url = req.headers.get('origin') || 'https://gimicode.vercel.app';

    const htmlContent = getInviteEmailTemplate({ invite_code, app_url });

    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': brevoApiKey,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: { name: "GimiCode", email: senderEmail },
        to: [{ email: user_email, name: "Invitado" }],
        subject: `Invitación Exclusiva a GimiCode`,
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
