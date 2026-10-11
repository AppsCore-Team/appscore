# Plan de Implementación: Gestión de Usuarios e Invitaciones

## Descripción del Objetivo
Implementar la capacidad para que el Administrador pueda gestionar la creación de nuevos usuarios directamente o a través de invitaciones por correo electrónico. Esto incluye:
1. Controlar la visibilidad del botón "Nuevo Rol".
2. Añadir botón "Nuevo Usuario" con un modal de dos opciones (Registro directo vs Invitación).
3. Implementar el flujo de "Registro directo" mediante una Edge Function para evitar que el Administrador pierda su sesión.
4. Implementar el flujo de "Invitación" mediante códigos únicos, tabla de registros pendientes y envío de correo con la API de Brevo.
5. Mostrar los "Registros pendientes" en la pestaña de Usuarios.

## Aspectos que requieren revisión (User Review Required)
> [!IMPORTANT]
> **Creación Directa de Usuarios:** Cuando usamos `supabase.auth.signUp()` desde el cliente, Supabase cierra la sesión actual (del admin) y abre la del nuevo usuario. Para evitar esto, propongo crear una **Edge Function (`admin-create-user`)** que use el `service_role_key` para crear el usuario silenciosamente en el backend. ¿Estás de acuerdo con este enfoque?

> [!TIP]
> **Flujo de Códigos de Invitación:** Cuando el usuario reciba el correo e ingrese a `/clientes/#registro`, deberá ingresar el código. Propongo que el frontend valide este código contra la tabla `invitations` **antes** de permitir el registro. Una vez registrado, un trigger en la base de datos detectará el nuevo perfil, marcará la invitación como "registrada" y le asignará automáticamente el rol que el administrador escogió al invitarlo.

## Preguntas Abiertas
1. **Contraseña inicial:** Cuando eliges "Registrar Usuario" directamente, ¿debe el administrador asignarle una contraseña inicial temporal que el usuario luego pueda cambiar? ¿O prefieres que se le envíe un correo para establecerla?
2. **Plantilla de correo:** Para el correo de invitación, usaré la estructura gráfica que ya armamos para la recuperación de contraseña y bienvenida, reemplazando el contenido con la invitación y el código. ¿Deseas algún texto en particular para este correo?

## Cambios Propuestos

### 1. Base de Datos (Migración)
#### [NEW] `supabase/migrations/20261008100000_invitations.sql`
- Crear tabla `invitations` (`id`, `email`, `role_id`, `code`, `status` [pending/registered], `created_at`, `created_by`).
- Crear RPC `admin_create_invitation(p_email, p_role_id)` que genere un código de 6 letras/números y lo guarde.
- Crear RPC `admin_cancel_invitation(p_id)` para cancelar invitaciones.
- Actualizar el trigger de creación de `profiles` para que, si el email coincide con una invitación pendiente, se le asigne el rol de la invitación y cambie el estado de la invitación a `registered`.

---

### 2. Edge Functions (Backend)
#### [NEW] `supabase/functions/admin-create-user/index.ts`
- Edge Function que recibe `email`, `password`, `full_name`, `role_id` y `company`.
- Usa el `SUPABASE_SERVICE_ROLE_KEY` para crear el usuario directamente en `auth.users` sin afectar la sesión del cliente.
- Actualiza el `role_id` en la tabla `profiles`.

#### [NEW] `supabase/functions/send-invite-email/index.ts`
- Similar a `send-welcome-email`, pero con el formato de la invitación.
- Recibe `email`, `code` y genera el correo usando Brevo.
- El correo incluirá las instrucciones y el botón/link hacia `/clientes/#registro`.

---

### 3. Frontend: Panel de Permisos
#### [MODIFY] `src/panel/pages/permisos/PermisosPage.jsx`
- Ocultar el botón "Nuevo rol" cuando la pestaña activa no sea "roles".
- Mostrar el botón "Nuevo usuario" cuando la pestaña activa sea "usuarios".
- Renderizar el nuevo modal `UserFormModal`.

#### [NEW] `src/panel/pages/permisos/UserFormModal.jsx`
- Un modal con dos tabs internos ("Registrar" y "Enviar invitación").
- **Tab Registrar:** Formulario con Nombre, Correo, Empresa, Contraseña Temporal, y selector de Rol.
- **Tab Invitar:** Formulario solo con Correo y selector de Rol.

#### [MODIFY] `src/panel/pages/permisos/UsersTab.jsx`
- Dividir la pantalla en dos secciones o usar un selector de tabla (ej. "Usuarios Activos" vs "Registros Pendientes").
- Mostrar la tabla de invitaciones pendientes, con su estado, código asignado y la opción de reenviar el correo o cancelar la invitación.

#### [MODIFY] `src/panel/pages/permisos/usePermissionsAdmin.js`
- Añadir el `fetch` a la tabla `invitations`.
- Funciones para invocar las Edge Functions de invitar y registrar.

## Plan de Verificación
### Verificación Manual
1. Abrir la pestaña de "Usuarios", presionar "Nuevo usuario".
2. Probar **Registrar Directamente**:
   - Llenar el formulario.
   - Verificar que no se cierre la sesión del admin.
   - Comprobar que el usuario aparece en la tabla de activos con el rol correcto.
3. Probar **Enviar Invitación**:
   - Ingresar un correo y un rol.
   - Comprobar que aparece en la tabla de "Registros Pendientes".
   - Revisar la bandeja de entrada para verificar que llega el correo de Brevo con el código.
   - (Opcional por ahora) Validar en `/clientes/#registro` que el código funciona y que, tras registrarse, desaparece de "pendientes" y adquiere su rol automáticamente.
