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
    const brevoApiKey = Deno.env.get('BREVO_API_KEY');
    const senderEmail = Deno.env.get('BREVO_SENDER_EMAIL') || 'no-reply@gimicode.com';

    if (!brevoApiKey) {
      throw new Error('BREVO_API_KEY no está configurada.');
    }

    // Diagnóstico de Brevo
    if (data.action === 'diagnose') {
      const sendersRes = await fetch('https://api.brevo.com/v3/senders', {
        headers: { 'api-key': brevoApiKey, 'accept': 'application/json' }
      });
      const senders = await sendersRes.json();

      let domains = [];
      try {
        const domRes = await fetch('https://api.brevo.com/v3/senders/domains', {
          headers: { 'api-key': brevoApiKey, 'accept': 'application/json' }
        });
        domains = await domRes.json();
      } catch (e) {
        console.error(e);
      }

      const eventsRes = await fetch('https://api.brevo.com/v3/smtp/statistics/events?limit=10', {
        headers: { 'api-key': brevoApiKey, 'accept': 'application/json' }
      });
      const events = await eventsRes.json();

      return new Response(JSON.stringify({
        success: true,
        envSender: senderEmail,
        senders,
        domains,
        recentEvents: events
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    // Crear remitente en Brevo
    if (data.action === 'create_sender') {
      const createRes = await fetch('https://api.brevo.com/v3/senders', {
        method: 'POST',
        headers: { 'api-key': brevoApiKey, 'accept': 'application/json', 'content-type': 'application/json' },
        body: JSON.stringify({
          name: data.name || "GimiCode",
          email: data.email || "no-reply@mail.gimicode.com"
        })
      });
      const createResult = await createRes.json();
      return new Response(JSON.stringify({ success: createRes.ok, result: createResult }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: createRes.ok ? 200 : 400
      });
    }

    const { to_email, to_name, subject, html_content } = data;

    if (!to_email || !subject || !html_content) {
      throw new Error('Faltan campos obligatorios: to_email, subject, o html_content.');
    }

    // Priorizar remitente autenticado de mail.gimicode.com
    let activeSender = Deno.env.get('BREVO_SENDER_EMAIL') || 'no-reply@mail.gimicode.com';
    try {
      const sendersRes = await fetch('https://api.brevo.com/v3/senders', {
        headers: { 'api-key': brevoApiKey, 'accept': 'application/json' }
      });
      if (sendersRes.ok) {
        const sendersData = await sendersRes.json();
        const validSenders = sendersData.senders || [];
        const domainSender = validSenders.find((s: any) => s.active && (s.email.toLowerCase().endsWith('@mail.gimicode.com') || s.email.toLowerCase().endsWith('@gimicode.com')));
        if (domainSender) {
          activeSender = domainSender.email;
        } else {
          const fallbackSender = validSenders.find((s: any) => s.active);
          if (fallbackSender) activeSender = fallbackSender.email;
        }
      }
    } catch (err) {
      console.warn('[send-test-email] No se pudo verificar la lista de remitentes:', err);
    }

    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': brevoApiKey,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: { name: "GimiCode", email: activeSender },
        to: [{ email: to_email, name: to_name || "Prueba Admin" }],
        subject: subject,
        htmlContent: html_content
      })
    });

    const result = await res.json();
    if (!res.ok) throw new Error(JSON.stringify(result));

    return new Response(JSON.stringify({ 
      success: true, 
      usedSender: activeSender, 
      data: result 
    }), {
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
