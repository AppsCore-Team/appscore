# 💻 Documentación Técnica: Portal de Clientes (/clientes)

Detalle de la arquitectura y flujo de autenticación del submódulo de acceso para clientes de GimiCode utilizando Supabase Auth.

## 1. Arquitectura del Módulo
Punto de entrada paralelo en ite.config.js (Alias clientes).
- **Ruta:** /clientes/
- **Gestor de Estado:** Variable iew en ClientesPage.jsx.

## 2. Flujo de Vistas (State Machine)

### 2.1 Login (iew === 'login')
- **Método:** supabase.auth.signInWithPassword()
- **Redirección:** /panel/ en caso de éxito.

### 2.2 Registro (iew === 'register')
Captura datos (Nombre, Empresa) y un **Código de Invitación**.
- **Método:** supabase.auth.signUp() (metadata en options.data).
- **Prevención de enumeración:** Valida data.user.identities.length === 0.
- **Edge Function:** Invoca send-welcome-email.

### 2.3 Recuperación (iew === 'recover' y update-password)
- **Recuperar:** supabase.auth.resetPasswordForEmail() redirige a #update-password.
- **Actualizar:** Usa supabase.auth.updateUser() y limpia la URL usando history.replaceState.

> 🖼️ **Pantallazo del Login**
> *(Añadir imagen en ../img/clientes_login.png)*
> ![Login Vista](../img/clientes_login.png)

## 3. Seguridad
**Nota sobre el Código de Invitación:** Se sugiere validar este campo (inviteCode) a nivel de base de datos (con Triggers o RLS) para evitar ingresos no autorizados.
