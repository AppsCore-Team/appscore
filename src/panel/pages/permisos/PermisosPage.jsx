import { useState, useEffect } from 'react';
import { usePermissionsAdmin } from './usePermissionsAdmin';
import { RoleList } from './RoleList';
import { RoleEditor } from './RoleEditor';
import { SaveBar } from './SaveBar';
import { UsersTab } from './UsersTab';
import { RoleFormModal } from './RoleFormModal';
import { DeleteRoleModal } from './DeleteRoleModal';
import { UserFormModal } from './UserFormModal';
import { useToast } from '../../components/ui/Toast';
import { supabase } from '../../../supabase'; // For updating roles that aren't managed by usePermissionsAdmin

export function PermisosPage({ profile }) {
  const adminData = usePermissionsAdmin();
  const [activeTab, setActiveTab] = useState('usuarios');
  const [activeRoleId, setActiveRoleId] = useState(null);
  
  // Local sets for the currently edited role
  const [draftModules, setDraftModules] = useState(new Set());
  const [draftWidgets, setDraftWidgets] = useState(new Set());
  const [draftActions, setDraftActions] = useState(new Set());
  
  const [isSaving, setIsSaving] = useState(false);
  const { addToast } = useToast();

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState(null); // null = create, object = edit
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [isModalSubmitting, setIsModalSubmitting] = useState(false);

  const { roles, users, invitations, loading, error, getRoleSets, saveRolePermissions, createRole, deleteRole, adminCreateInvitation, adminCreateUser, cancelInvitation } = adminData;

  // Auto select first role when loaded
  useEffect(() => {
    if (!loading && roles.length > 0 && !activeRoleId) {
      handleSelectRole(roles[0].id);
    }
  }, [loading, roles, activeRoleId]);

  // Load saved permissions into draft when role changes
  const loadDraft = (roleId) => {
    const sets = getRoleSets(roleId);
    setDraftModules(new Set(sets.modules));
    setDraftWidgets(new Set(sets.widgets));
    setDraftActions(new Set(sets.quickActions));
  };

  const handleSelectRole = (roleId) => {
    if (getChangesCount() > 0) {
      if (!window.confirm('Tienes cambios sin guardar. ¿Descartar y cambiar de rol?')) return;
    }
    setActiveRoleId(roleId);
    loadDraft(roleId);
  };

  const handleDiscard = () => {
    loadDraft(activeRoleId);
    addToast('Cambios descartados', 'info');
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveRolePermissions(activeRoleId, draftModules, draftWidgets, draftActions);
      addToast('Permisos actualizados correctamente', 'success');
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Create or Update Role
  const handleFormSubmit = async (data) => {
    setIsModalSubmitting(true);
    try {
      if (formData) {
        // Edit mode (Update via Supabase client as we didn't expose RPC for update)
        const { error } = await supabase
          .from('roles')
          .update({ name: data.name, description: data.description, icon: data.icon, color: data.color })
          .eq('id', activeRoleId);
        if (error) throw error;
        addToast('Rol actualizado', 'success');
        await adminData.reload();
      } else {
        // Create mode
        const newId = await createRole(data.name, data.description, data.icon, data.color, data.copyFrom || null);
        addToast('Rol creado exitosamente', 'success');
        handleSelectRole(newId);
      }
      setIsFormOpen(false);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setIsModalSubmitting(false);
    }
  };

  // Delete Role
  const handleDeleteSubmit = async (reassignTo) => {
    setIsModalSubmitting(true);
    try {
      await deleteRole(activeRoleId, reassignTo || null);
      addToast('Rol eliminado', 'success');
      setIsDeleteOpen(false);
      const remaining = roles.filter(r => r.id !== activeRoleId);
      if (remaining.length > 0) handleSelectRole(remaining[0].id);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setIsModalSubmitting(false);
    }
  };

  const handleUserInvite = async (data) => {
    setIsModalSubmitting(true);
    try {
      await adminCreateInvitation(data.email, data.roleId);
      addToast('Invitación enviada exitosamente', 'success');
      setIsUserFormOpen(false);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setIsModalSubmitting(false);
    }
  };

  const handleUserDirect = async (data) => {
    setIsModalSubmitting(true);
    try {
      await adminCreateUser(data.email, data.fullName, data.company, data.phone, data.roleId);
      addToast('Usuario creado exitosamente', 'success');
      setIsUserFormOpen(false);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setIsModalSubmitting(false);
    }
  };

  // Compare draft vs saved
  const getChangesCount = () => {
    if (!activeRoleId) return 0;
    const saved = getRoleSets(activeRoleId);
    
    let count = 0;
    const diff = (setA, setB) => {
      let d = 0;
      setA.forEach(id => { if (!setB.has(id)) d++; });
      setB.forEach(id => { if (!setA.has(id)) d++; });
      return d;
    };
    
    count += diff(saved.modules, draftModules);
    count += diff(saved.widgets, draftWidgets);
    count += diff(saved.quickActions, draftActions);
    return count;
  };

  // Warn before leaving page if unsaved
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (getChangesCount() > 0) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }); // Sin array de dependencias para que siempre capture el getChangesCount más reciente

  if (loading) return (
    <div className="flex-1 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-lime-500/30 border-t-lime-500 rounded-full animate-spin"></div>
    </div>
  );

  if (error) return (
    <div className="flex-1 p-8 text-red-400">Error: {error}</div>
  );

  const activeRole = roles.find(r => r.id === activeRoleId);
  const changesCount = getChangesCount();

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0c0e12]">
      {/* Header */}
      <header className="px-8 py-6 border-b border-white/[0.05]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-lime-400/10 text-lime-400 flex items-center justify-center">
              <span className="material-symbols-outlined text-[26px]">admin_panel_settings</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Usuarios y Roles</h1>
              <p className="text-sm text-slate-400">Define qué puede ver y hacer cada usuario en el panel.</p>
            </div>
          </div>
          
          {activeTab === 'roles' && (
            <button 
              onClick={() => { setFormData(null); setIsFormOpen(true); }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white text-xs font-semibold border border-white/[0.06] transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Nuevo rol
            </button>
          )}

          {activeTab === 'usuarios' && (
            <button 
              onClick={() => setIsUserFormOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#94d600] hover:bg-[#a3e635] text-black text-xs font-bold shadow-[0_0_15px_rgba(148,214,0,0.2)] transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">person_add</span>
              Nuevo usuario
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-white/[0.06]">
          <button 
            onClick={() => setActiveTab('usuarios')}
            className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'usuarios' ? 'border-lime-400 text-lime-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
          >
            Usuarios
          </button>
          <button 
            onClick={() => setActiveTab('roles')}
            className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'roles' ? 'border-lime-400 text-lime-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
          >
            Roles y permisos
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative">
        {activeTab === 'roles' ? (
          <div className="absolute inset-0 flex">
            {/* Roles Sidebar */}
            <div className="w-72 border-r border-white/[0.05] p-6 overflow-y-auto bg-[#090a0d]/50">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Roles disponibles</h3>
              <RoleList 
                roles={roles} 
                activeRoleId={activeRoleId} 
                onSelectRole={handleSelectRole} 
                adminData={adminData} 
              />
            </div>

            {/* Editor Area */}
            <div className="flex-1 overflow-y-auto p-6 bg-[#0c0e12]">
              {activeRole && (
                <RoleEditor 
                  role={activeRole} 
                  adminData={adminData}
                  drafts={{
                    modules: draftModules, setModules: setDraftModules,
                    widgets: draftWidgets, setWidgets: setDraftWidgets,
                    actions: draftActions, setActions: setDraftActions
                  }}
                  onEdit={() => { setFormData(activeRole); setIsFormOpen(true); }}
                  onDuplicate={() => { setFormData({ name: `${activeRole.name} (Copia)`, description: activeRole.description, icon: activeRole.icon, color: activeRole.color, copyFrom: activeRole.id }); setIsFormOpen(true); }}
                  onDelete={() => setIsDeleteOpen(true)}
                />
              )}
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 overflow-y-auto p-8">
            <UsersTab adminData={adminData} myProfileId={profile?.id} />
          </div>
        )}
      </div>

      <SaveBar 
        changesCount={changesCount} 
        onDiscard={handleDiscard} 
        onSave={handleSave} 
        isSaving={isSaving} 
      />

      <RoleFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        isSubmitting={isModalSubmitting}
        initialData={formData}
        roles={roles}
      />

      <DeleteRoleModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onSubmit={handleDeleteSubmit}
        isSubmitting={isModalSubmitting}
        roleToDelete={activeRole}
        roles={roles}
        usersCount={users.filter(u => u.role_id === activeRoleId).length}
      />

      <UserFormModal
        isOpen={isUserFormOpen}
        onClose={() => setIsUserFormOpen(false)}
        onSubmitDirect={handleUserDirect}
        onSubmitInvite={handleUserInvite}
        isSubmitting={isModalSubmitting}
        roles={roles}
      />
    </div>
  );
}
