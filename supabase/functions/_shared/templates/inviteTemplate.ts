export const getInviteEmailTemplate = (data: {
  invite_code: string;
  app_url?: string;
}) => {
  return `
<!DOCTYPE html>
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
                  ${data.invite_code}
                </div>
              </div>

              <!-- IMAGEN MASCOTA -->
              <div style="text-align:center; margin-top:30px; margin-bottom:10px;">
                <img src="https://gimicode.vercel.app/gimi_depie.png" alt="GimiCode Mascota" style="width:160px; max-width:100%; height:auto; border:0; outline:none; text-decoration:none;" />
              </div>
            </td>
          </tr>

          <!-- BOTÓN -->
          <tr>
            <td class="content-padding" style="padding-top:22px; padding-bottom:40px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
                <tr>
                  <td style="border-radius:12px; background:#8fe000; text-align:center;">
                    <a href="${data.app_url || 'https://gimicode.vercel.app'}/clientes/?code=${data.invite_code}#registro" target="_blank" style="display:inline-block; padding:14px 28px; font-size:15px; font-weight:700; color:#0f1218; text-decoration:none; border-radius:12px;">
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
</html>
  `;
};
