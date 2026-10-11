// Plantillas predeterminadas de fábrica para Brevo
export const DEFAULT_TEMPLATES = {
  welcome: {
    slug: 'welcome',
    name: 'Bienvenida y Activación de Cuenta',
    description: 'Enviado cuando un usuario es creado en el portal o se solicita el enlace de bienvenida para establecer su contraseña.',
    subject: 'Bienvenido a nuestro portal, Confirma tu correo',
    available_variables: [
      { key: 'user_name', description: 'Nombre completo del usuario' },
      { key: 'reset_link', description: 'Enlace de activación/contraseña' },
      { key: 'app_url', description: 'URL base de la aplicación' }
    ],
    sample_data: {
      user_name: 'Alejandro Morales',
      reset_link: 'https://gimicode.com/clientes/?mode=reset&token=sample_token_abc123',
      app_url: 'https://gimicode.com'
    },
    html_content: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="color-scheme" content="dark">
  <meta name="supported-color-schemes" content="dark">
  <title>Bienvenido a nuestro portal, Confirma tu correo</title>
  <style>
    /* RESET */
    html, body {
      margin: 0 !important;
      padding: 0 !important;
      width: 100% !important;
      min-width: 100% !important;
      background-color: #0f1218;
    }
    body {
      font-family: Arial, Helvetica, sans-serif;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    table {
      border-spacing: 0;
      border-collapse: collapse;
    }
    img {
      border: 0;
      outline: none;
      text-decoration: none;
      -ms-interpolation-mode: bicubic;
    }
    a {
      text-decoration: none;
    }

    /* CONTENEDOR GENERAL */
    .email-wrapper {
      width: 100%;
      background-color: #0f1218;
    }
    .email-container {
      width: 700px;
      max-width: 700px;
    }
    .content-padding {
      padding-left: 34px;
      padding-right: 34px;
    }

    /* RESPONSIVE */
    @media only screen and (max-width: 600px) {
      .outer-padding {
        padding: 10px 8px !important;
      }
      .email-container {
        width: 100% !important;
        max-width: 100% !important;
        border-radius: 18px !important;
      }
      .content-padding {
        padding-left: 20px !important;
        padding-right: 20px !important;
      }
      .header-padding {
        padding-top: 22px !important;
        padding-bottom: 16px !important;
      }
      .brand-name {
        font-size: 24px !important;
      }
      .main-title {
        font-size: 26px !important;
        line-height: 33px !important;
      }
      .intro-text {
        font-size: 14px !important;
        line-height: 22px !important;
      }
      .cta-button {
        display: block !important;
        width: auto !important;
        text-align: center !important;
      }
    }

    @media only screen and (max-width: 380px) {
      .content-padding {
        padding-left: 16px !important;
        padding-right: 16px !important;
      }
      .main-title {
        font-size: 24px !important;
        line-height: 31px !important;
      }
    }
  </style>
</head>
<body>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" class="email-wrapper" style="width:100%; background:#0f1218; margin:0; padding:0;">
    <tr>
      <td align="center" class="outer-padding" style="padding:32px 12px;">
        <table role="presentation" width="700" cellspacing="0" cellpadding="0" border="0" class="email-container" style="width:100%; max-width:700px; background:#13171e; border:1px solid #252c36; border-radius:22px; overflow:hidden;">
          <!-- HEADER -->
          <tr>
            <td class="content-padding header-padding" style="padding-top:28px; padding-bottom:18px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td valign="middle">
                    <div class="brand-name" style="font-size:25px; line-height:30px; font-weight:800; color:#ffffff;">
                      Gimi<span style="color:#8fe000;">Code</span>
                    </div>
                    <div style="font-size:11px; line-height:16px; color:#8fe000; font-weight:700; letter-spacing:1.2px;">
                      DESARROLLO DE SOFTWARE A LA MEDIDA
                    </div>
                  </td>
                  <td align="right" valign="middle" style="padding-left:10px;">
                    <div style="display:inline-block; border:1px solid #334124; border-radius:20px; padding:7px 12px; color:#8fe000; font-size:11px; font-weight:700; white-space:nowrap;">
                      BIENVENIDO A NUESTRO PORTAL
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- INTRODUCCIÓN -->
          <tr>
            <td class="content-padding" style="padding-top:10px; padding-bottom:8px;">
              <h1 class="main-title" style="margin:8px 0 10px 0; font-size:28px; line-height:36px; font-weight:800; color:#ffffff;">
                Bienvenido a nuestro portal, {{user_name}}
              </h1>
              <p class="intro-text" style="margin:0; font-size:15px; line-height:24px; color:#c7cfdb;">
                El equipo ha creado tu cuenta. Para poder acceder a nuestra plataforma, por favor establece tu contraseña haciendo clic en el botón de abajo.
              </p>
              
              <!-- IMAGEN MASCOTA -->
              <div style="text-align:center; margin-top:30px; margin-bottom:10px;">
                <img src="https://gimicode.com/gimi_depie.png" alt="GimiCode Mascota" style="width:160px; max-width:100%; height:auto; border:0; outline:none; text-decoration:none;" />
              </div>
            </td>
          </tr>

          <!-- BOTÓN -->
          <tr>
            <td class="content-padding" style="padding-top:22px; padding-bottom:40px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td style="border-radius:12px; background:#8fe000;">
                    <a href="{{reset_link}}" target="_blank" style="display:inline-block; padding:14px 28px; font-size:15px; font-weight:700; color:#0f1218; text-decoration:none; border-radius:12px;">
                      Establecer mi contraseña
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
  },

  invite: {
    slug: 'invite',
    name: 'Invitación con Código de Registro',
    description: 'Enviado cuando se genera una invitación con código exclusivo para un nuevo usuario o cliente.',
    subject: 'GimiCode - Invitación Exclusiva',
    available_variables: [
      { key: 'invite_code', description: 'Código alfanumérico generado' },
      { key: 'app_url', description: 'URL base de la aplicación' },
      { key: 'user_email', description: 'Correo del destinatario invitado' }
    ],
    sample_data: {
      invite_code: 'GIMI-78492',
      app_url: 'https://gimicode.com',
      user_email: 'cliente@ejemplo.com'
    },
    html_content: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="color-scheme" content="dark">
  <meta name="supported-color-schemes" content="dark">
  <title>GimiCode - Invitación Exclusiva</title>
  <style>
    /* RESET */
    html, body {
      margin: 0 !important;
      padding: 0 !important;
      width: 100% !important;
      min-width: 100% !important;
      background-color: #0f1218;
    }
    body {
      font-family: Arial, Helvetica, sans-serif;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    table {
      border-spacing: 0;
      border-collapse: collapse;
    }
    img {
      border: 0;
      outline: none;
      text-decoration: none;
      -ms-interpolation-mode: bicubic;
    }
    a {
      text-decoration: none;
    }

    /* CONTENEDOR GENERAL */
    .email-wrapper {
      width: 100%;
      background-color: #0f1218;
    }
    .email-container {
      width: 700px;
      max-width: 700px;
    }
    .content-padding {
      padding-left: 34px;
      padding-right: 34px;
    }

    /* RESPONSIVE */
    @media only screen and (max-width: 600px) {
      .outer-padding {
        padding: 10px 8px !important;
      }
      .email-container {
        width: 100% !important;
        max-width: 100% !important;
        border-radius: 18px !important;
      }
      .content-padding {
        padding-left: 20px !important;
        padding-right: 20px !important;
      }
      .header-padding {
        padding-top: 22px !important;
        padding-bottom: 16px !important;
      }
      .brand-name {
        font-size: 24px !important;
      }
      .main-title {
        font-size: 26px !important;
        line-height: 33px !important;
      }
      .intro-text {
        font-size: 14px !important;
        line-height: 22px !important;
      }
      .cta-button {
        display: block !important;
        width: auto !important;
        text-align: center !important;
      }
    }

    @media only screen and (max-width: 380px) {
      .content-padding {
        padding-left: 16px !important;
        padding-right: 16px !important;
      }
      .main-title {
        font-size: 24px !important;
        line-height: 31px !important;
      }
    }
  </style>
</head>
<body>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" class="email-wrapper" style="width:100%; background:#0f1218; margin:0; padding:0;">
    <tr>
      <td align="center" class="outer-padding" style="padding:32px 12px;">
        <table role="presentation" width="700" cellspacing="0" cellpadding="0" border="0" class="email-container" style="width:100%; max-width:700px; background:#13171e; border:1px solid #252c36; border-radius:22px; overflow:hidden;">
          <!-- HEADER -->
          <tr>
            <td class="content-padding header-padding" style="padding-top:28px; padding-bottom:18px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td valign="middle">
                    <div class="brand-name" style="font-size:25px; line-height:30px; font-weight:800; color:#ffffff;">
                      Gimi<span style="color:#8fe000;">Code</span>
                    </div>
                    <div style="font-size:11px; line-height:16px; color:#8fe000; font-weight:700; letter-spacing:1.2px;">
                      DESARROLLO DE SOFTWARE A LA MEDIDA
                    </div>
                  </td>
                  <td align="right" valign="middle" style="padding-left:10px;">
                    <div style="display:inline-block; border:1px solid #334124; border-radius:20px; padding:7px 12px; color:#8fe000; font-size:11px; font-weight:700; white-space:nowrap;">
                      INVITACIÓN EXCLUSIVA
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- INTRODUCCIÓN -->
          <tr>
            <td class="content-padding" style="padding-top:10px; padding-bottom:8px;">
              <h1 class="main-title" style="margin:8px 0 10px 0; font-size:30px; line-height:38px; font-weight:800; color:#ffffff;">
                Has sido invitado a GimiCode
              </h1>
              <p class="intro-text" style="margin:0; font-size:15px; line-height:24px; color:#c7cfdb;">
                Has recibido una invitación para unirte a nuestra plataforma. Ingresa el siguiente código al momento de registrarte para activar tu cuenta.
              </p>
              
              <!-- CÓDIGO -->
              <div style="margin-top:20px; text-align:center;">
                <div style="display:inline-block; padding:15px 30px; background:#0d0f14; border:1px dashed #8fe000; border-radius:12px; font-size:24px; font-family:monospace; font-weight:bold; color:#8fe000; letter-spacing:4px;">
                  {{invite_code}}
                </div>
              </div>

              <!-- IMAGEN MASCOTA -->
              <div style="text-align:center; margin-top:30px; margin-bottom:10px;">
                <img src="https://gimicode.com/gimi_depie.png" alt="GimiCode Mascota" style="width:160px; max-width:100%; height:auto; border:0; outline:none; text-decoration:none;" />
              </div>
            </td>
          </tr>

          <!-- BOTÓN -->
          <tr>
            <td class="content-padding" style="padding-top:22px; padding-bottom:40px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
                <tr>
                  <td style="border-radius:12px; background:#8fe000; text-align:center;">
                    <a href="{{app_url}}/clientes/?code={{invite_code}}#registro" target="_blank" style="display:inline-block; padding:14px 28px; font-size:15px; font-weight:700; color:#0f1218; text-decoration:none; border-radius:12px;">
                      Registrarme Ahora
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
  },

  contact: {
    slug: 'contact',
    name: 'Notificación de Solicitud Web',
    description: 'Notificación interna enviada cuando un prospecto completa el formulario de contacto o diagnóstico web.',
    subject: 'GimiCode - Nueva solicitud de diagnóstico',
    available_variables: [
      { key: 'user_name', description: 'Nombre de la persona o contacto' },
      { key: 'user_email', description: 'Correo electrónico de contacto' },
      { key: 'company_name', description: 'Nombre de la empresa u organización' },
      { key: 'project_type', description: 'Tipo de proyecto seleccionado' },
      { key: 'message', description: 'Descripción o mensaje del proyecto' }
    ],
    sample_data: {
      user_name: 'Camila Restrepo',
      user_email: 'camila@innovacion.co',
      company_name: 'Soluciones Digitales S.A.S.',
      project_type: 'Plataforma Web SaaS y App Móvil',
      message: 'Estamos buscando automatizar nuestro sistema de gestión logística con un panel moderno y pasarela de pagos integrada.'
    },
    html_content: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="color-scheme" content="dark">
  <meta name="supported-color-schemes" content="dark">
  <title>GimiCode - Nueva solicitud de diagnóstico</title>
  <style>
    /* RESET */
    html, body {
      margin: 0 !important;
      padding: 0 !important;
      width: 100% !important;
      min-width: 100% !important;
      background-color: #0f1218;
    }
    body {
      font-family: Arial, Helvetica, sans-serif;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    table {
      border-spacing: 0;
      border-collapse: collapse;
    }
    img {
      border: 0;
      outline: none;
      text-decoration: none;
      -ms-interpolation-mode: bicubic;
    }
    a {
      text-decoration: none;
    }

    /* CONTENEDOR GENERAL */
    .email-wrapper {
      width: 100%;
      background-color: #0f1218;
    }
    .email-container {
      width: 700px;
      max-width: 700px;
    }
    .content-padding {
      padding-left: 34px;
      padding-right: 34px;
    }

    /* COLUMNAS */
    .project-column {
      width: 72%;
    }
    .mascot-column {
      width: 28%;
    }
    .contact-half {
      width: 50%;
    }

    /* MASCOTA */
    .mascot {
      width: 175px;
      max-width: 100%;
    }

    /* RESPONSIVE */
    @media only screen and (max-width: 600px) {
      .outer-padding {
        padding: 10px 8px !important;
      }
      .email-container {
        width: 100% !important;
        max-width: 100% !important;
        border-radius: 18px !important;
      }
      .content-padding {
        padding-left: 20px !important;
        padding-right: 20px !important;
      }
      .header-padding {
        padding-top: 22px !important;
        padding-bottom: 16px !important;
      }
      .project-column, .mascot-column {
        display: block !important;
        width: 100% !important;
      }
      .project-column {
        padding-right: 0 !important;
      }
      .mascot-column {
        padding-left: 0 !important;
        padding-top: 24px !important;
        text-align: center !important;
      }
      .contact-half {
        display: block !important;
        width: 100% !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
        padding-bottom: 14px !important;
      }
      .brand-name {
        font-size: 24px !important;
      }
      .main-title {
        font-size: 26px !important;
        line-height: 33px !important;
      }
      .intro-text {
        font-size: 14px !important;
        line-height: 22px !important;
      }
      .mascot {
        width: 185px !important;
        max-width: 185px !important;
        margin: 0 auto !important;
      }
      .cta-wrapper {
        width: 100% !important;
      }
      .cta-button {
        display: block !important;
        width: auto !important;
        text-align: center !important;
      }
      .mobile-footer {
        text-align: center !important;
      }
    }
  </style>
</head>
<body>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" class="email-wrapper" style="width:100%; background:#0f1218; margin:0; padding:0;">
    <tr>
      <td align="center" class="outer-padding" style="padding:32px 12px;">
        <table role="presentation" width="700" cellspacing="0" cellpadding="0" border="0" class="email-container" style="width:100%; max-width:700px; background:#13171e; border:1px solid #252c36; border-radius:22px; overflow:hidden;">
          <!-- HEADER -->
          <tr>
            <td class="content-padding header-padding" style="padding-top:28px; padding-bottom:18px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td valign="middle">
                    <div class="brand-name" style="font-size:25px; line-height:30px; font-weight:800; color:#ffffff;">
                      Gimi<span style="color:#8fe000;">Code</span>
                    </div>
                    <div style="font-size:11px; line-height:16px; color:#8fe000; font-weight:700; letter-spacing:1.2px;">
                      DESARROLLO DE SOFTWARE A LA MEDIDA
                    </div>
                  </td>
                  <td align="right" valign="middle" style="padding-left:10px;">
                    <div style="display:inline-block; border:1px solid #334124; border-radius:20px; padding:7px 12px; color:#8fe000; font-size:11px; font-weight:700; white-space:nowrap;">
                      NUEVA SOLICITUD
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- INTRODUCCIÓN -->
          <tr>
            <td class="content-padding" style="padding-top:10px; padding-bottom:8px;">
              <h1 class="main-title" style="margin:8px 0 10px 0; font-size:30px; line-height:38px; font-weight:800; color:#ffffff;">
                Hemos recibido una nueva solicitud de diagnóstico.
              </h1>
              <p class="intro-text" style="margin:0; font-size:15px; line-height:24px; color:#c7cfdb;">
                Un potencial cliente nos ha enviado información sobre su proyecto. Aquí tienes los datos para revisar la solicitud y darle seguimiento.
              </p>
            </td>
          </tr>

          <!-- INFORMACIÓN + GIMI -->
          <tr>
            <td class="content-padding" style="padding-top:22px; padding-bottom:12px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <!-- COLUMNA INFORMACIÓN -->
                  <td class="project-column" width="72%" valign="top" style="padding-right:14px;">
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#0d1015; border:1px solid #272f3a; border-radius:16px;">
                      <tr>
                        <td style="padding:20px;">
                          <div style="font-size:10px; line-height:15px; color:#8fe000; font-weight:800; letter-spacing:1px;">
                            DATOS DEL CONTACTO
                          </div>
                          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:12px;">
                            <tr>
                              <td class="contact-half" width="50%" valign="top" style="padding:0 8px 14px 0;">
                                <div style="font-size:10px; color:#aeb8c6; font-weight:700; margin-bottom:5px;">NOMBRE</div>
                                <div style="font-size:15px; line-height:22px; color:#ffffff; font-weight:700; word-break:break-word;">{{user_name}}</div>
                              </td>
                              <td class="contact-half" width="50%" valign="top" style="padding:0 0 14px 8px;">
                                <div style="font-size:10px; color:#aeb8c6; font-weight:700; margin-bottom:5px;">CORREO</div>
                                <div style="font-size:14px; line-height:22px; color:#ffffff; word-break:break-word;">{{user_email}}</div>
                              </td>
                            </tr>
                            <tr>
                              <td class="contact-half" width="50%" valign="top" style="padding:0 8px 14px 0;">
                                <div style="font-size:10px; color:#aeb8c6; font-weight:700; margin-bottom:5px;">EMPRESA / ORGANIZACIÓN</div>
                                <div style="font-size:15px; line-height:22px; color:#ffffff; word-break:break-word;">{{company_name}}</div>
                              </td>
                              <td class="contact-half" width="50%" valign="top" style="padding:0 0 14px 8px;">
                                <div style="font-size:10px; color:#aeb8c6; font-weight:700; margin-bottom:5px;">TIPO DE PROYECTO</div>
                                <div style="font-size:15px; line-height:22px; color:#ffffff; word-break:break-word;">{{project_type}}</div>
                              </td>
                            </tr>
                          </table>

                          <div style="border-top:1px solid #252c36; margin:2px 0 16px 0;"></div>

                          <div style="font-size:10px; color:#aeb8c6; font-weight:700; margin-bottom:7px;">DESCRIPCIÓN / NECESIDAD</div>
                          <div style="font-size:14px; line-height:22px; color:#e2e7ee; word-break:break-word;">{{message}}</div>
                        </td>
                      </tr>
                    </table>

                    <!-- BOTÓN -->
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" class="cta-wrapper" style="margin-top:16px;">
                      <tr>
                        <td class="cta-button" style="background:#8fe000; border-radius:12px; padding:13px 20px;">
                          <a href="mailto:{{user_email}}?subject=Respuesta a tu solicitud en GimiCode" style="font-size:14px; line-height:20px; font-weight:800; color:#080b0e; text-decoration:none; display:inline-block;">
                            Responder solicitud &nbsp; →
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>

                  <!-- COLUMNA GIMI -->
                  <td class="mascot-column" width="28%" valign="bottom" align="center" style="padding-left:8px;">
                    <img class="mascot" src="https://gimicode.com/gimi_depie.png" alt="Gimi, mascota de GimiCode" width="175" style="display:block; width:175px; max-width:100%; height:auto; margin:0 auto; border:0; outline:none; text-decoration:none;">
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td class="content-padding" style="padding-top:18px; padding-bottom:28px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-top:1px solid #252c36;">
                <tr>
                  <td class="mobile-footer" style="padding-top:18px;">
                    <div style="font-size:11px; line-height:17px; color:#8994a3;">
                      Solicitud recibida desde el formulario web de GimiCode.
                    </div>
                    <div style="font-size:11px; line-height:17px; color:#626d7c; margin-top:5px;">
                      Este mensaje es una notificación interna. No respondas a este correo para contactar al cliente; utiliza el correo indicado arriba o haz clic en "Responder solicitud".
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- COPYRIGHT -->
        <div style="font-size:10px; line-height:16px; color:#555f6d; margin-top:14px;">
          © GimiCode · Desarrollo de software a la medida
        </div>
      </td>
    </tr>
  </table>
</body>
</html>`
  }
};
