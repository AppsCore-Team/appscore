import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/Button';
import { Chip } from '../components/Chip';


const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6, ease: "easeOut" }
};


export function Hero() {
  return (
    <section className="relative pt-16 pb-24 md:pt-24 md:pb-36 overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[380px] bg-brand/5 rounded-full blur-[140px] pointer-events-none"></div>
      
      <motion.div {...fadeInUp} className="max-w-5xl mx-auto px-6 lg:px-8 text-center relative z-10">
        <Chip label="Desarrollo de software hecho por personas para personas de negocio" className="mb-8" />
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-[1.15]">
          Transformamos tu visión de negocio en <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-brand">software real, confiable</span> y a tu medida.
        </h1>
        <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal mb-10">
          Sin complicaciones técnicas innecesarias, sin sorpresas de presupuesto y con la certeza absoluta de que tu producto estará en manos de ingenieros que entienden tus metas comerciales desde el día uno.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <Button href="#contacto" variant="primary" className="w-full sm:w-auto gap-3 px-8 py-4 text-base">
            <span>Agendar diagnóstico gratuito (30 min)</span>
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </Button>
          <Button href="#como-trabajamos" variant="secondary" className="w-full sm:w-auto gap-2 px-7 py-4 text-base">
            <span className="material-symbols-outlined text-brand text-xl">play_circle</span>
            <span>Conoce nuestro método</span>
          </Button>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-y-3 gap-x-8 text-xs sm:text-sm text-slate-300 pt-2 border-t border-carbon-border/70 max-w-3xl mx-auto">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-brand text-base">check_circle</span>
            <span>100% código propio de tu empresa</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-brand text-base">check_circle</span>
            <span>Presupuesto y plazos claros</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-brand text-base">check_circle</span>
            <span>Acompañamiento humano de inicio a fin</span>
          </div>
        </div>
      </motion.div>

      <motion.div {...fadeInUp} transition={{ duration: 0.6, delay: 0.2 }} className="max-w-6xl mx-auto px-6 lg:px-8 mt-16 relative">
        <div className="rounded-3xl bg-gradient-to-b from-carbon-800 to-carbon-900 border border-carbon-border/90 p-4 sm:p-8 md:p-10 shadow-2xl shadow-black/80">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-carbon-border/60">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-slate-600"></div>
              <div className="w-3 h-3 rounded-full bg-slate-600"></div>
              <div className="w-3 h-3 rounded-full bg-slate-600"></div>
              <span className="ml-2 text-xs font-medium text-slate-400">Portal Operativo • Panel Unificado para Dirección General</span>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="px-3 py-1 rounded-full bg-brand/10 text-brand font-medium">Estado: 100% Estable</span>
              <span className="text-slate-400">Actualizado hoy</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
            <div className="bg-carbon-850/80 rounded-2xl p-6 border border-carbon-border/50">
              <div className="flex items-center justify-between mb-3 text-slate-400 text-sm">
                <span>Tiempo de operación ahorrado</span>
                <span className="material-symbols-outlined text-brand text-lg">schedule</span>
              </div>
              <div className="text-3xl sm:text-4xl font-display font-bold text-white mb-1">32 hrs / sem</div>
              <p className="text-xs text-slate-400">Tareas operativas que antes se hacían en Excel y papel.</p>
            </div>
            <div className="bg-carbon-850/80 rounded-2xl p-6 border border-carbon-border/50">
              <div className="flex items-center justify-between mb-3 text-slate-400 text-sm">
                <span>Satisfacción de usuarios</span>
                <span className="material-symbols-outlined text-brand text-lg">mood</span>
              </div>
              <div className="text-3xl sm:text-4xl font-display font-bold text-white mb-1">98.4%</div>
              <p className="text-xs text-slate-400">Diseñado con flujos simples e intuitivos para tus clientes y equipo.</p>
            </div>
            <div className="bg-carbon-850/80 rounded-2xl p-6 border border-carbon-border/50">
              <div className="flex items-center justify-between mb-3 text-slate-400 text-sm">
                <span>Crecimiento de ventas digitales</span>
                <span className="material-symbols-outlined text-brand text-lg">trending_up</span>
              </div>
              <div className="text-3xl sm:text-4xl font-display font-bold text-white mb-1">+4.2x</div>
              <p className="text-xs text-slate-400">Infraestructura lista para absorber alta demanda sin fallar.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}