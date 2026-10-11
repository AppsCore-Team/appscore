# 💻 Documentación Técnica: Landing Page

Este documento es una guía técnica detallada orientada a desarrolladores. Describe la arquitectura, configuración, estructura de componentes y el manejo del backend de la Landing Page.

## 1. Stack Tecnológico y Configuración

El proyecto está construido como un monorepo que alberga varias SPA. La Landing Page es el punto de entrada principal (main).

- **Framework:** React 19 (Vite 8)
- **Estilos:** Tailwind CSS 4
- **Animaciones:** Framer Motion
- **BaaS:** Supabase (PostgreSQL, Edge Functions)

### 1.1 Variables de Entorno (.env)
Vite está configurado en ite.config.js para aceptar prefijos VITE_ y SUPABASE_.

`env
SUPABASE_URL=tu_url_de_supabase
SUPABASE_ANON_KEY=tu_anon_key_de_supabase
`

## 2. Estructura de la Aplicación (src/sections/)
El punto de entrada es src/main.jsx que renderiza src/App.jsx.

- Header.jsx: Navegación con *smooth scroll*.
- Hero.jsx: Sección principal "Above the fold".
- MarketReality.jsx: Comparativa visual (ilustraciones).
- Contact.jsx: Componente interactivo (Formulario).

> 🖼️ **Pantallazo del Hero**
> *(Añadir imagen en ../img/hero.png)*
> ![Hero Section](../img/hero.png)

## 3. Integración Backend (Formulario)

### 3.1 Flujo del Estado Interno (Contact.jsx)
- useRef (form): Captura de datos vía FormData.
- useState (loading): Bloquea botón y UI durante la petición.
- useState (success): Renderiza la confirmación temporal (5s).

### 3.2 Esquema y RLS en Supabase (contact_messages)
- **Estructura:** id, user_name, user_email, message, status.
- **Seguridad (RLS):** Permitido INSERT público (anon). SELECT y UPDATE restringidos a dministrador.

### 3.3 Edge Function: send-contact-email
Se llama mediante POST a Deno utilizando la API de **Brevo**. Requiere las variables BREVO_API_KEY, BREVO_SENDER_EMAIL, y BREVO_RECEIVER_EMAIL en el panel de Supabase.
