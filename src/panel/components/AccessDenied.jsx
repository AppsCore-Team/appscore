export function AccessDenied() {
  return (
    <div className="flex-1 p-8 max-w-[1400px] w-full mx-auto flex items-center justify-center min-h-[60vh]">
      <div className="max-w-md w-full bg-[#12151b] border border-white/[0.06] rounded-3xl p-10 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-[32px]">lock</span>
        </div>
        
        <h1 className="text-2xl font-bold text-white tracking-tight mb-3">
          Acceso denegado
        </h1>
        
        <p className="text-slate-400 text-sm leading-relaxed mb-8">
          Tu rol actual no tiene permisos para acceder a esta sección. Si crees que esto es un error, contacta con el administrador de tu cuenta.
        </p>
        
        <a 
          href="/panel/"
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 border border-white/[0.1] font-medium transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          <span>Volver al inicio</span>
        </a>
      </div>
    </div>
  );
}
