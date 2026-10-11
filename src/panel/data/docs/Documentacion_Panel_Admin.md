# 💻 Documentación Técnica: Panel Administrador

El sistema posee un RBAC robusto. Este documento detalla los poderes absolutos del rol **Administrador**.

## 1. Arquitectura RBAC
El ruteo se define dinámicamente mediante usePanelConfig(), el cual consulta el RPC get_my_panel_config().
Para el Administrador se retorna acceso a los módulos con ccess_mode = 'all' o 'admin'.

## 2. Módulos Exclusivos

### 2.1 Permisos (/panel/permisos)
Permite la gestión completa de la plataforma:
- **Gestión:** dmin_list_users() y dmin_set_user_role().
- **Creación dinámica:** RPC dmin_create_role() para generar nuevos roles personalizados.
- **Asignación atómica:** dmin_save_role_permissions() asigna masivamente widgets y módulos en una sola transacción.

> 🖼️ **Pantallazo de Permisos**
> ![Permisos](../img/panel_admin_permisos.png)

### 2.2 Contactos y Proyectos
- Acceso irrestricto (vía RLS) a la tabla contact_messages para pasar leads de "No leído" a "Atendido".
- Control global sobre la tabla de project_requests.

## 3. Seguridad
La base de datos se protege utilizando public.assert_admin(). Esto impide cualquier inyección HTTP desde el frontend obligando a la base de datos a arrojar el código de error 42501 si my_role_slug() no es 'administrador'.

### 2.3 Soporte Técnico (Helpdesk)
- **Arquitectura de Notificaciones Aisladas:** Implementación de `ticket_user_reads` para control de lectura individual (tipo WhatsApp). Los estados de leído/no leído son independientes por usuario administrador/desarrollador.
- **RPC Eficiente:** `get_support_pending_count` calcula el número exacto de notificaciones en base de datos sin sobrecargar el frontend.
- **Asignaciones Seguras:** Modal *glassmorphism* intermedio de validación antes de ejecutar la mutación a la tabla `ticket_assignments`, con el fin de impedir transferencias accidentales de responsabilidad.
