import { getContactEmailTemplate } from "../_shared/templates/contactTemplate.ts";
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
    const { user_name, user_email, company_name, project_type, message } = data;

    const brevoApiKey = Deno.env.get('BREVO_API_KEY');
    const senderEmail = Deno.env.get('BREVO_SENDER_EMAIL') || 'no-reply@mail.gimicode.com';
    const receiverEmail = Deno.env.get('BREVO_RECEIVER_EMAIL') || 'hola@gimicode.com';
    
    if (!brevoApiKey) {
      throw new Error('BREVO_API_KEY no está configurada.');
    }

    const fallbackHtml = getContactEmailTemplate(data);
    const fallbackSubject = `Nueva solicitud de diagnóstico de ${user_name}`;

    const { subject, htmlContent } = await getCompiledEmailTemplate(
      'contact',
      {
        user_name,
        user_email,
        company_name: company_name || 'No especificada',
        project_type: project_type || 'General',
        message: message ? message.replace(/\n/g, '<br>') : ''
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
        sender: { name: "Formulario Web", email: senderEmail },
        to: [{ email: receiverEmail, name: "Equipo GimiCode" }],
        replyTo: { email: user_email, name: user_name },
        subject: subject,
        htmlContent: htmlContent
      })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(JSON.stringify(data));

    return new Response(JSON.stringify({ success: true, data }), {
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
