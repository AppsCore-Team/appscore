# 💻 Documentación Técnica: Panel Cliente

El rol **Cliente** (is_system = true) es la capa segura y aislada de la agencia hacia el exterior.

## 1. Seguridad y Aislamiento (RLS)
El cliente está restringido por Políticas RLS en PostgreSQL:
`sql
USING (auth.uid() = user_id)
`
Esta regla imposibilita que un usuario pueda consultar, listar o eliminar registros ajenos en tablas como project_requests.

## 2. Módulos Técnicos

### 2.1 Nuevo Proyecto (/panel/nuevo-proyecto)
Wizard interactivo de 4 pasos que genera un INSERT inicial con status = 'Pendiente'.
- Paso 1: Contacto.
- Paso 2: El Problema.
- Paso 3: Madurez del proyecto y fechas.
- Paso 4: Criterios de éxito y presupuestos.

> 🖼️ **Pantallazo del Wizard**
> ![Wizard Proyectos](../img/panel_cliente_wizard.png)

### 2.2 Agendamiento y Citas (/panel/citas)
El RPC get_appointments() cruza datos (JOIN) con profiles para mostrarle al cliente con qué líder de desarrollo o administrador tiene agendada una reunión, aplicando internamente su respectivo filtrado de UUID.

### 2.3 Soporte Técnico y Helpdesk (/panel/soporte)
- Arquitectura de incidencias (tickets) en donde el cliente puede enlazar el ticket a un `project_id` específico.
- Interfaz conversacional con soporte nativo para carga y visualización de adjuntos (Zoom Modal UI).
- Integración en tiempo real para insignias "X nuevos" al recibir respuestas del desarrollador asignado o el administrador.
