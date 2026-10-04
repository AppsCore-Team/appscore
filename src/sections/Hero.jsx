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
    <section className="relative pt-12 pb-24 md:pt-20 md:pb-36 overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[380px] bg-brand/5 rounded-full blur-[140px] pointer-events-none"></div>
      
      <motion.div {...fadeInUp} className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-carbon-850 border border-carbon-700/80 text-xs md:text-sm text-slate-300 mb-8 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-brand"></span>
              <span>Desarrollo de software hecho por personas para personas de negocio</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold tracking-tight text-white mb-6 leading-[1.12]">
              Transformamos tu visión de negocio en <span className="text-brand">software real, confiable</span> y a tu medida.
            </h1>
            
            <p className="text-base md:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal mb-8">
              Sin complicaciones técnicas innecesarias, sin sorpresas de presupuesto y con la certeza absoluta de que tu producto estará en manos de ingenieros que entienden tus metas comerciales desde el día uno.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10">
              <Button href="#contacto" variant="primary" className="w-full sm:w-auto gap-3 px-8 py-4 text-base">
                <span>Agendar diagnóstico gratuito (30 min)</span>
                <span translate="no" className="material-symbols-outlined text-lg">arrow_forward</span>
              </Button>
              <Button href="#como-trabajamos" variant="secondary" className="w-full sm:w-auto gap-2 px-7 py-4 text-base">
                <span translate="no" className="material-symbols-outlined text-brand text-xl">play_circle</span>
                <span>Conoce nuestro método</span>
              </Button>
            </div>
            
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-y-3 gap-x-6 text-xs sm:text-sm text-slate-300 pt-4 border-t border-carbon-border/70 max-w-2xl">
              <div className="flex items-center gap-2">
                <span translate="no" className="material-symbols-outlined text-brand text-base">check_circle</span>
                <span>100% código propio de tu empresa</span>
              </div>
              <div className="flex items-center gap-2">
                <span translate="no" className="material-symbols-outlined text-brand text-base">check_circle</span>
                <span>Presupuesto y plazos claros</span>
              </div>
              <div className="flex items-center gap-2">
                <span translate="no" className="material-symbols-outlined text-brand text-base">check_circle</span>
                <span>Acompañamiento humano de inicio a fin</span>
              </div>
            </div>
          </div>
          
          <div className="shrink-0 flex items-center justify-center relative w-full sm:w-auto lg:min-w-[340px] xl:min-w-[390px]">
            <div className="absolute inset-0 bg-brand/10 rounded-full blur-[80px] pointer-events-none scale-75"></div>
            <img alt="Gimi saludando" className="relative z-10 w-64 sm:w-80 lg:w-[350px] xl:w-[390px] h-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.7)] hover:scale-105 transition-transform duration-300" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGEfI1p3s84_tO3SawC-Gdpxh5Pj7j_Jj4ySJO0OYTSUQMDgY5KRZGkRTWVx8mgveFLlBV9LezE2DLwFeqgPzNB9uzT3GbqUOYLSEjn0FndBHlXLZJTQd8JH6a8CddVKkawkRruzXAJMBBJbt2cb6fYa3LBfKibymYa4R2s3FQXSfVoAfGSOjEC5FfO5f7AZ_0eQX25h8q6wCThUjPDdM-LDmD3HMUHmTu0sBXYq4LHH0QVX4Cd_7u_JVIjxrobMM2HA" />
          </div>
        </div>
      </motion.div>

      <motion.div {...fadeInUp} transition={{ duration: 0.6, delay: 0.2 }} className="max-w-6xl mx-auto px-6 lg:px-8 mt-16 relative">
        <div className="rounded-3xl bg-gradient-to-b from-carbon-800 to-carbon-900 border border-carbon-border/90 p-4 sm:p-8 md:p-10 shadow-2xl shadow-black/80 relative">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-carbon-border/60">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-slate-600"></div>
              <div className="w-3 h-3 rounded-full bg-slate-600"></div>
              <div className="w-3 h-3 rounded-full bg-slate-600"></div>
              <span className="ml-2 text-xs font-medium text-slate-400">Portal Operativo • Panel Unificado para Dirección General</span>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-brand/10 border border-brand/25 text-brand text-xs font-medium">
                <div className="w-6 h-6 rounded-full overflow-hidden border border-brand/40 shrink-0">
                  <img alt="Gimi" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBiwC9le3vkMbQNIGIew3x3xgFXUAxc_zJJM0NVyNKbtlvaMPjwejEbYnlquvXlswF2rBGo-2JWuLse0gpCDcoyGkXy1Ae3LYli0HQh2mPAdH_LcgVEOMXQ9Y19V5ujYC1VsB2y3JKiBuxm4ZrcIxJpEd0HWbzsXxSJtjogrfhGdIV3GuUIJNam4jAFsBY907qAO54JLuIeIhEkPM_4_T3G_IONYtHOlYgkjNafFV9w-pxZcuS6ojCyNOZRT65af0o4Og" />
                </div>
                <span className="hidden sm:inline">¡Hola! Soy Gimi, tu guía en el proyecto</span>
              </div>
              <span className="px-3 py-1 rounded-full bg-brand/10 text-brand font-medium">Estado: 100% Estable</span>
              <span className="text-slate-400">Actualizado hoy</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 pb-4">
            <div className="bg-carbon-850/80 rounded-2xl p-6 border border-carbon-border/50">
              <div className="flex items-center justify-between mb-3 text-slate-400 text-sm">
                <span>Tiempo de operación ahorrado</span>
                <span translate="no" className="material-symbols-outlined text-brand text-lg">schedule</span>
              </div>
              <div className="text-3xl sm:text-4xl font-display font-bold text-white mb-1">32 hrs / sem</div>
              <p className="text-xs text-slate-400">Tareas operativas que antes se hacían en Excel y papel.</p>
            </div>
            <div className="bg-carbon-850/80 rounded-2xl p-6 border border-carbon-border/50">
              <div className="flex items-center justify-between mb-3 text-slate-400 text-sm">
                <span>Satisfacción de usuarios</span>
                <span translate="no" className="material-symbols-outlined text-brand text-lg">mood</span>
              </div>
              <div className="text-3xl sm:text-4xl font-display font-bold text-white mb-1">98.4%</div>
              <p className="text-xs text-slate-400">Diseñado con flujos simples e intuitivos para tus clientes y equipo.</p>
            </div>
            <div className="bg-carbon-850/80 rounded-2xl p-6 border border-carbon-border/50">
              <div className="flex items-center justify-between mb-3 text-slate-400 text-sm">
                <span>Crecimiento de ventas digitales</span>
                <span translate="no" className="material-symbols-outlined text-brand text-lg">trending_up</span>
              </div>
              <div className="text-3xl sm:text-4xl font-display font-bold text-white mb-1">+4.2x</div>
              <p className="text-xs text-slate-400">Infraestructura lista para absorber alta demanda sin fallar.</p>
            </div>
          </div>
          
          <div className="absolute left-1/4 sm:left-1/3 -translate-x-1/2 z-20 pointer-events-none -bottom-10">
            <img alt="Gimi asomado detrás del borde" className="w-36 sm:w-44 md:w-52 h-auto drop-shadow-[0_12px_24px_rgba(0,0,0,0.8)]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCx4CnOu_z675MUTfYfc-RsGSRjG1-45ZlfSqkOEaSfDO1-YDRYiFk0RJhoDRnOq6ty7OI_j9bbRlTadzF_yV8zWLitVRCxKBnvQy_AZLHsArujzMqWRpPDfs8rLcc1Uej6MwoTUeHvl3at0GCN7Vm7GIoRr9CP6vCkgAe-SQq_ZJggvjr7g9xD6vay7ZVNKKBP27deBlgop1gRjowj_LPZAKs4BW10MfuSXFjMWOOZxk0X29wgsye8d5gp3aMSr0TMlQ" />
          </div>
        </div>
      </motion.div>
    </section>
  );
}