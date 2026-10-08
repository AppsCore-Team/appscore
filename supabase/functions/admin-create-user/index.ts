import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Faltan variables de entorno de Supabase.');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { email, full_name, role_id, company, phone } = await req.json();

    if (!email || !full_name || !role_id) {
      throw new Error('Faltan campos obligatorios: email, full_name, role_id.');
    }

    // 1. Generate a random password (it won't be used, user will reset it)
    const randomPassword = crypto.randomUUID();

    // 2. Create the user silently
    const { data: userData, error: createError } = await supabase.auth.admin.createUser({
      email,
      password: randomPassword,
      email_confirm: true, // Auto confirm so they can reset password directly
      user_metadata: {
        full_name,
        company,
        phone,
        is_admin_creation: 'true', // Bypasses the validate_invitation trigger
        assigned_role_id: role_id, // Handled by handle_new_user trigger
      }
    });

    if (createError) throw createError;

    // 3. Generate a password recovery link
    const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
      type: 'recovery',
      email: email,
      options: {
        redirectTo: 'https://gimicode.com/clientes/#update-password' // Or dynamic from request
      }
    });

    if (linkError) throw linkError;

    // 4. Send the welcome email with the reset link via our Brevo function
    // We can just return the link and let the client call the email function, or call it from here.
    // Let's call it from here to keep it reliable.
    const baseUrl = Deno.env.get('SUPABASE_URL'); // We can use this to call our own function
    const emailRes = await fetch(`${baseUrl}/functions/v1/send-welcome-email`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_name: full_name,
        user_email: email,
        reset_link: linkData.properties.action_link
      })
    });

    if (!emailRes.ok) {
      console.error('Error sending welcome email', await emailRes.text());
      // We don't fail the user creation if email fails, but we note it.
    }

    return new Response(JSON.stringify({ success: true, user: userData.user }), {
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
