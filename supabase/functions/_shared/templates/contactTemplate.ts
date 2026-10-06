export const getContactEmailTemplate = (data: {
  user_name: string;
  user_email: string;
  company_name: string;
  project_type: string;
  message: string;
}) => {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  >

  <meta
    name="x-apple-disable-message-reformatting"
  >

  <meta
    name="color-scheme"
    content="dark"
  >

  <meta
    name="supported-color-schemes"
    content="dark"
  >

  <title>GimiCode - Nueva solicitud de diagnóstico</title>

  <style>

    /* =========================================================
       RESET
       ========================================================= */

    html,
    body {
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


    /* =========================================================
       CONTENEDOR GENERAL
       ========================================================= */

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


    /* =========================================================
       COLUMNAS
       ========================================================= */

    .project-column {
      width: 72%;
    }

    .mascot-column {
      width: 28%;
    }

    .contact-half {
      width: 50%;
    }


    /* =========================================================
       MASCOTA
       ========================================================= */

    .mascot {
      width: 175px;
      max-width: 100%;
    }


    /* =========================================================
       BOTÓN
       ========================================================= */

    .cta-button {
      display: inline-block;
    }


    /* =========================================================
       RESPONSIVE
       ========================================================= */

    @media only screen and (max-width: 600px) {

      /* -------------------------------------------------------
         CONTENEDOR
         ------------------------------------------------------- */

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


      /* -------------------------------------------------------
         HEADER
         ------------------------------------------------------- */

      .header-padding {
        padding-top: 22px !important;
        padding-bottom: 16px !important;
      }


      /* -------------------------------------------------------
         COLUMNAS
         ------------------------------------------------------- */

      .project-column,
      .mascot-column {
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


      /* -------------------------------------------------------
         CAMPOS
         ------------------------------------------------------- */

      .contact-half {
        display: block !important;
        width: 100% !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
        padding-bottom: 14px !important;
      }


      /* -------------------------------------------------------
         TEXTO
         ------------------------------------------------------- */

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


      /* -------------------------------------------------------
         MASCOTA
         ------------------------------------------------------- */

      .mascot {
        width: 185px !important;
        max-width: 185px !important;
        margin: 0 auto !important;
      }


      /* -------------------------------------------------------
         BOTÓN
         ------------------------------------------------------- */

      .cta-wrapper {
        width: 100% !important;
      }

      .cta-button {
        display: block !important;
        width: auto !important;
        text-align: center !important;
      }


      /* -------------------------------------------------------
         FOOTER
         ------------------------------------------------------- */

      .mobile-footer {
        text-align: center !important;
      }

    }


    /* =========================================================
       CELULARES PEQUEÑOS
       ========================================================= */

    @media only screen and (max-width: 380px) {

      .content-padding {
        padding-left: 16px !important;
        padding-right: 16px !important;
      }

      .main-title {
        font-size: 24px !important;
        line-height: 31px !important;
      }

      .mascot {
        width: 165px !important;
        max-width: 165px !important;
      }

    }

  </style>

</head>


<body>

  <!-- =========================================================
       WRAPPER
       ========================================================= -->

  <table
    role="presentation"
    width="100%"
    cellspacing="0"
    cellpadding="0"
    border="0"
    class="email-wrapper"
    style="
      width:100%;
      background:#0f1218;
      margin:0;
      padding:0;
    "
  >

    <tr>

      <td
        align="center"
        class="outer-padding"
        style="
          padding:32px 12px;
        "
      >


        <!-- ===================================================
             CONTENEDOR PRINCIPAL
             =================================================== -->

        <table
          role="presentation"
          width="700"
          cellspacing="0"
          cellpadding="0"
          border="0"
          class="email-container"
          style="
            width:100%;
            max-width:700px;
            background:#13171e;
            border:1px solid #252c36;
            border-radius:22px;
            overflow:hidden;
          "
        >


          <!-- =================================================
               HEADER
               ================================================= -->

          <tr>

            <td
              class="content-padding header-padding"
              style="
                padding-top:28px;
                padding-bottom:18px;
              "
            >

              <table
                role="presentation"
                width="100%"
                cellspacing="0"
                cellpadding="0"
                border="0"
              >

                <tr>


                  <!-- LOGO -->
                  <td
                    valign="middle"
                  >

                    <div
                      class="brand-name"
                      style="
                        font-size:25px;
                        line-height:30px;
                        font-weight:800;
                        color:#ffffff;
                      "
                    >

                      Gimi<span
                        style="color:#8fe000;"
                      >Code</span>

                    </div>


                    <div
                      style="
                        font-size:11px;
                        line-height:16px;
                        color:#8fe000;
                        font-weight:700;
                        letter-spacing:1.2px;
                      "
                    >
                      DESARROLLO DE SOFTWARE A LA MEDIDA
                    </div>

                  </td>


                  <!-- ESTADO -->
                  <td
                    align="right"
                    valign="middle"
                    style="
                      padding-left:10px;
                    "
                  >

                    <div
                      style="
                        display:inline-block;
                        border:1px solid #334124;
                        border-radius:20px;
                        padding:7px 12px;
                        color:#8fe000;
                        font-size:11px;
                        font-weight:700;
                        white-space:nowrap;
                      "
                    >
                      NUEVA SOLICITUD
                    </div>

                  </td>

                </tr>

              </table>

            </td>

          </tr>



          <!-- =================================================
               INTRODUCCIÓN
               ================================================= -->

          <tr>

            <td
              class="content-padding"
              style="
                padding-top:10px;
                padding-bottom:8px;
              "
            >


              <!-- TITULO -->

              <h1
                class="main-title"
                style="
                  margin:8px 0 10px 0;
                  font-size:30px;
                  line-height:38px;
                  font-weight:800;
                  color:#ffffff;
                "
              >
                Hemos recibido una nueva solicitud de diagnóstico.
              </h1>


              <!-- DESCRIPCIÓN -->

              <p
                class="intro-text"
                style="
                  margin:0;
                  font-size:15px;
                  line-height:24px;
                  color:#c7cfdb;
                "
              >
                Un potencial cliente nos ha enviado información sobre su proyecto.
                Aquí tienes los datos para revisar la solicitud y darle seguimiento.
              </p>

            </td>

          </tr>



          <!-- =================================================
               INFORMACIÓN + GIMI
               ================================================= -->

          <tr>

            <td
              class="content-padding"
              style="
                padding-top:22px;
                padding-bottom:12px;
              "
            >


              <table
                role="presentation"
                width="100%"
                cellspacing="0"
                cellpadding="0"
                border="0"
              >

                <tr>


                  <!-- =========================================
                       COLUMNA INFORMACIÓN
                       ========================================= -->

                  <td
                    class="project-column"
                    width="72%"
                    valign="top"
                    style="
                      padding-right:14px;
                    "
                  >


                    <!-- =======================================
                         TARJETA CONTACTO
                         ======================================= -->

                    <table
                      role="presentation"
                      width="100%"
                      cellspacing="0"
                      cellpadding="0"
                      border="0"
                      style="
                        background:#0d1015;
                        border:1px solid #272f3a;
                        border-radius:16px;
                      "
                    >

                      <tr>

                        <td
                          style="
                            padding:20px;
                          "
                        >


                          <!-- TITULO -->

                          <div
                            style="
                              font-size:10px;
                              line-height:15px;
                              color:#8fe000;
                              font-weight:800;
                              letter-spacing:1px;
                            "
                          >
                            DATOS DEL CONTACTO
                          </div>



                          <!-- =================================
                               CAMPOS
                               ================================= -->

                          <table
                            role="presentation"
                            width="100%"
                            cellspacing="0"
                            cellpadding="0"
                            border="0"
                            style="
                              margin-top:12px;
                            "
                          >


                            <!-- ---------------------------------
                                 NOMBRE / CORREO
                                 --------------------------------- -->

                            <tr>


                              <!-- NOMBRE -->

                              <td
                                class="contact-half"
                                width="50%"
                                valign="top"
                                style="
                                  padding:0 8px 14px 0;
                                "
                              >

                                <div
                                  style="
                                    font-size:10px;
                                    color:#aeb8c6;
                                    font-weight:700;
                                    margin-bottom:5px;
                                  "
                                >
                                  NOMBRE
                                </div>

                                <div
                                  style="
                                    font-size:15px;
                                    line-height:22px;
                                    color:#ffffff;
                                    font-weight:700;
                                    word-break:break-word;
                                  "
                                >
                                  ${data.user_name}
                                </div>

                              </td>



                              <!-- CORREO -->

                              <td
                                class="contact-half"
                                width="50%"
                                valign="top"
                                style="
                                  padding:0 0 14px 8px;
                                "
                              >

                                <div
                                  style="
                                    font-size:10px;
                                    color:#aeb8c6;
                                    font-weight:700;
                                    margin-bottom:5px;
                                  "
                                >
                                  CORREO
                                </div>

                                <div
                                  style="
                                    font-size:14px;
                                    line-height:22px;
                                    color:#ffffff;
                                    word-break:break-word;
                                  "
                                >
                                  ${data.user_email}
                                </div>

                              </td>

                            </tr>



                            <!-- ---------------------------------
                                 EMPRESA / TIPO
                                 --------------------------------- -->

                            <tr>


                              <!-- EMPRESA -->

                              <td
                                class="contact-half"
                                width="50%"
                                valign="top"
                                style="
                                  padding:0 8px 14px 0;
                                "
                              >

                                <div
                                  style="
                                    font-size:10px;
                                    color:#aeb8c6;
                                    font-weight:700;
                                    margin-bottom:5px;
                                  "
                                >
                                  EMPRESA / ORGANIZACIÓN
                                </div>

                                <div
                                  style="
                                    font-size:15px;
                                    line-height:22px;
                                    color:#ffffff;
                                    word-break:break-word;
                                  "
                                >
                                  ${data.company_name}
                                </div>

                              </td>



                              <!-- TIPO -->

                              <td
                                class="contact-half"
                                width="50%"
                                valign="top"
                                style="
                                  padding:0 0 14px 8px;
                                "
                              >

                                <div
                                  style="
                                    font-size:10px;
                                    color:#aeb8c6;
                                    font-weight:700;
                                    margin-bottom:5px;
                                  "
                                >
                                  TIPO DE PROYECTO
                                </div>

                                <div
                                  style="
                                    font-size:15px;
                                    line-height:22px;
                                    color:#ffffff;
                                    word-break:break-word;
                                  "
                                >
                                  ${data.project_type}
                                </div>

                              </td>

                            </tr>

                          </table>



                          <!-- =================================
                               SEPARADOR
                               ================================= -->

                          <div
                            style="
                              border-top:1px solid #252c36;
                              margin:2px 0 16px 0;
                            "
                          ></div>



                          <!-- =================================
                               MENSAJE
                               ================================= -->

                          <div
                            style="
                              font-size:10px;
                              color:#aeb8c6;
                              font-weight:700;
                              margin-bottom:7px;
                            "
                          >
                            DESCRIPCIÓN / NECESIDAD
                          </div>


                          <div
                            style="
                              font-size:14px;
                              line-height:22px;
                              color:#e2e7ee;
                              word-break:break-word;
                            "
                          >
                            ${data.message.replace(/\n/g, '<br>')}
                          </div>


                        </td>

                      </tr>

                    </table>



                    <!-- =======================================
                         BOTÓN
                         ======================================= -->

                    <table
                      role="presentation"
                      cellspacing="0"
                      cellpadding="0"
                      border="0"
                      class="cta-wrapper"
                      style="
                        margin-top:16px;
                      "
                    >

                      <tr>

                        <td
                          class="cta-button"
                          style="
                            background:#8fe000;
                            border-radius:12px;
                            padding:13px 20px;
                          "
                        >

                          <a
                            href="mailto:${data.user_email}?subject=Respuesta a tu solicitud en GimiCode"
                            style="
                              font-size:14px;
                              line-height:20px;
                              font-weight:800;
                              color:#080b0e;
                              text-decoration:none;
                              display:inline-block;
                            "
                          >
                            Responder solicitud &nbsp; →
                          </a>

                        </td>

                      </tr>

                    </table>


                  </td>



                  <!-- =========================================
                       COLUMNA GIMI
                       ========================================= -->

                  <td
                    class="mascot-column"
                    width="28%"
                    valign="bottom"
                    align="center"
                    style="
                      padding-left:8px;
                    "
                  >

                    <img
                      class="mascot"
                      src="https://gimicode.vercel.app/gimi_depie.png"
                      alt="Gimi, mascota de GimiCode"
                      width="175"
                      style="
                        display:block;
                        width:175px;
                        max-width:100%;
                        height:auto;
                        margin:0 auto;
                        border:0;
                        outline:none;
                        text-decoration:none;
                      "
                    >

                  </td>


                </tr>

              </table>

            </td>

          </tr>



          <!-- =================================================
               FOOTER
               ================================================= -->

          <tr>

            <td
              class="content-padding"
              style="
                padding-top:18px;
                padding-bottom:28px;
              "
            >

              <table
                role="presentation"
                width="100%"
                cellspacing="0"
                cellpadding="0"
                border="0"
                style="
                  border-top:1px solid #252c36;
                "
              >

                <tr>

                  <td
                    class="mobile-footer"
                    style="
                      padding-top:18px;
                    "
                  >


                    <div
                      style="
                        font-size:11px;
                        line-height:17px;
                        color:#8994a3;
                      "
                    >
                      Solicitud recibida desde el formulario web de GimiCode.
                    </div>


                    <div
                      style="
                        font-size:11px;
                        line-height:17px;
                        color:#626d7c;
                        margin-top:5px;
                      "
                    >
                      Este mensaje es una notificación interna.
                      No respondas a este correo para contactar al cliente;
                      utiliza el correo indicado arriba o haz clic en "Responder solicitud".
                    </div>


                  </td>

                </tr>

              </table>

            </td>

          </tr>


        </table>



        <!-- ===================================================
             COPYRIGHT
             =================================================== -->

        <div
          style="
            font-size:10px;
            line-height:16px;
            color:#555f6d;
            margin-top:14px;
          "
        >
          © GimiCode · Desarrollo de software a la medida
        </div>


      </td>

    </tr>

  </table>


</body>
</html>
`;
};
