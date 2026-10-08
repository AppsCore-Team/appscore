export function QuickActionsPicker({ actions, draftActions, setDraftActions, isWidgetActive }) {
  if (!isWidgetActive) return null;

  const handleToggle = (id) => {
    const newSet = new Set(draftActions);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setDraftActions(newSet);
  };

  const handleSelectAll = (val) => {
    const newSet = new Set(draftActions);
    actions.forEach(a => {
      if (val) newSet.add(a.id);
      else newSet.delete(a.id);
    });
    setDraftActions(newSet);
  };

  const allSelected = actions.every(a => draftActions.has(a.id));

  return (
    <div className="ml-10 mt-2 p-4 rounded-xl bg-black/20 border border-white/[0.04] animate-in slide-in-from-top-2 fade-in duration-200">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-slate-400">Selecciona las acciones disponibles en este widget:</span>
        <button 
          onClick={() => handleSelectAll(!allSelected)}
          className="text-[11px] text-lime-400 hover:text-lime-300 underline underline-offset-2"
        >
          {allSelected ? 'Desmarcar todas' : 'Seleccionar todas'}
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {actions.map(action => {
          const isSelected = draftActions.has(action.id);
          return (
            <label 
              key={action.id}
              className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer border transition-colors ${
                isSelected 
                  ? 'bg-lime-400/5 border-lime-500/20 hover:bg-lime-400/10' 
                  : 'bg-white/[0.02] border-transparent hover:bg-white/[0.04]'
              }`}
            >
              <div className="pt-0.5">
                <input 
                  type="checkbox" 
                  checked={isSelected}
                  onChange={() => handleToggle(action.id)}
                  className="w-4 h-4 rounded bg-[#12151b] border-white/[0.1] text-lime-400 focus:ring-lime-500/50 focus:ring-offset-[#12151b]"
                />
              </div>
              <div className="flex flex-col">
                <span className={`text-xs font-semibold ${isSelected ? 'text-slate-200' : 'text-slate-400'}`}>
                  {action.title}
                </span>
                <span className="text-[10px] text-slate-500 leading-tight mt-0.5">
                  {action.subtitle}
                </span>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
