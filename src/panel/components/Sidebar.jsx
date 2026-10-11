import { useState, useEffect } from 'react';
import { supabase } from '../../supabase';

export function Sidebar({ modules }) {
  const currentPath = window.location.pathname;
  const [supportCount, setSupportCount] = useState(0);

  useEffect(() => {
    const hasSoporte = modules && modules.some(m => m.route === '/panel/soporte');
    if (!hasSoporte) return;

    const fetchCount = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        
        const { data, error } = await supabase.rpc('get_support_pending_count');
        if (!error && data != null) {
          setSupportCount(data);
        }
      } catch (err) {
        console.error("Error fetching support count:", err);
      }
    };
    
    fetchCount();
    const interval = setInterval(fetchCount, 15000); // Poll every 15s
    return () => clearInterval(interval);
  }, [modules]);

  return (
    <aside className="w-64 fixed inset-y-0 left-0 bg-[#090a0d] border-r border-white/[0.06] flex flex-col justify-between py-6 px-4 z-40">
      <div className="flex flex-col gap-8">
        
        <div className="px-2 pt-1 flex items-center">
          <img src="/gimicode.png" alt="GimiCode Logo" className="h-8 w-auto object-contain filter drop-shadow-[0_2px_10px_rgba(148,214,0,0.18)]" />
        </div>

        <nav className="flex flex-col gap-1.5">
          {!modules || modules.length === 0 ? (
            <div className="flex justify-center p-4">
              <div className="w-5 h-5 border-2 border-lime-500/30 border-t-lime-500 rounded-full animate-spin"></div>
            </div>
          ) : (
            modules.map((item, index) => {
              const isActive = currentPath === item.route || (item.route !== '/panel/' && currentPath.startsWith(item.route));
              const isDocStart = (item.route === '/panel/documentacion' || item.label?.toLowerCase().includes('documentación')) && index > 0;

              return (
                <div key={item.id} className="flex flex-col gap-1.5">
                  {isDocStart && (
                    <div className="my-2 px-3">
                      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent w-full" />
                    </div>
                  )}
                  <a 
                    href={item.route} 
                    className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl transition-all ${
                      isActive 
                        ? 'bg-lime-500/15 text-lime-400 font-semibold border border-lime-500/25 shadow-[0_0_20px_rgba(132,204,22,0.12)]' 
                        : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]'
                    }`}
                  >
                    <span className={isActive ? 'material-symbols-filled text-[22px]' : 'material-symbols-outlined text-[22px]'}>
                      {item.icon}
                    </span>
                    <span className={`text-sm ${!isActive && 'font-medium'} flex-1`}>{item.label}</span>
                    {item.route === '/panel/soporte' && supportCount > 0 && (
                      <span className="bg-lime-500 text-black text-[10px] px-2 py-0.5 rounded-full font-bold ml-auto shadow-[0_0_10px_rgba(132,204,22,0.4)]">
                        {supportCount}
                      </span>
                    )}
                  </a>
                </div>
              );
            })
          )}
        </nav>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-lime-500/30 bg-black/40 flex-shrink-0">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCidV_eHYJe2ZpRiay83NBi79d8316i7wVzxQT0AcR0rREsKlLP7-PvwvRoJ7yx9rSWGjXTdK4B9LsUOZqY749EVtAMm93rSDvKaox_6xaKboi4OmnFituIUj22MWhC3e44jrKZRCWCOWQ7ylRyoDFH18blcW4r0xU4ILaDmzw44BIzRNmEsWnV2mj40GsIIrmOSVMgkSvyJQqxxOjpHulR2JNMdwiWQzD0WcI3moYOknrgxuIRFWQTAUmJ-7LvVfViGw" alt="Gimi Avatar" className="w-full h-full object-cover" />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-lime-400 border-2 border-[#090a0d] rounded-full"></span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold text-slate-200">Gimi</span>
            <span className="text-[11px] text-slate-400 truncate">Siempre listo para ayudarte</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 px-2 text-lime-400">
          <span className="material-symbols-filled text-[24px]">pets</span>
          <span className="font-script text-base tracking-wide text-lime-400 leading-tight">Grandes ideas,<br/>mejores aplicaciones.</span>
        </div>
      </div>
    </aside>
  );
}
