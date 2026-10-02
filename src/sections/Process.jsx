import React from 'react';
import { motion } from 'framer-motion';


const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6, ease: "easeOut" }
};


export function Process() {
  return (
    <section className="py-24 md:py-32 bg-[#11141A] border-y border-carbon-border/60" id="como-trabajamos">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <motion.div {...fadeInUp} className="max-w-3xl mx-auto text-center mb-20">
          <span className="text-xs uppercase tracking-widest font-semibold text-brand block mb-3">Paso a Paso Tranquilo</span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
            Un método claro, transparente y sin sorpresas.
          </h2>
          <p className="text-slate-300 text-base md:text-lg">
            Sabrás exactamente qué esperar en cada etapa, con comunicación directa y entregables reales que puedes ver funcionar.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          <motion.div {...fadeInUp} transition={{ duration: 0.6, delay: 0 }} className="relative flex flex-col">
            <div className="w-12 h-12 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand font-display font-bold text-lg mb-6">
              01
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Escuchamos y entendemos</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Analizamos a fondo tu modelo de negocio, prioridades y presupuesto sin rodeos ni tecnicismos confusos.
            </p>
          </motion.div>

          <motion.div {...fadeInUp} transition={{ duration: 0.6, delay: 0.1 }} className="relative flex flex-col">
            <div className="w-12 h-12 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand font-display font-bold text-lg mb-6">
              02
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Diseñamos la solución exacta</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Definimos los flujos de usuario, la interfaz visual y el plan de trabajo con presupuesto y calendario fijos.
            </p>
          </motion.div>

          <motion.div {...fadeInUp} transition={{ duration: 0.6, delay: 0.2 }} className="relative flex flex-col">
            <div className="w-12 h-12 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand font-display font-bold text-lg mb-6">
              03
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Construimos con demos quincenales</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Cada dos semanas tienes una versión interactiva que puedes probar con tu equipo para asegurar que todo va perfecto.
            </p>
          </motion.div>

          <motion.div {...fadeInUp} transition={{ duration: 0.6, delay: 0.3 }} className="relative flex flex-col">
            <div className="w-12 h-12 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand font-display font-bold text-lg mb-6">
              04
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Lanzamiento y acompañamiento</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Publicamos tu software, te entregamos el código completo y te acompañamos con garantía técnica pos-lanzamiento.
            </p>
          </motion.div>
        </div>

        <motion.div {...fadeInUp} className="mt-16 p-6 rounded-2xl bg-carbon-850 border border-carbon-border flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-brand text-2xl">lock</span>
            <span className="text-sm text-slate-300">
              Firmamos un <strong>Acuerdo de Confidencialidad (NDA)</strong> antes de conocer tus ideas y procesos internos.
            </span>
          </div>
          <a className="text-xs font-semibold text-brand hover:underline shrink-0" href="#contacto">
            Solicitar NDA previo →
          </a>
        </motion.div>
      </div>
    </section>
  );
}