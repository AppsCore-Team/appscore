import React, { useState } from 'react';
import { Button } from '../components/Button';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 transition-all duration-300 backdrop-blur-xl bg-[#0D0F13]/85 border-b border-carbon-border/60">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
        <a className="flex items-center gap-3 group transition-transform hover:opacity-95" href="#" onClick={closeMenu}>
          <img alt="GimiCode Software a la Medida" className="h-8 md:h-9 w-auto object-contain" src="/gimicode.png" />
        </a>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a className="hover:text-white transition-colors" href="#por-que-GimiCode">Por qué GimiCode</a>
          <a className="hover:text-white transition-colors" href="#casos">Casos y Soluciones</a>
          <a className="hover:text-white transition-colors" href="#como-trabajamos">Cómo trabajamos</a>
          <a className="hover:text-white transition-colors" href="#testimonios">Testimonios</a>
        </nav>
        
        <div className="flex items-center gap-4">
          <Button href="#contacto" variant="primary" className="hidden md:inline-flex px-5 py-2.5 text-sm">
            Conversar sobre mi proyecto
          </Button>
          
          {/* Mobile Menu Toggle Button */}
          <button 
            className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-carbon-800 transition-colors"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span translate="no" className="material-symbols-outlined text-2xl">
              {isMobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 inset-x-0 bg-[#0D0F13] border-b border-carbon-border shadow-2xl p-6 flex flex-col gap-6">
          <nav className="flex flex-col gap-4 text-sm font-medium text-slate-300">
            <a className="hover:text-white transition-colors block py-2 border-b border-carbon-border/50" href="#por-que-GimiCode" onClick={closeMenu}>Por qué GimiCode</a>
            <a className="hover:text-white transition-colors block py-2 border-b border-carbon-border/50" href="#casos" onClick={closeMenu}>Casos y Soluciones</a>
            <a className="hover:text-white transition-colors block py-2 border-b border-carbon-border/50" href="#como-trabajamos" onClick={closeMenu}>Cómo trabajamos</a>
            <a className="hover:text-white transition-colors block py-2 border-b border-carbon-border/50" href="#testimonios" onClick={closeMenu}>Testimonios</a>
          </nav>
          <Button href="#contacto" variant="primary" className="w-full py-3 justify-center text-sm" onClick={closeMenu}>
            Conversar sobre mi proyecto
          </Button>
        </div>
      )}
    </header>
  );
}





