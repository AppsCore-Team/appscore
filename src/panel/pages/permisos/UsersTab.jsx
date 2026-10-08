import { useState } from 'react';
import { getRoleColor } from '../../components/ui/roleColors';
import { useToast } from '../../components/ui/Toast';

export function UsersTab({ adminData, myProfileId }) {
  const { users, roles, setUserRole, invitations, cancelInvitation, adminCreateInvitation } = adminData;
  const { addToast } = useToast();
  
  const [subTab, setSubTab] = useState('active'); // 'active' | 'pending'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);
  const [resendingId, setResendingId] = useState(null);

  const filteredUsers = users.filter(u => {
    const matchesSearch = (u.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (u.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (u.company || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || u.role_id === filterRole;
    return matchesSearch && matchesRole;
  });

  const filteredInvitations = invitations.filter(inv => {
    const matchesSearch = (inv.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (inv.code || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || inv.role_id === filterRole;
    return matchesSearch && matchesRole && inv.status === 'pending';
  });

  const handleRoleChange = async (userId, newRoleId) => {
    if (userId === myProfileId) {
      addToast('No puedes cambiar tu propio rol por seguridad.', 'error');
      return;
    }
    
    setUpdatingId(userId);
    try {
      await setUserRole(userId, newRoleId);
      addToast('Rol actualizado correctamente', 'success');
    } catch (err) {
      addToast(err.message || 'Error al actualizar el rol', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-6">
      
      {/* Sub Tabs */}
      <div className="flex items-center gap-4 border-b border-white/[0.06]">
        <button 
          onClick={() => setSubTab('active')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${subTab === 'active' ? 'border-lime-400 text-lime-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
        >
          Usuarios Activos ({users.length})
        </button>
        <button 
          onClick={() => setSubTab('pending')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${subTab === 'pending' ? 'border-lime-400 text-lime-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
        >
          Registros Pendientes
          {invitations.filter(i => i.status === 'pending').length > 0 && (
            <span className="px-1.5 py-0.5 rounded-md bg-lime-400/20 text-lime-400 text-[10px] leading-none">
              {invitations.filter(i => i.status === 'pending').length}
            </span>
          )}
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-[20px]">search</span>
          <input 
            type="text" 
            placeholder="Buscar por nombre, correo o empresa..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#12151b] border border-white/[0.06] rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-lime-500/50 transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setFilterRole('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${filterRole === 'all' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'}`}
          >
            Todos
          </button>
          {roles.map(r => {
            const color = getRoleColor(r.color);
            return (
              <button
                key={r.id}
                onClick={() => setFilterRole(r.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${filterRole === r.id ? `${color.bg} ${color.text} border border-${r.color}-500/30` : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'}`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${color.dot}`}></div>
                {r.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#12151b] border border-white/[0.06] rounded-2xl overflow-hidden">
        {subTab === 'active' ? (
        <table className="w-full text-left text-sm">
          <thead className="bg-white/[0.02] text-slate-400 text-xs uppercase tracking-wider font-semibold border-b border-white/[0.06]">
            <tr>
              <th className="px-6 py-4">Usuario</th>
              <th className="px-6 py-4">Empresa</th>
              <th className="px-6 py-4">Registro</th>
              <th className="px-6 py-4 text-right">Rol</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                  No se encontraron usuarios que coincidan con la búsqueda.
                </td>
              </tr>
            ) : (
              filteredUsers.map(user => {
                const isMe = user.id === myProfileId;
                const isUpdating = updatingId === user.id;
                const userRole = roles.find(r => r.id === user.role_id) || roles[0];
                const color = getRoleColor(userRole.color);
                
                return (
                  <tr key={user.id} className={`hover:bg-white/[0.02] transition-colors ${isMe ? 'bg-lime-400/[0.02]' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-bold border border-white/10 flex-shrink-0">
                          {user.full_name?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-200 truncate">{user.full_name || 'Sin nombre'}</span>
                            {isMe && <span className="text-[10px] bg-lime-400/10 text-lime-400 px-1.5 py-0.5 rounded font-bold uppercase">Tú</span>}
                          </div>
                          <span className="text-xs text-slate-500 truncate">{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {user.company || '-'}
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-xs">
                      {new Date(user.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end">
                        {isMe ? (
                          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${color.border} ${color.bg} ${color.text}`}>
                            <span className="material-symbols-outlined text-[16px]">{userRole.icon}</span>
                            <span className="text-xs font-semibold">{userRole.name}</span>
                          </div>
                        ) : (
                          <div className="relative inline-block">
                            {isUpdating && (
                              <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2">
                                <div className="w-4 h-4 border-2 border-slate-500/30 border-t-slate-500 rounded-full animate-spin"></div>
                              </div>
                            )}
                            <select
                              value={user.role_id}
                              onChange={(e) => handleRoleChange(user.id, e.target.value)}
                              disabled={isUpdating}
                              className={`appearance-none outline-none cursor-pointer flex items-center gap-2 pl-3 pr-8 py-1.5 rounded-lg border text-xs font-semibold transition-colors disabled:opacity-50 ${color.bg} ${color.border} ${color.text} ${color.hover}`}
                            >
                              {roles.map(r => (
                                <option key={r.id} value={r.id} className="bg-[#12151b] text-slate-200">
                                  {r.name}
                                </option>
                              ))}
                            </select>
                            <span className={`material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-[16px] pointer-events-none ${color.text}`}>
                              arrow_drop_down
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        ) : (
        <table className="w-full text-left text-sm">
          <thead className="bg-white/[0.02] text-slate-400 text-xs uppercase tracking-wider font-semibold border-b border-white/[0.06]">
            <tr>
              <th className="px-6 py-4">Correo Electrónico</th>
              <th className="px-6 py-4">Código</th>
              <th className="px-6 py-4">Fecha Invitación</th>
              <th className="px-6 py-4 text-right">Rol Asignado</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            {filteredInvitations.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                  No hay invitaciones pendientes.
                </td>
              </tr>
            ) : (
              filteredInvitations.map(inv => {
                const invRole = roles.find(r => r.id === inv.role_id) || roles[0];
                const color = getRoleColor(invRole.color);
                
                return (
                  <tr key={inv.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-bold border border-white/10 flex-shrink-0">
                          <span className="material-symbols-outlined text-sm">mail</span>
                        </div>
                        <span className="font-semibold text-slate-200">{inv.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs px-2 py-1 bg-white/5 border border-white/10 rounded text-slate-300 tracking-widest">{inv.code}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-xs">
                      {new Date(inv.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end">
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${color.border} ${color.bg} ${color.text}`}>
                          <span className="material-symbols-outlined text-[16px]">{invRole.icon}</span>
                          <span className="text-xs font-semibold">{invRole.name}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={async () => {
                            setResendingId(inv.id);
                            try {
                              await adminCreateInvitation(inv.email, inv.role_id);
                              addToast('Invitación reenviada', 'success');
                            } catch (e) { addToast(e.message, 'error'); }
                            finally { setResendingId(null); }
                          }}
                          disabled={resendingId === inv.id}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded transition-colors disabled:opacity-50"
                          title="Reenviar correo"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {resendingId === inv.id ? 'hourglass_empty' : 'send'}
                          </span>
                        </button>
                        <button 
                          onClick={async () => {
                            if(window.confirm('¿Cancelar esta invitación?')) {
                              try {
                                await cancelInvitation(inv.id);
                                addToast('Invitación cancelada', 'success');
                              } catch (e) { addToast(e.message, 'error'); }
                            }
                          }}
                          className="p-1.5 text-red-400 hover:text-white hover:bg-red-500/20 rounded transition-colors"
                          title="Cancelar invitación"
                        >
                          <span className="material-symbols-outlined text-[18px]">cancel</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        )}
      </div>
    </div>
  );
}
