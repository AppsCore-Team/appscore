CREATE TABLE public.sidebar_menu (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    role_name TEXT NOT NULL,
    label TEXT NOT NULL,
    icon TEXT NOT NULL,
    link_url TEXT DEFAULT '#',
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT false
);

CREATE TABLE public.quick_actions_menu (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    role_name TEXT NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    icon TEXT NOT NULL,
    link_url TEXT DEFAULT '#',
    sort_order INT DEFAULT 0
);

-- Habilitar RLS
ALTER TABLE public.sidebar_menu ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quick_actions_menu ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura pública (cualquiera autenticado puede leer)
CREATE POLICY "sidebar_menu_read_all" ON public.sidebar_menu FOR SELECT TO authenticated USING (true);
CREATE POLICY "quick_actions_menu_read_all" ON public.quick_actions_menu FOR SELECT TO authenticated USING (true);

-- Insertar Menú para Cliente
INSERT INTO public.sidebar_menu (role_name, label, icon, sort_order, is_active) VALUES
('Cliente', 'Inicio', 'home', 1, true),
('Cliente', 'Proyectos', 'code', 2, false),
('Cliente', 'Productos', 'inventory_2', 3, false),
('Cliente', 'Soporte', 'support_agent', 4, false);

-- Insertar Menú para Administrador
INSERT INTO public.sidebar_menu (role_name, label, icon, sort_order, is_active) VALUES
('Administrador', 'Inicio', 'home', 1, true),
('Administrador', 'Proyectos', 'code', 2, false),
('Administrador', 'Aplicaciones', 'grid_view', 3, false),
('Administrador', 'Base de datos', 'database', 4, false),
('Administrador', 'Usuarios', 'group', 5, false),
('Administrador', 'Configuración', 'settings', 6, false);

-- Insertar Menú para Desarrollador
INSERT INTO public.sidebar_menu (role_name, label, icon, sort_order, is_active) VALUES
('Desarrollador', 'Inicio', 'home', 1, true),
('Desarrollador', 'Proyectos', 'code', 2, false),
('Desarrollador', 'Aplicaciones', 'grid_view', 3, false),
('Desarrollador', 'Base de datos', 'database', 4, false),
('Desarrollador', 'Usuarios', 'group', 5, false),
('Desarrollador', 'Configuración', 'settings', 6, false);

-- Insertar Acciones Rápidas para Cliente
INSERT INTO public.quick_actions_menu (role_name, title, subtitle, icon, sort_order) VALUES
('Cliente', 'Crear proyecto', 'Inicia un nuevo proyecto desde cero o con una plantilla.', 'add_circle', 1),
('Cliente', 'Seguimiento proyecto', 'Revisa el avance y métricas de tus proyectos.', 'monitoring', 2),
('Cliente', 'Estado proyecto', 'Consulta la fase actual de desarrollo.', 'fact_check', 3),
('Cliente', 'Solicitudes de proyecto', 'Gestiona requerimientos y nuevas solicitudes.', 'assignment', 4),
('Cliente', 'Estado producto', 'Verifica el estado de tus productos entregados.', 'inventory_2', 5),
('Cliente', 'Actualización producto', 'Revisa las últimas mejoras y versiones.', 'update', 6),
('Cliente', 'Ayuda (PQR)', 'Envía peticiones, quejas o reclamos.', 'support_agent', 7);

-- Insertar Acciones Rápidas para Administrador
INSERT INTO public.quick_actions_menu (role_name, title, subtitle, icon, sort_order) VALUES
('Administrador', 'Crear proyecto', 'Inicia un nuevo proyecto desde cero o con una plantilla.', 'add_circle', 1),
('Administrador', 'Gestionar aplicaciones', 'Despliega, administra y monitorea tus aplicaciones.', 'grid_view', 2),
('Administrador', 'Ver bases de datos', 'Conecta, administra y explora tus bases de datos.', 'database', 3),
('Administrador', 'Configuración', 'Personaliza tu entorno y preferencias.', 'settings', 4);

-- Insertar Acciones Rápidas para Desarrollador
INSERT INTO public.quick_actions_menu (role_name, title, subtitle, icon, sort_order) VALUES
('Desarrollador', 'Crear proyecto', 'Inicia un nuevo proyecto desde cero o con una plantilla.', 'add_circle', 1),
('Desarrollador', 'Gestionar aplicaciones', 'Despliega, administra y monitorea tus aplicaciones.', 'grid_view', 2),
('Desarrollador', 'Ver bases de datos', 'Conecta, administra y explora tus bases de datos.', 'database', 3),
('Desarrollador', 'Configuración', 'Personaliza tu entorno y preferencias.', 'settings', 4);
