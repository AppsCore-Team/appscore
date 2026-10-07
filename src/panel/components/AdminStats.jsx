export function AdminStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-[#12151b] border border-white/[0.06] hover:border-white/[0.12] rounded-2xl p-5 flex flex-col justify-between transition-all">
        <div className="w-10 h-10 rounded-xl bg-lime-400/10 text-lime-400 flex items-center justify-center mb-3">
          <span className="material-symbols-outlined text-[22px]">deployed_code</span>
        </div>
        <div>
          <span className="text-xs text-slate-400 block mb-1">Proyectos activos</span>
          <span className="text-2xl font-bold text-white tracking-tight">3</span>
        </div>
        <div className="flex items-center gap-1.5 mt-3 text-[11px] font-mono font-medium text-lime-400">
          <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
          <span>1 este mes</span>
        </div>
      </div>

      <div className="bg-[#12151b] border border-white/[0.06] hover:border-white/[0.12] rounded-2xl p-5 flex flex-col justify-between transition-all">
        <div className="w-10 h-10 rounded-xl bg-lime-400/10 text-lime-400 flex items-center justify-center mb-3">
          <span className="material-symbols-outlined text-[22px]">code</span>
        </div>
        <div>
          <span className="text-xs text-slate-400 block mb-1">Aplicaciones desplegadas</span>
          <span className="text-2xl font-bold text-white tracking-tight">5</span>
        </div>
        <div className="flex items-center gap-1.5 mt-3 text-[11px] font-mono font-medium text-lime-400">
          <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
          <span>2 este mes</span>
        </div>
      </div>

      <div className="bg-[#12151b] border border-white/[0.06] hover:border-white/[0.12] rounded-2xl p-5 flex flex-col justify-between transition-all">
        <div className="w-10 h-10 rounded-xl bg-lime-400/10 text-lime-400 flex items-center justify-center mb-3">
          <span className="material-symbols-outlined text-[22px]">database</span>
        </div>
        <div>
          <span className="text-xs text-slate-400 block mb-1">Bases de datos</span>
          <span className="text-2xl font-bold text-white tracking-tight">4</span>
        </div>
        <div className="flex items-center gap-1.5 mt-3 text-[11px] font-mono font-medium text-lime-400">
          <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
          <span>1 este mes</span>
        </div>
      </div>

      <div className="bg-[#12151b] border border-white/[0.06] hover:border-white/[0.12] rounded-2xl p-5 flex flex-col justify-between transition-all">
        <div className="w-10 h-10 rounded-xl bg-lime-400/10 text-lime-400 flex items-center justify-center mb-3">
          <span className="material-symbols-outlined text-[22px]">group</span>
        </div>
        <div>
          <span className="text-xs text-slate-400 block mb-1">Usuarios del equipo</span>
          <span className="text-2xl font-bold text-white tracking-tight">2</span>
        </div>
        <div className="flex items-center gap-1.5 mt-3 text-[11px] font-mono font-medium text-slate-400">
          <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
          <span>0 este mes</span>
        </div>
      </div>
    </div>
  );
}
