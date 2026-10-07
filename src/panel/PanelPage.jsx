import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { AdminStats } from './components/AdminStats';
import { GimiTip } from './components/GimiTip';
import { RecentActivity } from './components/RecentActivity';
import { QuickActions } from './components/QuickActions';
import { CallToAction } from './components/CallToAction';
import { HeroSection } from './components/HeroSection';

export function PanelPage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (!session) {
        window.location.href = '/clientes/';
        return;
      }

      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profileData) {
        setProfile({
          ...profileData,
          email: session.user.email
        });
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0c0e12] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-lime-500/30 border-t-lime-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const firstName = profile?.full_name?.split(' ')[0]?.toUpperCase() || 'USUARIO';
  const roleDisplay = profile?.role || 'Cliente';

  return (
    <div className="min-h-screen bg-[#0c0e12] text-white font-sans flex overflow-hidden">
      

  
  <aside className="w-64 fixed inset-y-0 left-0 bg-[#090a0d] border-r border-white/[0.06] flex flex-col justify-between py-6 px-4 z-40">
    <div className="flex flex-col gap-8">
      
      <div className="px-2 pt-1 flex items-center">
        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJQ5kThaolz5805S-mtgVxWg7QoDcxcjY-IfzzgGH9FnqobY_fYn2iPQSbKXViI0QHmVVmkiwEspZu373hW1tiYK8tr5gUx4a5RuezEmNeX0x91VzW3zJ7gw79TRtX19sLCW4wbL5uWrJ6wk62lqYCSUDBrSKFCgyLP8F0jR5hVj1LTYJ5bGeTgyOrhkdgLk2X5SKdTcVqNQNNsMhymkWXOShnDS5kfF7lMKP-PXsn0XAzKNKei0xucY33tMo7Gyw2Mg" alt="GimiCode Logo" className="h-8 w-auto object-contain" />
      </div>

      
      <nav className="flex flex-col gap-1.5">
        <a href="#" className="flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl bg-lime-500/15 text-lime-400 font-semibold border border-lime-500/25 shadow-[0_0_20px_rgba(132,204,22,0.12)]">
          <span className="material-symbols-filled text-[22px]">home</span>
          <span className="text-sm">Inicio</span>
        </a>
        <a href="#" className="flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-white/[0.04] transition-all">
          <span className="material-symbols-outlined text-[22px]">code</span>
          <span className="text-sm font-medium">Proyectos</span>
        </a>
        <a href="#" className="flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-white/[0.04] transition-all">
          <span className="material-symbols-outlined text-[22px]">grid_view</span>
          <span className="text-sm font-medium">Aplicaciones</span>
        </a>
        <a href="#" className="flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-white/[0.04] transition-all">
          <span className="material-symbols-outlined text-[22px]">database</span>
          <span className="text-sm font-medium">Base de datos</span>
        </a>
        <a href="#" className="flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-white/[0.04] transition-all">
          <span className="material-symbols-outlined text-[22px]">group</span>
          <span className="text-sm font-medium">Usuarios</span>
        </a>
        <a href="#" className="flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-white/[0.04] transition-all">
          <span className="material-symbols-outlined text-[22px]">settings</span>
          <span className="text-sm font-medium">Configuración</span>
        </a>
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

  
  <div className="ml-64 flex-1 flex flex-col min-h-screen">
    
    
    <header className="h-16 px-8 flex items-center justify-between border-b border-white/[0.05] bg-[#0c0e12]/80 backdrop-blur-md sticky top-0 z-30">
      
      <div className="relative w-96">
        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-[18px]">search</span>
        <input 
          type="text" 
          placeholder="Buscar proyectos, aplicaciones..." 
          className="w-full bg-[#15181e] border border-white/[0.06] rounded-full pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-lime-500/50 transition-colors"
        />
      </div>

      
      <div className="flex items-center gap-5">
        <button className="relative text-slate-400 hover:text-slate-200 p-1.5 rounded-full hover:bg-white/[0.04] transition-colors">
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          <span className="absolute top-1 right-1 w-2 h-2 bg-lime-400 rounded-full ring-2 ring-[#0c0e12]"></span>
        </button>

        <div className="flex items-center gap-3 pl-2 border-l border-white/[0.08]">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-semibold text-xs border border-white/10">
            <span className="material-symbols-filled text-base">person</span>
          </div>
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-200">{profile?.full_name || 'Usuario'}</span>
              <span className="material-symbols-outlined text-[16px] text-slate-400">expand_more</span>
            </div>
            <span className="text-[10px] text-slate-400 capitalize">{roleDisplay}</span>
          </div>
          <button 
            onClick={async () => { await supabase.auth.signOut(); window.location.href='/clientes/'; }}
            className="ml-3 w-8 h-8 flex items-center justify-center rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
            title="Cerrar sesión"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
          </button>
        </div>
      </div>
    </header>

    
    <main className="flex-1 p-8 max-w-[1400px] w-full mx-auto flex flex-col gap-6">
      
      <HeroSection firstName={firstName} roleDisplay={roleDisplay} />

      {profile?.role === 'Administrador' && <AdminStats />}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 flex flex-col gap-5">
          <QuickActions />
          <CallToAction />
        </div>

        <div className="lg:col-span-4 flex flex-col gap-4">
          <GimiTip />
          <RecentActivity role={profile?.role} />
        </div>
      </div>

    </main>

    
    <footer className="mt-auto px-8 py-4 border-t border-white/[0.05] bg-[#090a0d] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
      <div className="flex items-center gap-2">
        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCtEfwhNdYwp4H9a2IxgB_OUuCImp8z1v_-hMUVfKHwpj7B5QWdCCurzpnoDQxVkBV2rs4TPCeQ9REqnO1P0OZ_cr0C95MT6ykbAX2SjDMh6PLHvMbr_5iLfFQkBKgPuBlkIjxavNSeRmLaIDHM5d0sZ_AWPPSQXROPFo7ncrOZwzeiZE7DBLfYv_R5WQCPVFL35vUDBavDpAb0GrQJ9wyYTrMy9gqsvtetaNazjx0kApPxL5tMnq0TV3ssDcdv88bU4A" alt="GimiCode" className="h-4 w-auto object-contain opacity-80" />
        <span>&copy; 2025 GimiCode Inc. Todos los derechos reservados.</span>
      </div>
      <div className="flex items-center gap-4 text-[11px]">
        <a href="#" className="hover:text-lime-400 transition-colors">Soporte</a>
        <span className="text-slate-700">|</span>
        <a href="#" className="hover:text-lime-400 transition-colors">Privacidad</a>
        <span className="text-slate-700">|</span>
        <a href="#" className="hover:text-lime-400 transition-colors">Términos</a>
      </div>
    </footer>

  </div>


    </div>
  );
}