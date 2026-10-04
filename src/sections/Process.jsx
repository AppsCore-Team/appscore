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
          <span className="text-xs uppercase tracking-widest font-semibold text-brand block mb-3">Metodología</span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
            Un método claro, transparente y sin sorpresas.
          </h2>
          <p className="text-slate-300 text-base md:text-lg">
            Sabrás exactamente qué esperar en cada etapa, con comunicación directa y entregables reales que puedes ver funcionar.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          <motion.div {...fadeInUp} transition={{ duration: 0.6, delay: 0 }} className="relative flex flex-col p-6 rounded-2xl bg-carbon-850/50 border border-carbon-border/40 hover:border-brand/40 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand font-display font-bold text-base">
                01
              </div>
              <img alt="Gimi paso 1" className="w-12 h-12 object-contain drop-shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgpv7mJcXLNRmBR3Qno0HGqDD40T8ys7BDCevXgfqBbdVHkKuJPJl6gwlOvgPnHtpcpZsUzEYyx5k3XbPCYWwTuyueBAoMQPLudsLj8HQ7S3nDMozpy5ntyi8HeXrH-XItXHHim1k0japzq4mye5eyxtx0G5vc_uq2eejablQQ_JmijwBNgXHRa0i7IT1cp2PfgEncpX4Bi2I3rcOSP0QlWZK8cuEcbOOcDUst2kXk0oj9otOfq2fbhK4yOgmK5lnMcg" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Escuchamos y entendemos</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Analizamos a fondo tu modelo de negocio, prioridades y presupuesto sin rodeos ni tecnicismos confusos.
            </p>
          </motion.div>

          <motion.div {...fadeInUp} transition={{ duration: 0.6, delay: 0.1 }} className="relative flex flex-col p-6 rounded-2xl bg-carbon-850/50 border border-carbon-border/40 hover:border-brand/40 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand font-display font-bold text-base">
                02
              </div>
              <img alt="Gimi paso 2 feliz" className="w-12 h-12 object-contain drop-shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDm0NwY2GEouRKZvzwLTlzTDRVLPm33aY4BHF2sqCfb--QuVeUUvqDJC1Lia0nT5sT1cssld727Q_An3U7A5Nvc7PNzua-smTfRlXFgFb3U8fm0ZmyOJtuOdFxt01h2WIUCQy1KfbiBhGfjOpMnEc_Qs_C1dAIdxVvCR2mAH7FOHjVNIQZqYRUAs7yl8jMAdTpHEztu01yxFHcl2ATvhEuP22bNwBCxu6BOfv54j4yAjr4C526Bbs9eR6XlzZ5Kn8eNKQ" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Diseñamos la solución exacta</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Definimos los flujos de usuario, la interfaz visual y el plan de trabajo con presupuesto y calendario fijos.
            </p>
          </motion.div>

          <motion.div {...fadeInUp} transition={{ duration: 0.6, delay: 0.2 }} className="relative flex flex-col p-6 rounded-2xl bg-carbon-850/50 border border-carbon-border/40 hover:border-brand/40 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand font-display font-bold text-base">
                03
              </div>
              <img alt="Gimi paso 3 guiñando" className="w-12 h-12 object-contain drop-shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAusBOQpjrg1bXPG0xUJCpKd66ymu54xSRBFph72tFXIdqC1I1mLBA_rC1yI9Ks2mQ7-nkF3WHxgTK6AnnjP_PtnlTbFX1iXZU7g6LgIWS_qQmiCbAOIogG7kX9keSyRen605ZlXp0BQXXsu1OwRbnghBOnuac9-UHNlQaJqmhpW1bhnFrR908ZmFMFxZDPGtM3cmqJY1Hp3VMtAD78JG-KftwLakJAWoVkS09SsthG3zzRqP-0Vdel5-bBVolDm_4jWg" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Construimos con demos quincenales</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Cada dos semanas tienes una versión interactiva que puedes probar con tu equipo para asegurar que todo va perfecto.
            </p>
          </motion.div>

          <motion.div {...fadeInUp} transition={{ duration: 0.6, delay: 0.3 }} className="relative flex flex-col p-6 rounded-2xl bg-carbon-850/50 border border-carbon-border/40 hover:border-brand/40 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand font-display font-bold text-base">
                04
              </div>
              <img alt="Gimi paso 4 cool" className="w-12 h-12 object-contain drop-shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjGn6SMdP2TgD3lklvFnhf7HFQ0VDKN8KQWnz3CXPabKM-ITg3wCrzwHiJ_iaqHxpEJNKQtkMM7jbmtOcNlHXda7R1A7PjUAy0HuWAa5FQgXyaJovWcFDpJEWugnKecs96wVmpPxU9pCiVzcnFTmjRdFQDJuTp8WxO7nk8a8qhcIOxXy5hHoMEHytjtxt2xjCWl7IW00HVM-yWQx5UNt_qHCkwNtEtbsdHwTTbXtsbcIV_ijY_MArsW19pgmSVfyvp9Q" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Lanzamiento y acompañamiento</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Publicamos tu software, te entregamos el código completo y te acompañamos con garantía técnica pos-lanzamiento.
            </p>
          </motion.div>
        </div>

        <motion.div {...fadeInUp} className="mt-16 p-6 rounded-2xl bg-carbon-850 border border-carbon-border flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-2xl overflow-hidden border border-brand/40 bg-carbon-800 shrink-0 shadow-sm shadow-brand/10 flex items-center justify-center">
              <img alt="Gimi protegiendo ideas" className="w-10 h-10 object-contain" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3OHA8TB-UQsKeGxQLV9BzQf-v_pnxqijuAVoldb9AR5nuiO0rXeroQszHlulijBCJTyBfyQIX8aO1zSxSO_yufyMLX9Cw4em1dsqFy9qnT2W5RrjQG16kxOR2wkPZnqE9JcJkf1ZIDDdJMPhUO7xQBYCWq983VBmugRQMCCUHyVuVsw4d4iy0Rk3cet9yCvvwlFfUqFDMVccBicFNWkqpJZdamGS09qJZd9k_2ccq9gxXinifrWxznNojfxwZLM4NFw" />
            </div>
            <div className="text-left">
              <span className="text-xs text-brand font-semibold block uppercase tracking-wider">Compromiso GimiCode &amp; AppsCore</span>
              <span className="text-sm text-slate-300">
                Firmamos un <strong>Acuerdo de Confidencialidad (NDA)</strong> antes de conocer tus ideas y procesos internos.
              </span>
            </div>
          </div>
          <a className="text-xs font-semibold text-brand hover:underline shrink-0" href="#contacto">
            Solicitar NDA previo →
          </a>
        </motion.div>
      </div>
    </section>
  );
}