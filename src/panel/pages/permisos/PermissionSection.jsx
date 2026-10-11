import { Toggle } from '../../components/ui/Toggle';

export function PermissionSection({ title, items, draftSet, setDraftSet, forceActiveId }) {
  const allActive = items.every(item => draftSet.has(item.id) || item.id === forceActiveId);
  const activeCount = items.filter(item => draftSet.has(item.id) || item.id === forceActiveId).length;

  const handleToggleAll = (val) => {
    if (val) {
      const newSet = new Set(draftSet);
      items.forEach(i => newSet.add(i.id));
      setDraftSet(newSet);
    } else {
      const newSet = new Set(draftSet);
      items.forEach(i => {
        if (i.id !== forceActiveId) newSet.delete(i.id);
      });
      setDraftSet(newSet);
    }
  };

  const handleToggleItem = (id, val) => {
    if (id === forceActiveId) return; // Cannot change forced item
    const newSet = new Set(draftSet);
    if (val) newSet.add(id);
    else newSet.delete(id);
    setDraftSet(newSet);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
        <div className="flex items-baseline gap-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</h3>
          <span className="text-[10px] text-slate-500 font-mono">{activeCount}/{items.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-500">Todo</span>
          <Toggle checked={allActive} onChange={handleToggleAll} />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        {items.map(item => {
          const isForced = item.id === forceActiveId;
          const isActive = isForced || draftSet.has(item.id);
          
          return (
            <div key={item.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.02] transition-colors group">
              <div className="flex items-center gap-3">
                <span className={`material-symbols-outlined text-[20px] ${isActive ? 'text-lime-400' : 'text-slate-500 group-hover:text-slate-400'}`}>
                  {item.icon}
                </span>
                <span className={`text-sm font-medium ${isActive ? 'text-slate-200' : 'text-slate-400 group-hover:text-slate-300'}`}>
                  {item.label || item.name}
                </span>
                {isForced && (
                  <span className="text-[10px] bg-white/[0.06] text-slate-400 px-2 py-0.5 rounded-md ml-2">Siempre activa</span>
                )}
              </div>
              <Toggle 
                checked={isActive} 
                onChange={(v) => handleToggleItem(item.id, v)} 
                disabled={isForced}
                title={isForced ? "Esta opción es obligatoria y no se puede desactivar" : ""}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
