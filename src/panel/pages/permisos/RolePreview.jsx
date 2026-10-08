export function RolePreview({ role, color, modules, widgets, actionsCount }) {
  const topWidgets = widgets.filter(w => w.zone === 'top');
  const mainWidgets = widgets.filter(w => w.zone === 'main');
  const sideWidgets = widgets.filter(w => w.zone === 'side');

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-black/40 overflow-hidden flex flex-col h-[500px] shadow-2xl">
      {/* Fake Browser Top */}
      <div className="h-8 bg-[#090a0d] border-b border-white/[0.06] flex items-center px-4 gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50"></div>
        <div className="w-2.5 h-2.5 rounded-full bg-lime-500/50"></div>
      </div>

      <div className="flex flex-1 overflow-hidden pointer-events-none">
        {/* Fake Sidebar */}
        <div className="w-16 border-r border-white/[0.06] bg-[#090a0d] py-4 flex flex-col items-center gap-3">
          <div className={`w-8 h-8 rounded-lg mb-2 flex items-center justify-center ${color.bg} ${color.text}`}>
            <span className="material-symbols-outlined text-[16px]">{role.icon}</span>
          </div>
          {modules.map(m => (
            <div key={m.id} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500">
              <span className="material-symbols-outlined text-[18px]">{m.icon}</span>
            </div>
          ))}
        </div>

        {/* Fake Content */}
        <div className="flex-1 p-4 bg-[#0c0e12] flex flex-col gap-4 overflow-hidden">
          {/* Header */}
          <div className="h-4 w-32 bg-white/[0.05] rounded-full"></div>
          
          {/* Top Zone */}
          {topWidgets.length > 0 && (
            <div className="flex gap-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-12 flex-1 rounded-lg border border-white/[0.06] bg-[#12151b]"></div>
              ))}
            </div>
          )}

          <div className="flex gap-4 flex-1 overflow-hidden">
            {/* Main Zone */}
            <div className="flex-[2] flex flex-col gap-3">
              {mainWidgets.map(w => (
                <div key={w.id} className="rounded-xl border border-white/[0.06] bg-[#12151b] p-3 flex flex-col gap-2">
                  <div className="h-3 w-24 bg-white/[0.05] rounded-full"></div>
                  {w.slug === 'quick_actions' ? (
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      {Array.from({ length: Math.min(actionsCount, 4) }).map((_, i) => (
                        <div key={i} className="h-8 rounded-md bg-white/[0.03]"></div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-16 rounded-md bg-white/[0.02]"></div>
                  )}
                </div>
              ))}
            </div>

            {/* Side Zone */}
            <div className="flex-[1] flex flex-col gap-3">
              {sideWidgets.map(w => (
                <div key={w.id} className="h-24 rounded-xl border border-white/[0.06] bg-[#12151b] p-3">
                  <div className="h-3 w-16 bg-white/[0.05] rounded-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
