import React from 'react';

export function Footer() {
  return (
    <footer className="w-full bg-[#090A0D] border-t border-carbon-border py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img alt="GimiCode" className="h-8 md:h-10 w-auto object-contain opacity-90" src="/gimicode.png" />
          <span className="text-xs text-slate-400">Software a la medida con sentido humano y comercial.</span>
        </div>
        <div className="flex items-center gap-6 text-xs text-slate-400">
          <a className="hover:text-white transition-colors" href="#por-que-GimiCode">Por qué GimiCode</a>
          <a className="hover:text-white transition-colors" href="#casos">Casos de Éxito</a>
          <a className="hover:text-white transition-colors" href="#como-trabajamos">Metodología</a>
          <a className="hover:text-white transition-colors" href="#contacto">Contacto</a>
        </div>
        <div className="text-xs text-slate-400">
          © {new Date().getFullYear()} GimiCode. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}




