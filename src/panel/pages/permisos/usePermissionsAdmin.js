import { useState, useEffect } from 'react';
import { supabase } from '../../../supabase';

export function usePermissionsAdmin() {
  const [data, setData] = useState({
    roles: [], modules: [], widgets: [], quickActions: [],
    roleModules: [], roleWidgets: [], roleQuickActions: [], users: [], invitations: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      // Parallel fetch via REST for catalogs
      const [
        { data: rData }, { data: mData }, { data: wData }, { data: qData },
        { data: rmData }, { data: rwData }, { data: rqData },
        { data: uData, error: uErr }, { data: invData, error: invErr }
      ] = await Promise.all([
        supabase.from('roles').select('*').order('created_at'),
        supabase.from('modules').select('*').order('sort_order'),
        supabase.from('widgets').select('*').order('sort_order'),
        supabase.from('quick_actions').select('*').order('sort_order'),
        supabase.from('role_modules').select('*'),
        supabase.from('role_widgets').select('*'),
        supabase.from('role_quick_actions').select('*'),
        supabase.rpc('admin_list_users'),
        supabase.rpc('admin_list_invitations')
      ]);

      if (uErr) throw uErr;
      if (invErr) throw invErr;

      setData({
        roles: rData || [], modules: mData || [], widgets: wData || [], quickActions: qData || [],
        roleModules: rmData || [], roleWidgets: rwData || [], roleQuickActions: rqData || [],
        users: uData || [], invitations: invData || []
      });
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error cargando datos de permisos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  // Helper to get sets of IDs for a specific role
  const getRoleSets = (roleId) => ({
    modules: new Set(data.roleModules.filter(rm => rm.role_id === roleId).map(rm => rm.module_id)),
    widgets: new Set(data.roleWidgets.filter(rw => rw.role_id === roleId).map(rw => rw.widget_id)),
    quickActions: new Set(data.roleQuickActions.filter(rq => rq.role_id === roleId).map(rq => rq.quick_action_id)),
  });

  const saveRolePermissions = async (roleId, moduleIds, widgetIds, actionIds) => {
    const { error } = await supabase.rpc('admin_save_role_permissions', {
      p_role: roleId,
      p_modules: Array.from(moduleIds),
      p_widgets: Array.from(widgetIds),
      p_quick_actions: Array.from(actionIds)
    });
    if (error) throw error;
    await fetchAll();
  };

  const createRole = async (name, description, icon, color, copyFromId) => {
    const { data: newId, error } = await supabase.rpc('admin_create_role', {
      p_name: name, p_description: description, p_icon: icon, p_color: color, p_copy_from: copyFromId
    });
    if (error) throw error;
    await fetchAll();
    return newId;
  };

  const deleteRole = async (roleId, reassignToId) => {
    const { error } = await supabase.rpc('admin_delete_role', {
      p_role: roleId, p_reassign_to: reassignToId
    });
    if (error) throw error;
    await fetchAll();
  };

  const setUserRole = async (userId, roleId) => {
    const { error } = await supabase.rpc('admin_set_user_role', {
      p_user: userId, p_role: roleId
    });
    if (error) throw error;
    await fetchAll();
  };

  const adminCreateInvitation = async (email, roleId) => {
    // 1. Create invitation in DB and get code
    const { data: code, error: dbError } = await supabase.rpc('admin_create_invitation', {
      p_email: email, p_role_id: roleId
    });
    if (dbError) throw dbError;

    // 2. Send email via Edge Function
    const { error: fnError } = await supabase.functions.invoke('send-invite-email', {
      body: { user_email: email, invite_code: code }
    });
    
    if (fnError) {
      console.error('Email sending failed, but invitation created.', fnError);
    }
    await fetchAll();
  };

  const adminCreateUser = async (email, fullName, company, phone, roleId) => {
    const { data, error } = await supabase.functions.invoke('admin-create-user', {
      body: { email, full_name: fullName, company, phone, role_id: roleId }
    });
    if (error) throw error;
    if (data?.error) throw new Error(data.error);
    await fetchAll();
  };

  const cancelInvitation = async (id) => {
    // Para simplificar, usamos Supabase JS para hacer el update de la tabla, ya que hay RLS
    const { error } = await supabase.from('invitations').update({ status: 'cancelled' }).eq('id', id);
    if (error) throw error;
    await fetchAll();
  };

  return { 
    ...data, loading, error, reload: fetchAll, getRoleSets, saveRolePermissions, 
    createRole, deleteRole, setUserRole, adminCreateInvitation, adminCreateUser, cancelInvitation 
  };
}
