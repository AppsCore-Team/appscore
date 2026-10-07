export function HeroSection({ firstName, roleDisplay }) {
  return (
    <div className="relative rounded-3xl bg-[#11141a] border border-white/[0.06] overflow-hidden p-8 lg:p-10 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
      <div className="absolute -right-10 top-1/2 -translate-y-1/2 w-96 h-96 bg-lime-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="flex flex-col max-w-xl z-10">
        <span className="text-[11px] font-bold tracking-widest text-lime-400 uppercase mb-2">¡HOLA, {firstName}! - {roleDisplay.toUpperCase()}</span>
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
  );
}
