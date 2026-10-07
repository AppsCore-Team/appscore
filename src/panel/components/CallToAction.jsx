export function CallToAction() {
  return (
    <div className="relative bg-gradient-to-r from-[#10141a] via-[#131822] to-[#10141a] border border-white/[0.06] rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 overflow-hidden">
      
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" xmlns="http://www.w3.org/2000/svg">
        <path d="M 0,40 L 180,40 L 220,70 L 450,70 L 480,20 L 700,20" fill="none" stroke="#a3e635" strokeWidth="1.5" strokeDasharray="3 3"/>
      </svg>

      <div className="flex items-center gap-4 z-10">
        <div className="w-11 h-11 rounded-xl bg-lime-400/10 text-lime-400 flex items-center justify-center flex-shrink-0">
          <span className="material-symbols-filled text-[24px]">rocket_launch</span>
        </div>
        <div className="flex flex-col">
          <h3 className="text-xs font-bold text-white">¿Listo para algo grande?</h3>
          <p className="text-[11px] text-slate-400">Explora todo lo que puedes construir con GimiCode.</p>
        </div>
      </div>

      <button className="z-10 flex items-center gap-1.5 px-4 py-2 rounded-full border border-lime-500/40 text-lime-400 hover:bg-lime-400/10 text-xs font-medium transition-all self-stretch sm:self-auto justify-center">
        <span>Ver proyectos</span>
        <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
      </button>
    </div>
  );
}
