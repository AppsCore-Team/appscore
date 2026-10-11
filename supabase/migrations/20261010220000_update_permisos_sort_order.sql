-- Actualizar sort_order de permisos ('Usuarios y Roles') para que aparezca después de 'Mi Disponibilidad' y antes de 'Documentación'
UPDATE public.modules 
SET sort_order = 6 
WHERE slug = 'permisos';
