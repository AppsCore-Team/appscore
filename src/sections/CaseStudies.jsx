import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../components/Card';


const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6, ease: "easeOut" }
};


export function CaseStudies() {
  return (
    <section className="py-24 md:py-32" id="casos">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <motion.div {...fadeInUp} className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-widest font-semibold text-brand block mb-3">Historias Reales</span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Soluciones que resuelven problemas diarios de empresas en crecimiento.
            </h2>
          </div>
          <p className="text-slate-400 text-sm md:text-base md:w-[350px] lg:w-[400px] shrink-0 text-left md:text-right">
            Diseñadas para generar retorno medible, agilizar la operación y liberar a los equipos de tareas tediosas.
          </p>
        </motion.div>

        <div className="space-y-16">
          <motion.div {...fadeInUp}>
            <Card className="p-8 md:p-12 hover:border-carbon-600 transition-colors">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7">
                  <div className="flex items-center gap-3 text-brand text-xs font-semibold uppercase tracking-wider mb-3">
                    <span>Logística y Distribución</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-400">Plataforma Web Operativa</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                    De procesos manuales a una plataforma operativa que redujo en 70% los tiempos de despacho.
                  </h3>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                    Una comercializadora con 1,200 pedidos diarios gestionaba sus rutas e inventario en hojas de cálculo propensas a errores. Diseñamos un sistema centralizado fácil de usar que unificó bodegas, conductores y facturación sin interrumpir su día a día.
                  </p>
                  <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-300">
                    <span className="px-3 py-1.5 rounded-lg bg-carbon-700">Tiempo de respuesta: Inmediato</span>
                    <span className="px-3 py-1.5 rounded-lg bg-carbon-700">Cero errores de inventario</span>
                    <span className="px-3 py-1.5 rounded-lg bg-carbon-700">100% adopción por los choferes</span>
                  </div>
                </div>
                <div className="lg:col-span-5 bg-carbon-900 rounded-2xl p-6 border border-carbon-border/60 flex flex-col justify-center">
                  <span className="text-xs uppercase text-slate-400 tracking-wider mb-2">Impacto Directo</span>
                  <div className="text-4xl sm:text-5xl font-display font-extrabold text-brand mb-2">-70%</div>
                  <div className="text-sm font-semibold text-white mb-1">Menos tiempo en cada entrega</div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    "El equipo no necesitó semanas de capacitación. AppsCore diseñó la herramienta con tanta sencillez que empezamos a usarla al instante."
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div {...fadeInUp}>
            <Card className="p-8 md:p-12 hover:border-carbon-600 transition-colors">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7">
                  <div className="flex items-center gap-3 text-brand text-xs font-semibold uppercase tracking-wider mb-3">
                    <span>Fintech y Gestión de Clientes</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-400">App Móvil &amp; Panel Web</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                    Un producto digital validado y listo para salir al mercado en solo 8 semanas.
                  </h3>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                    Los fundadores necesitaban un primer producto robusto y atractivo para demostrar tracción frente a inversionistas y clientes tempranos. En lugar de presupuestos inflados de 9 meses, priorizamos los flujos esenciales y lanzamos una solución pulida en tiempo récord.
                  </p>
                  <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-300">
                    <span className="px-3 py-1.5 rounded-lg bg-carbon-700">Lanzamiento en 8 semanas</span>
                    <span className="px-3 py-1.5 rounded-lg bg-carbon-700">App nativa fluida</span>
                    <span className="px-3 py-1.5 rounded-lg bg-carbon-700">Ronda de capital cerrada</span>
                  </div>
                </div>
                <div className="lg:col-span-5 bg-carbon-900 rounded-2xl p-6 border border-carbon-border/60 flex flex-col justify-center">
                  <span className="text-xs uppercase text-slate-400 tracking-wider mb-2">Impacto Directo</span>
                  <div className="text-4xl sm:text-5xl font-display font-extrabold text-white mb-2">8 Semanas</div>
                  <div className="text-sm font-semibold text-white mb-1">De la idea al primer usuario real</div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    "Nos ayudaron a filtrar lo que no era indispensable para el lanzamiento, ahorrándonos miles de dólares y meses de incertidumbre."
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div {...fadeInUp}>
            <Card className="p-8 md:p-12 hover:border-carbon-600 transition-colors">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7">
                  <div className="flex items-center gap-3 text-brand text-xs font-semibold uppercase tracking-wider mb-3">
                    <span>Empresas Consolidadas</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-400">Renovación de Sistema Crítico</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                    Modernización completa de software obsoleto sin perder ni una sola venta.
                  </h3>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                    El sistema principal de una empresa manufacturera tenía más de una década de antigüedad, se congelaba en horas pico y nadie quería tocarlo por miedo a desconectarlo. Realizamos una transición gradual, segura y transparente, manteniendo el negocio operativo al 100%.
                  </p>
                  <div className="flex flex-wrap gap-4 text-xs font-medium text-slate-300">
                    <span className="px-3 py-1.5 rounded-lg bg-carbon-700">Cero minutos de caída</span>
                    <span className="px-3 py-1.5 rounded-lg bg-carbon-700">Migración segura de datos</span>
                    <span className="px-3 py-1.5 rounded-lg bg-carbon-700">Costos de soporte -50%</span>
                  </div>
                </div>
                <div className="lg:col-span-5 bg-carbon-900 rounded-2xl p-6 border border-carbon-border/60 flex flex-col justify-center">
                  <span className="text-xs uppercase text-slate-400 tracking-wider mb-2">Impacto Directo</span>
                  <div className="text-4xl sm:text-5xl font-display font-extrabold text-brand mb-2">0 Caídas</div>
                  <div className="text-sm font-semibold text-white mb-1">Continuidad del negocio garantizada</div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    "Era el mayor temor de nuestro comité directivo. El equipo de AppsCore ejecutó la migración sin que ningún cliente notara una pausa."
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}