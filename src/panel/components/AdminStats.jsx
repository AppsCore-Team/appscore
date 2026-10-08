import { useState, useEffect } from 'react';
import { supabase } from '../../supabase';

export function AdminStats() {
  const [stats, setStats] = useState({
    activeProjects: { total: 0, thisMonth: 0 },
    deployedApps: { total: 0, thisMonth: 0 },
    databases: { total: 1, thisMonth: 0 },
    clients: { total: 0, thisMonth: 0 },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

        // 1. Proyectos activos (status != 'Completado' AND status != 'Rechazado')
        const { data: activeData } = await supabase
          .from('project_requests')
          .select('created_at')
          .neq('status', 'Completado')
          .neq('status', 'Rechazado');
        
        // 2. Aplicaciones desplegadas (status == 'Desplegado')
        const { data: deployedData } = await supabase
          .from('project_requests')
          .select('created_at')
          .eq('status', 'Desplegado');

        // 3. Clientes registrados
        const { data: clientRole } = await supabase
          .from('roles')
          .select('id')
          .eq('slug', 'cliente')
          .single();

        const { data: usersData } = await supabase.rpc('admin_list_users');
        let clientsData = [];
        if (usersData && clientRole) {
          clientsData = usersData.filter(u => u.role_id === clientRole.id);
        }

        const countThisMonth = (arr) => arr ? arr.filter(item => item.created_at >= startOfMonth).length : 0;

        setStats({
          activeProjects: { 
            total: activeData ? activeData.length : 0, 
            thisMonth: countThisMonth(activeData) 
          },
          deployedApps: { 
            total: deployedData ? deployedData.length : 0, 
            thisMonth: countThisMonth(deployedData) 
          },
          databases: { total: 1, thisMonth: 0 },
          clients: { 
            total: clientsData.length, 
            thisMonth: countThisMonth(clientsData) 
          },
        });
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-[#12151b] border border-white/[0.06] rounded-2xl p-5 h-[140px]"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-[#12151b] border border-white/[0.06] hover:border-white/[0.12] rounded-2xl p-5 flex flex-col justify-between transition-all">
        <div className="w-10 h-10 rounded-xl bg-lime-400/10 text-lime-400 flex items-center justify-center mb-3">
          <span className="material-symbols-outlined text-[22px]">deployed_code</span>
        </div>
        <div>
          <span className="text-xs text-slate-400 block mb-1">Proyectos activos</span>
          <span className="text-2xl font-bold text-white tracking-tight">{stats.activeProjects.total}</span>
        </div>
        <div className="flex items-center gap-1.5 mt-3 text-[11px] font-mono font-medium text-lime-400">
          <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
          <span>{stats.activeProjects.thisMonth} este mes</span>
        </div>
      </div>

      <div className="bg-[#12151b] border border-white/[0.06] hover:border-white/[0.12] rounded-2xl p-5 flex flex-col justify-between transition-all">
        <div className="w-10 h-10 rounded-xl bg-lime-400/10 text-lime-400 flex items-center justify-center mb-3">
          <span className="material-symbols-outlined text-[22px]">code</span>
        </div>
        <div>
          <span className="text-xs text-slate-400 block mb-1">Aplicaciones desplegadas</span>
          <span className="text-2xl font-bold text-white tracking-tight">{stats.deployedApps.total}</span>
        </div>
        <div className="flex items-center gap-1.5 mt-3 text-[11px] font-mono font-medium text-lime-400">
          <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
          <span>{stats.deployedApps.thisMonth} este mes</span>
        </div>
      </div>

      <div className="bg-[#12151b] border border-white/[0.06] hover:border-white/[0.12] rounded-2xl p-5 flex flex-col justify-between transition-all">
        <div className="w-10 h-10 rounded-xl bg-lime-400/10 text-lime-400 flex items-center justify-center mb-3">
          <span className="material-symbols-outlined text-[22px]">database</span>
        </div>
        <div>
          <span className="text-xs text-slate-400 block mb-1">Bases de datos</span>
          <span className="text-2xl font-bold text-white tracking-tight">{stats.databases.total}</span>
        </div>
        <div className="flex items-center gap-1.5 mt-3 text-[11px] font-mono font-medium text-lime-400">
          <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
          <span>{stats.databases.thisMonth} este mes</span>
        </div>
      </div>

      <div className="bg-[#12151b] border border-white/[0.06] hover:border-white/[0.12] rounded-2xl p-5 flex flex-col justify-between transition-all">
        <div className="w-10 h-10 rounded-xl bg-lime-400/10 text-lime-400 flex items-center justify-center mb-3">
          <span className="material-symbols-outlined text-[22px]">group</span>
        </div>
        <div>
          <span className="text-xs text-slate-400 block mb-1">Clientes registrados</span>
          <span className="text-2xl font-bold text-white tracking-tight">{stats.clients.total}</span>
        </div>
        <div className="flex items-center gap-1.5 mt-3 text-[11px] font-mono font-medium text-lime-400">
          <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
          <span>{stats.clients.thisMonth} este mes</span>
        </div>
      </div>
    </div>
  );
}
