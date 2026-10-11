import React from 'react';
import { motion } from 'framer-motion';


const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6, ease: "easeOut" }
};


export function MarketReality() {
  return (
    <section className="py-20 md:py-28 bg-[#11141A] border-y border-carbon-border/60" id="por-que-GimiCode">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-16 relative">
          <motion.div {...fadeInUp} className="max-w-3xl">
            <span className="text-xs uppercase tracking-widest font-semibold text-brand block mb-3">La Realidad del Mercado</span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-5 leading-tight">
              Desarrollar software no debería sentirse como un salto al vacío ni un dolor de cabeza constante.
            </h2>
            <p className="text-slate-300 text-base md:text-lg leading-relaxed">
              Hemos conocido a decenas de directores y emprendedores frustrados por experiencias pasadas. La mayoría de los proyectos no fallan por falta de ideas, sino por falta de empatía, comunicación honesta y orden de sus proveedores.
            </p>
          </motion.div>
          <motion.div {...fadeInUp} transition={{ duration: 0.6, delay: 0.2 }} className="shrink-0 flex justify-center md:justify-end -mt-4 md:mt-0">
            <img alt="Gimi pensativo" className="w-32 sm:w-40 md:w-44 h-auto object-contain drop-shadow-[0_10px_25px_rgba(0,0,0,0.6)]" src="/gimi_pensativo.png"  />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
          <motion.div {...fadeInUp} transition={{ duration: 0.6, delay: 0.1 }} className="rounded-3xl p-8 md:p-10 bg-carbon-850/60 border border-red-500/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6 text-red-400">
                <span translate="no" className="material-symbols-outlined text-2xl">sentiment_dissatisfied</span>
                <h3 className="font-display font-semibold text-xl text-white">Las frustraciones comunes</h3>
              </div>
              <ul className="space-y-5 text-sm md:text-base text-slate-300">
                <li className="flex items-start gap-3">
                  <span translate="no" className="material-symbols-outlined text-red-400/90 text-xl shrink-0 mt-0.5">cancel</span>
                  <span><strong>Presupuestos que se duplican sin aviso:</strong> Empiezan con un precio accesible y terminan cobrando extras por cualquier ajuste elemental.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span translate="no" className="material-symbols-outlined text-red-400/90 text-xl shrink-0 mt-0.5">cancel</span>
                  <span><strong>Semanas de silencio y cajas negras:</strong> No sabes qué están construyendo hasta que es demasiado tarde para corregir el rumbo.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span translate="no" className="material-symbols-outlined text-red-400/90 text-xl shrink-0 mt-0.5">cancel</span>
                  <span><strong>Código rehén y letra pequeña:</strong> Quedas atrapado pagando licencias mensuales abusivas o dependiendo de ellos de por vida.</span>
                </li>
              </ul>
            </div>
            <p className="mt-8 pt-6 border-t border-carbon-border/40 text-xs text-slate-400">
              Resultado: Desgaste del equipo, presupuestos quemados y software que nadie quiere usar.
            </p>
          </motion.div>

          <motion.div {...fadeInUp} transition={{ duration: 0.6, delay: 0.2 }} className="rounded-3xl p-8 md:p-10 bg-carbon-850 border border-brand/35 relative flex flex-col justify-between shadow-[0_0_40px_rgba(153,222,29,0.06)]">
            <div className="absolute -top-3.5 right-8 px-3.5 py-1 rounded-full bg-brand text-black font-semibold text-xs tracking-wide">
              NUESTRO COMPROMISO
            </div>
            <div>
              <div className="flex items-center gap-3 mb-6 text-brand">
                <span translate="no" className="material-symbols-outlined text-2xl">verified</span>
                <h3 className="font-display font-semibold text-xl text-white">La tranquilidad con GimiCode</h3>
              </div>
              <ul className="space-y-5 text-sm md:text-base text-slate-200">
                <li className="flex items-start gap-3">
                  <span translate="no" className="material-symbols-outlined text-brand text-xl shrink-0 mt-0.5">check_circle</span>
                  <span><strong>Claridad y presupuesto cerrado:</strong> Definimos con exactitud lo que se construirá y cuánto costará. Sin cargos ocultos ni letras pequeñas.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span translate="no" className="material-symbols-outlined text-brand text-xl shrink-0 mt-0.5">check_circle</span>
                  <span><strong>Entregas visibles cada 14 días:</strong> Puedes interactuar con los avances de tu producto paso a paso y ajustar prioridades con calma.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span translate="no" className="material-symbols-outlined text-brand text-xl shrink-0 mt-0.5">check_circle</span>
                  <span><strong>Propiedad 100% tuya:</strong> El código, las bases de datos y la arquitectura son un activo exclusivo de tu empresa desde el primer día.</span>
                </li>
              </ul>
            </div>
            <p className="mt-8 pt-6 border-t border-carbon-border/80 text-xs text-brand/90 font-medium">
              Resultado: Un socio tecnológico confiable que habla tu idioma y cuida la rentabilidad de tu negocio.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}




