export function QuickActions({ actions }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <span className="material-symbols-filled text-lime-400 text-lg">bolt</span>
        <div>
          <h2 className="text-sm font-bold text-white tracking-tight">Acciones rápidas</h2>
          <p className="text-xs text-slate-400">Accede directamente a lo que necesitas</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {!actions || actions.length === 0 ? (
          <div className="col-span-full flex justify-center p-8">
            <div className="w-6 h-6 border-2 border-lime-500/30 border-t-lime-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          actions.map((action) => (
            <a key={action.id} href={action.route} className="group bg-[#12151b] hover:bg-[#161a22] border border-white/[0.06] hover:border-lime-500/30 p-4 rounded-2xl flex items-center justify-between gap-4 transition-all shadow-sm">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-lime-400/10 text-lime-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[22px]">{action.icon}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-slate-100 group-hover:text-lime-400 transition-colors">{action.title}</span>
                  <span className="text-[11px] text-slate-400 leading-snug">{action.subtitle}</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-slate-500 group-hover:text-lime-400 group-hover:translate-x-1 transition-all text-[18px]">chevron_right</span>
            </a>
          ))
        )}
      </div>
    </div>
  );
}
