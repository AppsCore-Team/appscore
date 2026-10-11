# 💻 Documentación Técnica: Panel Desarrollador

Rol técnico (`slug = 'desarrollador'`, color violeta, ícono de terminal). Su RBAC le oculta módulos comerciales para enfocarse en ejecución.

## 1. Módulos Asignados (RBAC)

### 1.1 Proyectos (`/panel/proyectos`)
Acceso para lectura de las especificaciones y modificación del `status` ("En desarrollo", "Completado").

### 1.2 Infraestructura (Aplicaciones y DB)
- **Aplicaciones:** Vista de despliegues y logs en producción/staging.
- **Bases de Datos:** Parámetros de conexión y visualización de recursos.

## 2. Quick Actions y Widgets
El `get_my_panel_config()` omite métricas financieras e inyecta acciones para productividad:
- Gestionar aplicaciones
- Ver bases de datos
- Configuración rápida

> 🖼️ **Pantallazo del Dashboard Dev**
> `![Dev Dashboard](../img/panel_dev_dashboard.png)`

### 1.3 Soporte (Helpdesk Interno)
- Acceso a resolver y chatear en tickets de soporte (`/panel/soporte`).
- Las notificaciones de nuevos mensajes son 100% independientes y personales gracias a la tabla `ticket_user_reads`. Un admin que lee un mensaje no borra la alerta para el desarrollador dueño.
