export function PanelPage() {
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
              <span className="text-xs font-semibold text-slate-200">German Mejia</span>
              <span className="material-symbols-outlined text-[16px] text-slate-400">expand_more</span>
            </div>
            <span className="text-[10px] text-slate-400">Desarrollador</span>
          </div>
        </div>
      </div>
    </header>

    
    <main className="flex-1 p-8 max-w-[1400px] w-full mx-auto flex flex-col gap-6">

      
      <div className="relative rounded-3xl bg-[#11141a] border border-white/[0.06] overflow-hidden p-8 lg:p-10 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        
        
        <div className="absolute -right-10 top-1/2 -translate-y-1/2 w-96 h-96 bg-lime-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        
        <div className="flex flex-col max-w-xl z-10">
          <span className="text-[11px] font-bold tracking-widest text-lime-400 uppercase mb-2">¡HOLA, GERMAN!</span>
          <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight mb-3">
            Bienvenido a <span className="text-lime-400">GimiCode</span>
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            Aquí comienzan tus ideas. Desarrolla, prueba y lleva tus proyectos a otro nivel. Gimi está contigo en cada paso del camino.
          </p>

          
          <div className="flex items-center flex-wrap gap-4">
            <button className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-lime-400 hover:bg-lime-300 text-black font-semibold text-xs transition-all shadow-[0_0_24px_rgba(163,230,53,0.3)]">
              <span className="material-symbols-filled text-[18px]">deployed_code</span>
              <span>Crear nuevo proyecto</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
            <button className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 border border-white/[0.1] text-xs font-medium transition-all">
              <span className="material-symbols-outlined text-[18px] text-slate-400">menu_book</span>
              <span>Ver documentación</span>
            </button>
          </div>
        </div>

        
        <div className="relative flex items-center justify-center z-10">
          <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBdjxsknUFayEyABrx20kEOFxXYP4HYhZHqfNz1dBIP_we8Snaa6XacoGytNZg7Tzud1a1WpRzC4qH4T5XfAdVM2oNSeh_p6gV2fAkGNul6KjpKrn202mDiqBrHc0BnWjr8S8TpoFOYgKf16aNe2HYKgv_cEzunAjhMVWq73d-eKYpwZ-gLrqZEMlTXOeH2jhqwt-o2Zf9X486CrnlcOuEfsk91ULpMjrRWvVViUdohHtm4qJp5ITXk17TLXEFl4aC8Lg" alt="Gimi con laptop" className="w-full h-full object-contain filter drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)]" />
            
            <div className="absolute -top-3 right-0 sm:right-2 transform rotate-6 select-none pointer-events-none text-right">
              <p className="font-script text-lime-400 text-xl font-bold leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                ¡Vamos<br/>a crear<br/>cosas<br/>increíbles!
              </p>
              <div className="flex justify-end pr-3 pt-1">
                <span className="material-symbols-filled text-lime-400 text-lg">pets</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        
        <div className="bg-[#12151b] border border-white/[0.06] hover:border-white/[0.12] rounded-2xl p-5 flex flex-col justify-between transition-all">
          <div className="w-10 h-10 rounded-xl bg-lime-400/10 text-lime-400 flex items-center justify-center mb-3">
            <span className="material-symbols-outlined text-[22px]">deployed_code</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block mb-1">Proyectos activos</span>
            <span className="text-2xl font-bold text-white tracking-tight">3</span>
          </div>
          <div className="flex items-center gap-1.5 mt-3 text-[11px] font-mono font-medium text-lime-400">
            <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
            <span>1 este mes</span>
          </div>
        </div>

        
        <div className="bg-[#12151b] border border-white/[0.06] hover:border-white/[0.12] rounded-2xl p-5 flex flex-col justify-between transition-all">
          <div className="w-10 h-10 rounded-xl bg-lime-400/10 text-lime-400 flex items-center justify-center mb-3">
            <span className="material-symbols-outlined text-[22px]">code</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block mb-1">Aplicaciones desplegadas</span>
            <span className="text-2xl font-bold text-white tracking-tight">5</span>
          </div>
          <div className="flex items-center gap-1.5 mt-3 text-[11px] font-mono font-medium text-lime-400">
            <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
            <span>2 este mes</span>
          </div>
        </div>

        
        <div className="bg-[#12151b] border border-white/[0.06] hover:border-white/[0.12] rounded-2xl p-5 flex flex-col justify-between transition-all">
          <div className="w-10 h-10 rounded-xl bg-lime-400/10 text-lime-400 flex items-center justify-center mb-3">
            <span className="material-symbols-outlined text-[22px]">database</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block mb-1">Bases de datos</span>
            <span className="text-2xl font-bold text-white tracking-tight">4</span>
          </div>
          <div className="flex items-center gap-1.5 mt-3 text-[11px] font-mono font-medium text-lime-400">
            <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
            <span>1 este mes</span>
          </div>
        </div>

        
        <div className="bg-[#12151b] border border-white/[0.06] hover:border-white/[0.12] rounded-2xl p-5 flex flex-col justify-between transition-all">
          <div className="w-10 h-10 rounded-xl bg-lime-400/10 text-lime-400 flex items-center justify-center mb-3">
            <span className="material-symbols-outlined text-[22px]">group</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block mb-1">Usuarios del equipo</span>
            <span className="text-2xl font-bold text-white tracking-tight">2</span>
          </div>
          <div className="flex items-center gap-1.5 mt-3 text-[11px] font-mono font-medium text-slate-400">
            <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
            <span>0 este mes</span>
          </div>
        </div>
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        
        <div className="lg:col-span-8 flex flex-col gap-5">
          
          <div className="flex items-center gap-2">
            <span className="material-symbols-filled text-lime-400 text-lg">bolt</span>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">Acciones rápidas</h2>
              <p className="text-xs text-slate-400">Accede directamente a lo que necesitas</p>
            </div>
          </div>

          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <a href="#" className="group bg-[#12151b] hover:bg-[#161a22] border border-white/[0.06] hover:border-lime-500/30 p-4 rounded-2xl flex items-center justify-between gap-4 transition-all shadow-sm">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-lime-400/10 text-lime-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[22px]">add_circle</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-slate-100 group-hover:text-lime-400 transition-colors">Crear proyecto</span>
                  <span className="text-[11px] text-slate-400 leading-snug">Inicia un nuevo proyecto desde cero o con una plantilla.</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-slate-500 group-hover:text-lime-400 group-hover:translate-x-1 transition-all text-[18px]">chevron_right</span>
            </a>

            <a href="#" className="group bg-[#12151b] hover:bg-[#161a22] border border-white/[0.06] hover:border-lime-500/30 p-4 rounded-2xl flex items-center justify-between gap-4 transition-all shadow-sm">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-lime-400/10 text-lime-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[22px]">grid_view</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-slate-100 group-hover:text-lime-400 transition-colors">Gestionar aplicaciones</span>
                  <span className="text-[11px] text-slate-400 leading-snug">Despliega, administra y monitorea tus aplicaciones.</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-slate-500 group-hover:text-lime-400 group-hover:translate-x-1 transition-all text-[18px]">chevron_right</span>
            </a>

            <a href="#" className="group bg-[#12151b] hover:bg-[#161a22] border border-white/[0.06] hover:border-lime-500/30 p-4 rounded-2xl flex items-center justify-between gap-4 transition-all shadow-sm">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-lime-400/10 text-lime-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[22px]">database</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-slate-100 group-hover:text-lime-400 transition-colors">Ver bases de datos</span>
                  <span className="text-[11px] text-slate-400 leading-snug">Conecta, administra y explora tus bases de datos.</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-slate-500 group-hover:text-lime-400 group-hover:translate-x-1 transition-all text-[18px]">chevron_right</span>
            </a>

            <a href="#" className="group bg-[#12151b] hover:bg-[#161a22] border border-white/[0.06] hover:border-lime-500/30 p-4 rounded-2xl flex items-center justify-between gap-4 transition-all shadow-sm">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-lime-400/10 text-lime-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[22px]">settings</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-slate-100 group-hover:text-lime-400 transition-colors">Configuración</span>
                  <span className="text-[11px] text-slate-400 leading-snug">Personaliza tu entorno y preferencias.</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-slate-500 group-hover:text-lime-400 group-hover:translate-x-1 transition-all text-[18px]">chevron_right</span>
            </a>

          </div>

          
          <div className="relative bg-gradient-to-r from-[#10141a] via-[#131822] to-[#10141a] border border-white/[0.06] rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 overflow-hidden">
            
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" xmlns="http://www.w3.org/2000/svg">
              <path d="M 0,40 L 180,40 L 220,70 L 450,70 L 480,20 L 700,20" fill="none" stroke="#a3e635" stroke-width="1.5" stroke-dasharray="3 3"/>
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
              <span>Ver tutoriales</span>
              <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
            </button>
          </div>

        </div>

        
        <div className="lg:col-span-4 flex flex-col gap-4">

          
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

          
          <div className="bg-[#12151b] border border-white/[0.06] rounded-2xl p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-200">
                <span className="material-symbols-outlined text-[18px] text-slate-400">schedule</span>
                <span className="text-xs font-bold">Actividad reciente</span>
              </div>
              <a href="#" className="text-[11px] font-medium text-lime-400 hover:underline">Ver todo</a>
            </div>

            
            <div className="flex flex-col gap-3">
              
              
              <a href="#" className="flex items-center justify-between p-2 rounded-xl hover:bg-white/[0.03] transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-lime-400/10 text-lime-400 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-[17px]">code</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-slate-200 group-hover:text-lime-400 transition-colors">Proyecto WebApp actualizado</span>
                    <span className="text-[10px] text-slate-500">Hace 2 horas</span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-slate-600 group-hover:text-slate-300 text-[16px]">chevron_right</span>
              </a>

              
              <a href="#" className="flex items-center justify-between p-2 rounded-xl hover:bg-white/[0.03] transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-lime-400/10 text-lime-400 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-[17px]">cloud</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-slate-200 group-hover:text-lime-400 transition-colors">Despliegue completado</span>
                    <span className="text-[10px] text-slate-500">api-gimicode v1.0.0 &bull; Hace 5 horas</span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-slate-600 group-hover:text-slate-300 text-[16px]">chevron_right</span>
              </a>

              
              <a href="#" className="flex items-center justify-between p-2 rounded-xl hover:bg-white/[0.03] transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-lime-400/10 text-lime-400 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-[17px]">database</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-slate-200 group-hover:text-lime-400 transition-colors">Nueva base de datos creada</span>
                    <span className="text-[10px] text-slate-500">gimicode_db &bull; Hace 1 día</span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-slate-600 group-hover:text-slate-300 text-[16px]">chevron_right</span>
              </a>

              
              <a href="#" className="flex items-center justify-between p-2 rounded-xl hover:bg-white/[0.03] transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-lime-400/10 text-lime-400 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-[17px]">group</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-slate-200 group-hover:text-lime-400 transition-colors">Usuario invitado al equipo</span>
                    <span className="text-[10px] text-slate-500">maria@ejemplo.com &bull; Hace 1 día</span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-slate-600 group-hover:text-slate-300 text-[16px]">chevron_right</span>
              </a>

            </div>
          </div>

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