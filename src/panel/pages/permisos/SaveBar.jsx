export function SaveBar({ changesCount, onSave, onDiscard, isSaving }) {
  if (changesCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-in slide-in-from-bottom-10 fade-in duration-300">
      <div className="bg-[#1a1d24]/90 backdrop-blur-md border border-white/[0.08] shadow-[0_10px_40px_rgba(0,0,0,0.5)] rounded-2xl p-3 flex items-center gap-6">
        <div className="flex flex-col ml-3">
          <span className="text-sm font-bold text-white tracking-tight">Cambios sin guardar</span>
          <span className="text-[11px] text-slate-400">
            Tienes {changesCount} {changesCount === 1 ? 'permiso modificado' : 'permisos modificados'}.
          </span>
        </div>

        <div className="flex items-center gap-2 mr-1">
          <button
            onClick={onDiscard}
            disabled={isSaving}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors disabled:opacity-50"
          >
            Descartar
          </button>
          
          <button
            onClick={onSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-lime-400 hover:bg-lime-300 text-black text-xs font-bold transition-all shadow-[0_0_20px_rgba(163,230,53,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                <span>Guardando...</span>
              </>
            ) : (
              <span>Guardar cambios</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
