import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import emailjs from '@emailjs/browser';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6, ease: "easeOut" }
};

export function Contact() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const form = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', form.current, 'YOUR_PUBLIC_KEY')
    emailjs.sendForm(
      import.meta.env.EMAILJS_SERVICE_ID || 'service_id_here',
      import.meta.env.EMAILJS_TEMPLATE_ID || 'template_id_here',
      form.current,
      import.meta.env.EMAILJS_PUBLIC_KEY || 'public_key_here'
    )
      .then((result) => {
          setLoading(false);
          setSuccess(true);
          form.current.reset();
          
          setTimeout(() => setSuccess(false), 5000);
      }, (error) => {
          console.error(error);
          setLoading(false);
          alert(`Hubo un error al enviar el mensaje: ${error.text || error.message || JSON.stringify(error)}`);
      });
  };

  return (
    <section className="py-20 md:py-32 bg-[#11141A] border-t border-carbon-border/60 relative overflow-hidden" id="contacto">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand/5 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="max-w-6xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div {...fadeInUp} className="lg:col-span-5">
            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-carbon-850/80 border border-brand/20 mb-6 w-max max-w-full shadow-sm">
              <div className="w-12 h-12 rounded-xl overflow-hidden border border-brand/35 bg-carbon-900 shrink-0 flex items-center justify-center">
                <img alt="Gimi Mascota" className="w-10 h-10 object-contain" src="/gimi_feliz.png"  />
              </div>
              <div className="min-w-0 pr-2">
                <div className="text-xs font-semibold text-brand tracking-wide uppercase truncate sm:whitespace-normal">Gimi está listo para ayudarte</div>
                <p className="text-xs text-slate-300 leading-snug mt-0.5">Revisaremos tu propuesta en menos de 24 horas, con honestidad y sin presiones.</p>
              </div>
            </div>
            <span className="text-xs uppercase tracking-widest font-semibold text-brand block mb-3">Hablemos con Calma</span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4 leading-tight">
              ¿Tienes una idea o necesitas mejorar tu software actual?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
              Cuéntanos brevemente sobre tu proyecto. Uno de nuestros líderes técnicos evaluará tu necesidad y te ofrecerá una orientación honesta, viable y sin ningún compromiso comercial forzado.
            </p>
            <div className="space-y-4 text-xs sm:text-sm text-slate-300">
              <div className="flex items-center gap-3">
                <span translate="no" className="material-symbols-outlined text-brand text-lg">schedule</span>
                <span>Respuesta garantizada en menos de 24 horas</span>
              </div>
              <div className="flex items-center gap-3">
                <span translate="no" className="material-symbols-outlined text-brand text-lg">shield</span>
                <span>Confidencialidad total bajo NDA</span>
              </div>
              <div className="flex items-center gap-3">
                <span translate="no" className="material-symbols-outlined text-brand text-lg">forum</span>
                <span>Conversación directa con ingenieros líderes, sin vendedores</span>
              </div>
            </div>
          </motion.div>

          <motion.div {...fadeInUp} transition={{ duration: 0.6, delay: 0.2 }} className="lg:col-span-7 bg-carbon-850 p-8 sm:p-10 rounded-3xl border border-carbon-border shadow-xl">
            {success ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 rounded-full bg-brand/20 flex items-center justify-center mx-auto mb-4">
                  <span translate="no" className="material-symbols-outlined text-brand text-3xl">check_circle</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">¡Gracias por escribirnos!</h3>
                <p className="text-slate-400">Revisaremos los detalles de tu proyecto y nos pondremos en contacto contigo en breve con una propuesta clara.</p>
                <Button variant="secondary" className="mt-8" onClick={() => setSuccess(false)}>Enviar otro mensaje</Button>
              </div>
            ) : (
              <form ref={form} className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Tu Nombre</label>
                    <Input name="user_name" placeholder="Ej. Alejandro Vega" required type="text" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Correo de Contacto</label>
                    <Input name="user_email" placeholder="alejandro@tuempresa.com" required type="email" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Empresa u Organización</label>
                    <Input name="company_name" placeholder="Nombre de tu negocio" required type="text" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">¿Qué necesitas desarrollar?</label>
                    <Input as="select" name="project_type" required>
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
                  <Input as="textarea" name="message" required placeholder="¿Qué problema buscas resolver y cuál es tu tiempo estimado de inicio?" rows="4" />
                </div>
                <Button type="submit" variant="primary" disabled={loading} className={`w-full py-4 gap-2 text-sm tracking-wide shadow-lg ${loading ? 'opacity-70' : 'shadow-brand/20'}`}>
                  <span>{loading ? 'Enviando...' : 'Solicitar diagnóstico gratuito'}</span>
                  <span translate="no" className="material-symbols-outlined text-lg">{loading ? 'hourglass_top' : 'send'}</span>
                </Button>
                <p className="text-center text-xs text-slate-400">
                  Sin spam ni presiones. Respetamos tu tiempo y tus datos.
                </p>
              </form>
            )}
          </motion.div>
          <div className="hidden xl:block absolute -right-24 -bottom-10 z-20 pointer-events-none">
            <img alt="Gimi de pie contacto" className="w-48 xl:w-56 h-auto object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.8)]" src="/gimi_depie.png"  />
          </div>
        </div>
      </div>
    </section>
  );
}



