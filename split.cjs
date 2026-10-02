const fs = require('fs');
const path = require('path');

const sectionsDir = path.join(__dirname, 'src', 'sections');
if (!fs.existsSync(sectionsDir)) {
  fs.mkdirSync(sectionsDir, { recursive: true });
}

const animationProps = `
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6, ease: "easeOut" }
};
`;

const files = {
  'Header.jsx': `
import React from 'react';
import { Button } from '../components/Button';

export function Header() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 transition-all duration-300 backdrop-blur-xl bg-[#0D0F13]/85 border-b border-carbon-border/60">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
        <a className="flex items-center gap-3 group transition-transform hover:opacity-95" href="#">
          <img alt="AppsCore Software a la Medida" className="h-10 md:h-12 w-auto object-contain" src="/logo.png" />
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a className="hover:text-white transition-colors" href="#por-que-appscore">Por qué AppsCore</a>
          <a className="hover:text-white transition-colors" href="#casos">Casos y Soluciones</a>
          <a className="hover:text-white transition-colors" href="#como-trabajamos">Cómo trabajamos</a>
          <a className="hover:text-white transition-colors" href="#testimonios">Testimonios</a>
        </nav>
        <div className="flex items-center gap-4">
          <Button href="#contacto" variant="primary" className="hidden sm:inline-flex px-5 py-2.5 text-sm">
            Conversar sobre mi proyecto
          </Button>
          <a className="sm:hidden p-2 rounded-lg text-slate-300 hover:text-white" href="#contacto">
            <span className="material-symbols-outlined text-2xl">chat</span>
          </a>
        </div>
      </div>
    </header>
  );
}
`,

  'Hero.jsx': `
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/Button';
import { Chip } from '../components/Chip';

${animationProps}

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
`,

  'MarketReality.jsx': `
import React from 'react';
import { motion } from 'framer-motion';

${animationProps}

export function MarketReality() {
  return (
    <section className="py-20 md:py-28 bg-[#11141A] border-y border-carbon-border/60" id="por-que-appscore">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <motion.div {...fadeInUp} className="max-w-3xl mb-16">
          <span className="text-xs uppercase tracking-widest font-semibold text-brand block mb-3">La Realidad del Mercado</span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-5 leading-tight">
            Desarrollar software no debería sentirse como un salto al vacío ni un dolor de cabeza constante.
          </h2>
          <p className="text-slate-300 text-base md:text-lg leading-relaxed">
            Hemos conocido a decenas de directores y emprendedores frustrados por experiencias pasadas. La mayoría de los proyectos no fallan por falta de ideas, sino por falta de empatía, comunicación honesta y orden de sus proveedores.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
          <motion.div {...fadeInUp} transition={{ duration: 0.6, delay: 0.1 }} className="rounded-3xl p-8 md:p-10 bg-carbon-850/60 border border-red-500/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6 text-red-400">
                <span className="material-symbols-outlined text-2xl">sentiment_dissatisfied</span>
                <h3 className="font-display font-semibold text-xl text-white">Las frustraciones comunes</h3>
              </div>
              <ul className="space-y-5 text-sm md:text-base text-slate-300">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-red-400/90 text-xl shrink-0 mt-0.5">cancel</span>
                  <span><strong>Presupuestos que se duplican sin aviso:</strong> Empiezan con un precio accesible y terminan cobrando extras por cualquier ajuste elemental.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-red-400/90 text-xl shrink-0 mt-0.5">cancel</span>
                  <span><strong>Semanas de silencio y cajas negras:</strong> No sabes qué están construyendo hasta que es demasiado tarde para corregir el rumbo.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-red-400/90 text-xl shrink-0 mt-0.5">cancel</span>
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
                <span className="material-symbols-outlined text-2xl">verified</span>
                <h3 className="font-display font-semibold text-xl text-white">La tranquilidad con AppsCore</h3>
              </div>
              <ul className="space-y-5 text-sm md:text-base text-slate-200">
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-brand text-xl shrink-0 mt-0.5">check_circle</span>
                  <span><strong>Claridad y presupuesto cerrado:</strong> Definimos con exactitud lo que se construirá y cuánto costará. Sin cargos ocultos ni letras pequeñas.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-brand text-xl shrink-0 mt-0.5">check_circle</span>
                  <span><strong>Entregas visibles cada 14 días:</strong> Puedes interactuar con los avances de tu producto paso a paso y ajustar prioridades con calma.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-brand text-xl shrink-0 mt-0.5">check_circle</span>
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
`,

  'CaseStudies.jsx': `
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../components/Card';

${animationProps}

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
`,

  'Process.jsx': `
import React from 'react';
import { motion } from 'framer-motion';

${animationProps}

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
`,

  'Testimonials.jsx': `
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../components/Card';

${animationProps}

export function Testimonials() {
  return (
    <section className="py-24 md:py-32" id="testimonios">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <motion.div {...fadeInUp} className="max-w-2xl mb-16">
          <span className="text-xs uppercase tracking-widest font-semibold text-brand block mb-3">Confianza Comprobada</span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
            La tranquilidad de trabajar con un equipo que cumple.
          </h2>
          <p className="text-slate-400 text-sm md:text-base">
            Esto es lo que experimentan quienes han confiado el corazón digital de sus empresas a AppsCore.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div {...fadeInUp} transition={{ duration: 0.6, delay: 0 }}>
            <Card className="p-8 border-carbon-border/80 flex flex-col justify-between h-full">
              <p className="text-slate-300 text-sm leading-relaxed mb-8 italic">
                “Lo mejor de AppsCore fue la calma que nos transmitieron. No intentaron vendernos cosas de más ni nos hablaron en chino. Cumplieron exactamente con las fechas acordadas y el sistema opera impecable.”
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-carbon-border/50 mt-auto">
                <div className="w-10 h-10 rounded-full bg-carbon-700 flex items-center justify-center font-bold text-brand text-sm">
                  RM
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">Rodrigo Morales</div>
                  <div className="text-xs text-slate-400">Director General • Logística Integral</div>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div {...fadeInUp} transition={{ duration: 0.6, delay: 0.1 }}>
            <Card className="p-8 border-carbon-border/80 flex flex-col justify-between h-full">
              <p className="text-slate-300 text-sm leading-relaxed mb-8 italic">
                “Veníamos de una experiencia terrible con otra agencia donde perdimos meses y dinero. Con AppsCore tuvimos una demo funcional a los 15 días y supimos de inmediato que habíamos elegido al socio correcto.”
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-carbon-border/50 mt-auto">
                <div className="w-10 h-10 rounded-full bg-carbon-700 flex items-center justify-center font-bold text-brand text-sm">
                  SO
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">Sofía Obregón</div>
                  <div className="text-xs text-slate-400">Cofundadora • Plataforma PayFlow</div>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div {...fadeInUp} transition={{ duration: 0.6, delay: 0.2 }}>
            <Card className="p-8 border-carbon-border/80 flex flex-col justify-between h-full">
              <p className="text-slate-300 text-sm leading-relaxed mb-8 italic">
                “La propiedad total del código nos dio una independencia invaluable frente a nuestro consejo de administración. Es el tipo de relación transparente y profesional que toda empresa busca.”
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-carbon-border/50 mt-auto">
                <div className="w-10 h-10 rounded-full bg-carbon-700 flex items-center justify-center font-bold text-brand text-sm">
                  AM
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">Andrés Manrique</div>
                  <div className="text-xs text-slate-400">Director de Operaciones • Grupo MexIndustrial</div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
`,

  'Contact.jsx': `
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

${animationProps}

export function Contact() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      e.target.reset();
      
      // Hide success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    }, 1500);
  };

  return (
    <section className="py-20 md:py-32 bg-[#11141A] border-t border-carbon-border/60 relative overflow-hidden" id="contacto">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand/5 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="max-w-5xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div {...fadeInUp} className="lg:col-span-5">
            <span className="text-xs uppercase tracking-widest font-semibold text-brand block mb-3">Hablemos con Calma</span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4 leading-tight">
              ¿Tienes una idea o necesitas mejorar tu software actual?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
              Cuéntanos brevemente sobre tu proyecto. Uno de nuestros líderes técnicos evaluará tu necesidad y te ofrecerá una orientación honesta, viable y sin ningún compromiso comercial forzado.
            </p>
            <div className="space-y-4 text-xs sm:text-sm text-slate-300">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-brand text-lg">schedule</span>
                <span>Respuesta garantizada en menos de 24 horas</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-brand text-lg">shield</span>
                <span>Confidencialidad total bajo NDA</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-brand text-lg">forum</span>
                <span>Conversación directa con ingenieros líderes, sin vendedores</span>
              </div>
            </div>
          </motion.div>

          <motion.div {...fadeInUp} transition={{ duration: 0.6, delay: 0.2 }} className="lg:col-span-7 bg-carbon-850 p-8 sm:p-10 rounded-3xl border border-carbon-border shadow-xl">
            {success ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 rounded-full bg-brand/20 flex items-center justify-center mx-auto mb-4">
                  <span className="material-symbols-outlined text-brand text-3xl">check_circle</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">¡Gracias por escribirnos!</h3>
                <p className="text-slate-400">Revisaremos los detalles de tu proyecto y nos pondremos en contacto contigo en breve con una propuesta clara.</p>
                <Button variant="secondary" className="mt-8" onClick={() => setSuccess(false)}>Enviar otro mensaje</Button>
              </div>
            ) : (
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Tu Nombre</label>
                    <Input placeholder="Ej. Alejandro Vega" required type="text" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Correo de Contacto</label>
                    <Input placeholder="alejandro@tuempresa.com" required type="email" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Empresa u Organización</label>
                    <Input placeholder="Nombre de tu negocio" required type="text" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">¿Qué necesitas desarrollar?</label>
                    <Input as="select" required>
                      <option>Nuevo software o plataforma web</option>
                      <option>Aplicación móvil (iOS / Android)</option>
                      <option>Modernizar un sistema existente</option>
                      <option>Automatizar procesos internos</option>
                      <option>Aún lo estoy definiendo</option>
                    </Input>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Cuéntanos sobre tu visión o reto actual</label>
                  <Input as="textarea" required placeholder="¿Qué problema buscas resolver y cuál es tu tiempo estimado de inicio?" rows="4" />
                </div>
                <Button type="submit" variant="primary" disabled={loading} className={\`w-full py-4 gap-2 text-sm tracking-wide shadow-lg \${loading ? 'opacity-70' : 'shadow-brand/20'}\`}>
                  <span>{loading ? 'Enviando...' : 'Solicitar diagnóstico gratuito'}</span>
                  <span className="material-symbols-outlined text-lg">{loading ? 'hourglass_top' : 'send'}</span>
                </Button>
                <p className="text-center text-xs text-slate-400">
                  Sin spam ni presiones. Respetamos tu tiempo y tus datos.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
`,

  'Footer.jsx': `
import React from 'react';

export function Footer() {
  return (
    <footer className="w-full bg-[#090A0D] border-t border-carbon-border py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img alt="AppsCore" className="h-8 md:h-10 w-auto object-contain opacity-90" src="/logo.png" />
          <span className="text-xs text-slate-400">Software a la medida con sentido humano y comercial.</span>
        </div>
        <div className="flex items-center gap-6 text-xs text-slate-400">
          <a className="hover:text-white transition-colors" href="#por-que-appscore">Por qué AppsCore</a>
          <a className="hover:text-white transition-colors" href="#casos">Casos de Éxito</a>
          <a className="hover:text-white transition-colors" href="#como-trabajamos">Metodología</a>
          <a className="hover:text-white transition-colors" href="#contacto">Contacto</a>
        </div>
        <div className="text-xs text-slate-400">
          © {new Date().getFullYear()} AppsCore. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
`
};

for (const [filename, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(sectionsDir, filename), content.trim());
}

const appJsx = `
import React from 'react';
import { Header } from './sections/Header';
import { Hero } from './sections/Hero';
import { MarketReality } from './sections/MarketReality';
import { CaseStudies } from './sections/CaseStudies';
import { Process } from './sections/Process';
import { Testimonials } from './sections/Testimonials';
import { Contact } from './sections/Contact';
import { Footer } from './sections/Footer';

export default function App() {
  return (
    <div className="bg-[#07090D] text-slate-200 font-sans antialiased relative min-h-screen overflow-x-hidden scroll-smooth">
      <Header />
      <main className="w-full pt-20">
        <Hero />
        <MarketReality />
        <CaseStudies />
        <Process />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
`;

fs.writeFileSync(path.join(__dirname, 'src', 'App.jsx'), appJsx.trim());
