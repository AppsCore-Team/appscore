import { getRoleColor } from '../../components/ui/roleColors';

export function RoleList({ roles, activeRoleId, onSelectRole, adminData }) {
  const { roleModules, roleWidgets, users } = adminData;

  return (
    <div className="flex flex-col gap-3">
      {roles.map(role => {
        const color = getRoleColor(role.color);
        const isActive = role.id === activeRoleId;
        const userCount = users.filter(u => u.role_id === role.id).length;
        const modCount = roleModules.filter(rm => rm.role_id === role.id).length;
        const widCount = roleWidgets.filter(rw => rw.role_id === role.id).length;

        return (
          <button
            key={role.id}
            onClick={() => onSelectRole(role.id)}
            className={`flex flex-col gap-2 p-4 rounded-2xl text-left transition-all border ${
              isActive 
                ? `${color.bg} ${color.border} shadow-[0_0_20px_rgba(0,0,0,0.1)]` 
                : `bg-[#12151b] border-white/[0.06] hover:border-white/[0.12] hover:bg-[#161a22]`
            }`}
          >
            <div className="flex items-start justify-between w-full">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isActive ? color.bg : 'bg-white/[0.04]'} ${isActive ? color.text : 'text-slate-400'}`}>
                  <span className="material-symbols-outlined text-[20px]">{role.icon}</span>
                </div>
                <div>
                  <h3 className={`font-semibold text-sm ${isActive ? 'text-white' : 'text-slate-200'}`}>
                    {role.name}
                  </h3>
                  {role.is_system && (
                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Sistema</span>
                  )}
                </div>
              </div>
              
              {isActive && (
                <div className={`w-2 h-2 rounded-full ${color.dot} shadow-[0_0_8px_${color.dot}]`} />
              )}
            </div>

            <div className="text-[11px] text-slate-400 mt-1 pl-13 flex flex-col gap-1">
              <p>{userCount} {userCount === 1 ? 'usuario' : 'usuarios'}</p>
              <div className="flex items-center gap-3 opacity-80">
                <span className="flex items-center gap-1" title="Páginas accesibles">
                  <span className="material-symbols-outlined text-[14px]">web</span> {modCount}
                </span>
                <span className="flex items-center gap-1" title="Widgets activos">
                  <span className="material-symbols-outlined text-[14px]">widgets</span> {widCount}
                </span>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
