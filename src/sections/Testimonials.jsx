import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../components/Card';


const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6, ease: "easeOut" }
};


export function Testimonials() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden" id="testimonios">
      <div className="max-w-6xl mx-auto px-6 lg:px-12 relative">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-16 relative">
          <motion.div {...fadeInUp} className="max-w-2xl">
            <span className="text-xs uppercase tracking-widest font-semibold text-brand block mb-3">Confianza Comprobada</span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
              La tranquilidad de trabajar con un equipo que cumple.
            </h2>
            <p className="text-slate-400 text-sm md:text-base">
              Esto es lo que experimentan quienes han confiado el corazón digital de sus empresas a AppsCore.
            </p>
          </motion.div>
          <motion.div {...fadeInUp} transition={{ duration: 0.6, delay: 0.2 }} className="shrink-0 flex justify-center md:justify-end -mt-4 md:-mt-6">
            <img alt="Gimi de espaldas" className="w-28 sm:w-36 md:w-40 h-auto object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdPcGAwHOMgsgDb8QCEgocve2v05J66PoTB6xfpJHwhN0oVIjef5hi8YFP_VY8GJP9qQIb1pDwQrfzCI5NWNMTZSLJvhFzjowRAC9U5-UFgrAZbdGmKPc0CCGZuyQuoRsCC7D1-IyzglCDHnywqeYtT5yFrzBZ1j9kOlKzNYCaC1_93WvLpzC_OTTKUezXvReIkXIUo3i6YdVS7NX91Kjk1ZYxndAQSJ351GC-g5oX3KtZECcIAihVnhuHLmqhRFdDhw" />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
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
        <motion.div {...fadeInUp} transition={{ duration: 0.6, delay: 0.3 }} className="flex justify-center mt-10">
          <img alt="Gimi feliz sonriendo" className="w-24 sm:w-28 md:w-32 h-auto object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCo8LmkCaqu8Vd0APCeaaIxe1MmZ-Lz5VOxRuHz-8NDphE8WIbvR5jYiyyxyKV-qfQ4DSmuJ5adhXqBKGAtSLzTCFaiL5T7MTgh3Kfja7u0RuTF1CcX0R0kkS63G2uwWxMVC-jcLD5fIzANkfHCNENbquSfZI4NYQgQSl_rJwKRD1Ajx-3zbJXkRpNOr0CdbWaRTeWCYf-uTbqkKk2KwIXOAzepg2p5BTSH5vjUBIHFIpzQC1A-g-jC_nqRj6wU3CWSSQ" />
        </motion.div>
      </div>
    </section>
  );
}