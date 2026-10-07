export function GimiTip() {
  return (
    <div className="bg-[#12151b] border border-white/[0.06] rounded-2xl p-5 flex flex-col gap-3">
      <div className="flex items-center gap-2 text-lime-400">
        <span className="material-symbols-filled text-[20px]">lightbulb</span>
        <span className="text-xs font-bold">Consejo de Gimi</span>
      </div>
      <p className="text-xs text-slate-300 leading-relaxed">
        Los grandes proyectos no se construyen en un día. Empieza con algo pequeño, pero constante.
      </p>
      
      <div className="flex items-center gap-1.5 py-1">
        <div className="h-1 flex-1 rounded-full bg-lime-400 shadow-[0_0_8px_rgba(163,230,53,0.5)]"></div>
        <div className="h-1 flex-1 rounded-full bg-lime-400/80"></div>
        <div className="h-1 flex-1 rounded-full bg-lime-400/40"></div>
        <div className="h-1 flex-1 rounded-full bg-white/10"></div>
        <div className="h-1 flex-1 rounded-full bg-white/10"></div>
        <div className="h-1 flex-1 rounded-full bg-white/10"></div>
        <div className="h-1 flex-1 rounded-full bg-white/10"></div>
        <span className="material-symbols-filled text-lime-400 text-xs pl-1">pets</span>
      </div>
      <div className="pt-1">
        <button className="text-[11px] font-medium text-slate-300 hover:text-lime-400 flex items-center gap-1 transition-colors">
          <span>Ver más consejos</span>
          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}
