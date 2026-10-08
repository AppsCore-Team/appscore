import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { Sidebar } from './components/Sidebar';
import { usePanelConfig } from './hooks/usePanelConfig';
import { ToastProvider } from './components/ui/Toast';
import { AccessDenied } from './components/AccessDenied';
import { DashboardPage } from './pages/DashboardPage';
import { PermisosPage } from './pages/permisos/PermisosPage';
import { CreateProjectPage } from './pages/create_project/CreateProjectPage';
import { ProyectosPage } from './pages/proyectos/ProyectosPage';
import { ContactosPage } from './pages/contactos/ContactosPage';
import { DisponibilidadPage } from './pages/disponibilidad/DisponibilidadPage';
import { CitasPage } from './pages/citas/CitasPage';

// Router básico
const ROUTES = [
  { path: '/panel/permisos', module: 'permisos', Component: PermisosPage },
  { path: '/panel/nuevo-proyecto', module: 'nuevo_proyecto', Component: CreateProjectPage },
  { path: '/panel/proyectos', module: 'proyectos', Component: ProyectosPage },
  { path: '/panel/contactos', module: 'contactos', Component: ContactosPage },
  { path: '/panel/disponibilidad', module: 'disponibilidad', Component: DisponibilidadPage },
  { path: '/panel/citas', module: 'citas', Component: CitasPage },
];

export function PanelPage() {
  const [profileLoading, setProfileLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const pathname = window.location.pathname;
  
  const { role, modules, widgets, quick_actions, loading: configLoading, canAccess } = usePanelConfig();

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
      setProfileLoading(false);
    };

    fetchUser();
  }, []);

  const isLoading = profileLoading || configLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0c0e12] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-lime-500/30 border-t-lime-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  const roleDisplay = role?.name || 'Cliente';

  // Router logic
  const route = ROUTES.find(r => pathname.startsWith(r.path));
  
  let content;
  if (!route) {
    // Default dashboard
    content = <DashboardPage profile={profile} roleDisplay={roleDisplay} widgets={widgets} quick_actions={quick_actions} />;
  } else if (!canAccess(route.module)) {
    content = <AccessDenied />;
  } else {
    const Component = route.Component;
    content = <Component profile={profile} role={role} />;
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#0c0e12] text-white font-sans flex overflow-hidden">
        
        <Sidebar modules={modules} />

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

          {content}

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
    </ToastProvider>
  );
}