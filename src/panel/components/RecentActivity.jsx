export function RecentActivity({ role }) {
  const getActivitiesByRole = (role) => {
    if (role === 'Administrador') {
      return [
        { icon: 'code', title: 'Proyecto WebApp actualizado', subtitle: 'Hace 2 horas', iconColor: 'text-lime-400', bgColor: 'bg-lime-400/10' },
        { icon: 'cloud', title: 'Despliegue completado', subtitle: 'api-gimicode v1.0.0 • Hace 5 horas', iconColor: 'text-lime-400', bgColor: 'bg-lime-400/10' },
        { icon: 'database', title: 'Nueva base de datos creada', subtitle: 'gimicode_db • Hace 1 día', iconColor: 'text-lime-400', bgColor: 'bg-lime-400/10' },
        { icon: 'group', title: 'Usuario invitado al equipo', subtitle: 'maria@ejemplo.com • Hace 1 día', iconColor: 'text-lime-400', bgColor: 'bg-lime-400/10' }
      ];
    } else if (role === 'Desarrollador') {
      return [
        { icon: 'commit', title: 'Nuevo commit en frontend', subtitle: 'Hace 1 hora', iconColor: 'text-blue-400', bgColor: 'bg-blue-400/10' },
        { icon: 'bug_report', title: 'Bug #402 resuelto', subtitle: 'Hace 3 horas', iconColor: 'text-green-400', bgColor: 'bg-green-400/10' },
        { icon: 'api', title: 'Endpoint /api/users actualizado', subtitle: 'Hace 1 día', iconColor: 'text-purple-400', bgColor: 'bg-purple-400/10' },
      ];
    } else {
      // Cliente
      return [
        { icon: 'receipt_long', title: 'Factura pagada', subtitle: 'Hace 2 días', iconColor: 'text-emerald-400', bgColor: 'bg-emerald-400/10' },
        { icon: 'support_agent', title: 'Ticket de soporte respondido', subtitle: 'Hace 3 días', iconColor: 'text-amber-400', bgColor: 'bg-amber-400/10' },
        { icon: 'rocket_launch', title: 'Bienvenido a GimiCode', subtitle: '¡Acabas de unirte!', iconColor: 'text-lime-400', bgColor: 'bg-lime-400/10' }
      ];
    }
  };

  const activities = getActivitiesByRole(role);

  return (
    <div className="bg-[#12151b] border border-white/[0.06] rounded-2xl p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-200">
          <span className="material-symbols-outlined text-[18px] text-slate-400">schedule</span>
          <span className="text-xs font-bold">Actividad reciente</span>
        </div>
        <a href="#" className="text-[11px] font-medium text-lime-400 hover:underline">Ver todo</a>
      </div>

      <div className="flex flex-col gap-3">
        {activities.map((activity, idx) => (
          <a key={idx} href="#" className="flex items-center justify-between p-2 rounded-xl hover:bg-white/[0.03] transition-colors group">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg ${activity.bgColor} ${activity.iconColor} flex items-center justify-center flex-shrink-0`}>
                <span className="material-symbols-outlined text-[17px]">{activity.icon}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-slate-200 group-hover:text-lime-400 transition-colors">{activity.title}</span>
                <span className="text-[10px] text-slate-500">{activity.subtitle}</span>
              </div>
            </div>
            <span className="material-symbols-outlined text-slate-600 group-hover:text-slate-300 text-[16px]">chevron_right</span>
          </a>
        ))}
      </div>
    </div>
  );
}
