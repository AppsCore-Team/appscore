-- =====================================================================
-- Migración: Actualización de permisos para editar proyectos
-- =====================================================================

-- Permite a los clientes actualizar sus propios proyectos SOLO si están en estado 'Pendiente'
CREATE POLICY "Users can update their own requests if pending" 
  ON public.project_requests FOR UPDATE TO authenticated 
  USING (auth.uid() = user_id AND status = 'Pendiente')
  WITH CHECK (auth.uid() = user_id AND status = 'Pendiente');

-- Permite a los administradores actualizar cualquier proyecto en cualquier estado
CREATE POLICY "Admins can update all requests" 
  ON public.project_requests FOR UPDATE TO authenticated 
  USING (public.my_role_slug() = 'administrador')
  WITH CHECK (public.my_role_slug() = 'administrador');
