import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';

export function ClientesPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Registration form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [adminCode, setAdminCode] = useState('');
  
  // Toast notification state
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 5000);
  };

  // Error translation helper
  const translateAuthError = (error) => {
    const msg = error.message || '';
    if (msg.includes('already registered') || msg.includes('User already exists')) {
      return 'El correo electrónico ya está registrado.';
    }
    if (msg.includes('Password should be at least')) {
      return 'La contraseña debe tener al menos 6 caracteres.';
    }
    if (msg.includes('Database error saving new user')) {
      return 'El código de administrador es inválido o ya fue utilizado.';
    }
    if (msg.includes('Error sending confirmation email')) {
      return 'Error con el servidor de correos (SMTP). Verifica la configuración.';
    }
    if (msg.includes('Invalid login credentials')) {
      return 'Correo o contraseña incorrectos.';
    }
    if (msg.includes('Email not confirmed')) {
      return 'Por favor confirma tu correo electrónico antes de iniciar sesión.';
    }
    if (msg.includes('Valid email is required') || msg.includes('Unable to validate email')) {
      return 'Debes ingresar un correo electrónico válido.';
    }
    return 'Ocurrió un error inesperado. Intenta nuevamente.';
  };

  const [view, setView] = useState(() => {
    if (typeof window !== 'undefined') {
      if (window.location.hash === '#registro') return 'register';
      if (window.location.hash === '#recuperar') return 'recover';
    }
    return 'login';
  });

  useEffect(() => {
    if (view === 'register') {
      window.history.replaceState(null, '', '#registro');
    } else if (view === 'recover') {
      window.history.replaceState(null, '', '#recuperar');
    } else {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }, [view]);

  return (
    <div className="bg-[#0b0c0e] text-[#e3e2e6] min-h-screen flex flex-col justify-between selection:bg-[#94d600] selection:text-black font-sans">
      {/* Ambient Organic Waves & Glows Backdrop (Desktop optimized) */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-[#94d600]/8 rounded-full blur-[140px]"></div>
        <div className="absolute top-1/3 right-10 w-[680px] h-[680px] bg-[#94d600]/10 rounded-full blur-[160px]"></div>
        <div className="absolute -bottom-48 left-1/3 w-[520px] h-[520px] bg-[#69fa99]/6 rounded-full blur-[140px]"></div>
        
        <svg className="absolute -top-16 -left-16 w-[480px] h-[480px] text-[#94d600] opacity-20" fill="none" viewBox="0 0 500 500">
          <path d="M-40 240 C 140 220, 220 90, 480 30" stroke="currentColor" strokeLinecap="round" strokeWidth="2"></path>
          <path d="M-20 340 C 180 310, 280 140, 520 80" opacity="0.6" stroke="currentColor" strokeDasharray="8 8" strokeWidth="1"></path>
        </svg>
        
        <svg className="absolute -bottom-24 -right-24 w-[560px] h-[560px] text-[#94d600] opacity-25" fill="none" viewBox="0 0 600 600">
          <path d="M120 580 C 260 420, 420 400, 600 240" stroke="currentColor" strokeLinecap="round" strokeWidth="3"></path>
          <path d="M220 590 C 340 480, 470 470, 600 360" stroke="currentColor" strokeDasharray="6 6" strokeWidth="1.5"></path>
        </svg>
      </div>

      <header className="relative z-20 w-full border-b border-white/[0.06] backdrop-blur-md bg-[#0b0c0e]/80">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
          <a className="flex items-center gap-3 group transition-transform active:scale-[0.98]" href="/">
            <img alt="GimiCode" className="h-9 w-auto object-contain filter drop-shadow-[0_2px_10px_rgba(148,214,0,0.18)]" src="/gimicode.png" />
          </a>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-md shadow-sm">
              <span className="text-sm font-medium text-zinc-400">Tu visión, nuestro código</span>
              <span className="font-mono text-xs text-[#94d600] font-bold tracking-tight px-1.5 py-0.5 rounded bg-[#94d600]/10 border border-[#94d600]/25">&lt;/&gt;</span>
            </div>
            <a className="text-xs font-semibold text-zinc-400 hover:text-white px-3.5 py-2 rounded-lg border border-transparent hover:border-white/10 transition-colors" href="#">
              ¿Necesitas ayuda?
            </a>
          </div>
        </div>
      </header>

      <main className="relative z-10 w-full flex-grow flex items-center py-8 lg:py-12">
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-center">
            
            <div className="lg:col-span-7 flex flex-col justify-center">
                            <div className="mb-6">
                <h1 className="font-display text-4xl sm:text-5xl lg:text-[46px] font-bold text-white tracking-tight leading-[1.12] mb-3">
                  {view === 'register' ? (
                    <>Crea tu <span className="text-[#94d600]">cuenta</span></>
                  ) : view === 'recover' ? (
                    <>Recuperar <span className="text-[#94d600]">contraseña</span></>
                  ) : (
                    <>¡Bienvenido a <span className="text-[#94d600]">GimiCode</span>!</>
                  )}
                </h1>
                <p className="text-base text-zinc-400 max-w-xl leading-relaxed">
                  {view === 'register'
                    ? "Únete a nosotros y comienza a construir proyectos increíbles. Necesitas un código de administrador para continuar."
                    : view === 'recover'
                    ? "Ingresa tu correo electrónico y te enviaremos las instrucciones para restablecer tu acceso."
                    : "Accede a tu cuenta y continúa con tus proyectos, ideas y todo lo que construimos juntos."}
                </p>
              </div>

              <div className="w-full max-w-xl bg-[#13151b] border border-white/10 rounded-2xl p-7 sm:p-9 shadow-2xl relative shadow-black/80">
                <div className="absolute -top-10 -right-10 w-36 h-36 bg-[#94d600]/10 rounded-full blur-2xl pointer-events-none"></div>
                
                {view === 'register' ? (
                  <form className="space-y-4 relative z-10" onSubmit={async (e) => { 
                    e.preventDefault(); 
                    setLoading(true);
                    
                    const { data, error } = await supabase.auth.signUp({
                      email,
                      password,
                      options: {
                        emailRedirectTo: `${window.location.origin}/clientes/`,
                        data: {
                          admin_code: adminCode,
                          full_name: fullName,
                          company: company,
                          phone: phone,
                        }
                      }
                    });
                    
                    if (error) {
                      setLoading(false);
                      showToast(translateAuthError(error), 'error');
                      return;
                    } 
                    
                    // Prevención de enumeración de Supabase: si el correo ya existe,
                    // Supabase no devuelve error por seguridad, pero la lista de identidades viene vacía.
                    if (data?.user?.identities && data.user.identities.length === 0) {
                      setLoading(false);
                      showToast('El correo electrónico ya está registrado.', 'error');
                      return;
                    }

                    // Call Edge Function to send custom welcome email
                    await supabase.functions.invoke('send-welcome-email', {
                      body: { user_name: fullName, user_email: email }
                    });
                    
                    setLoading(false);
                    showToast("Registro exitoso. Serás redirigido al panel.", 'success');
                    setTimeout(() => {
                      window.location.href = '/panel/';
                    }, 2000);
                  }}>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                        Nombre completo
                      </label>
                      <div className="relative flex items-center">
                        <span className="material-symbols-outlined absolute left-3.5 text-zinc-400 text-xl pointer-events-none">person</span>
                        <input className="w-full pl-11 pr-4 py-3 bg-[#0d0f14] text-white placeholder-zinc-500 rounded-xl border border-white/10 focus:outline-none focus:border-[#94d600] focus:ring-1 focus:ring-[#94d600] text-sm transition-all duration-150" placeholder="Ej. Juan Pérez" required type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                        Empresa / Organización
                      </label>
                      <div className="relative flex items-center">
                        <span className="material-symbols-outlined absolute left-3.5 text-zinc-400 text-xl pointer-events-none">business</span>
                        <input className="w-full pl-11 pr-4 py-3 bg-[#0d0f14] text-white placeholder-zinc-500 rounded-xl border border-white/10 focus:outline-none focus:border-[#94d600] focus:ring-1 focus:ring-[#94d600] text-sm transition-all duration-150" placeholder="Nombre de tu empresa" required type="text" value={company} onChange={(e) => setCompany(e.target.value)} />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                        Celular
                      </label>
                      <div className="relative flex items-center">
                        <span className="material-symbols-outlined absolute left-3.5 text-zinc-400 text-xl pointer-events-none">phone_iphone</span>
                        <input className="w-full pl-11 pr-4 py-3 bg-[#0d0f14] text-white placeholder-zinc-500 rounded-xl border border-white/10 focus:outline-none focus:border-[#94d600] focus:ring-1 focus:ring-[#94d600] text-sm transition-all duration-150" placeholder="+57 300 000 0000" required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                        Correo electrónico
                      </label>
                      <div className="relative flex items-center">
                        <span className="material-symbols-outlined absolute left-3.5 text-zinc-400 text-xl pointer-events-none">mail</span>
                        <input className="w-full pl-11 pr-4 py-3 bg-[#0d0f14] text-white placeholder-zinc-500 rounded-xl border border-white/10 focus:outline-none focus:border-[#94d600] focus:ring-1 focus:ring-[#94d600] text-sm transition-all duration-150" placeholder="tu@empresa.com" required type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                        Contraseña
                      </label>
                      <div className="relative flex items-center">
                        <span className="material-symbols-outlined absolute left-3.5 text-zinc-400 text-xl pointer-events-none">lock</span>
                        <input className="w-full pl-11 pr-11 py-3 bg-[#0d0f14] text-white placeholder-zinc-500 rounded-xl border border-white/10 focus:outline-none focus:border-[#94d600] focus:ring-1 focus:ring-[#94d600] text-sm transition-all duration-150" placeholder="••••••••••••" required type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} />
                        <button aria-label="Mostrar u ocultar contraseña" className="absolute right-3.5 text-zinc-400 hover:text-white p-1 transition-colors" type="button" onClick={() => setShowPassword(!showPassword)}>
                          <span className="material-symbols-outlined text-xl">{showPassword ? 'visibility' : 'visibility_off'}</span>
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                        Código de administrador
                      </label>
                      <div className="relative flex items-center">
                        <span className="material-symbols-outlined absolute left-3.5 text-[#94d600] text-xl pointer-events-none">key</span>
                        <input className="w-full pl-11 pr-4 py-3 bg-[#0d0f14]/50 text-white placeholder-zinc-500 rounded-xl border border-[#94d600]/30 focus:outline-none focus:border-[#94d600] focus:ring-1 focus:ring-[#94d600] text-sm transition-all duration-150" placeholder="Código provisto por el admin" required type="text" value={adminCode} onChange={(e) => setAdminCode(e.target.value)} />
                      </div>
                    </div>

                    <button className="w-full mt-5 py-3.5 px-6 bg-[#94d600] hover:bg-[#a3e635] text-[#121f00] font-display font-bold text-sm sm:text-base rounded-xl flex items-center justify-center gap-2.5 transition-all duration-200 shadow-[0_4px_25px_rgba(148,214,0,0.32)] hover:shadow-[0_6px_30px_rgba(148,214,0,0.45)] active:scale-[0.99] disabled:opacity-70" disabled={loading} type="submit">
                      <span>{loading ? 'Registrando...' : 'Registrarse'}</span>
                      <span className="material-symbols-outlined font-bold text-xl">how_to_reg</span>
                    </button>

                    <div className="text-center pt-2 text-sm text-zinc-400">
                      ¿Ya tienes una cuenta?
                      <button className="text-[#94d600] hover:text-[#aff331] font-semibold ml-1.5 inline-flex items-center gap-1 group" type="button" onClick={() => setView('login')}>
                        <span>Iniciar sesión</span>
                        <span className="material-symbols-outlined text-base group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                      </button>
                    </div>
                  </form>
                ) : view === 'recover' ? (
                  <form className="space-y-4 relative z-10" onSubmit={(e) => { e.preventDefault(); console.log('Recuperación enviada'); }}>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                        Correo electrónico
                      </label>
                      <div className="relative flex items-center">
                        <span className="material-symbols-outlined absolute left-3.5 text-zinc-400 text-xl pointer-events-none">mail</span>
                        <input className="w-full pl-11 pr-4 py-3 bg-[#0d0f14] text-white placeholder-zinc-500 rounded-xl border border-white/10 focus:outline-none focus:border-[#94d600] focus:ring-1 focus:ring-[#94d600] text-sm transition-all duration-150" placeholder="tu@empresa.com" required type="email"/>
                      </div>
                    </div>

                    <button className="w-full mt-5 py-3.5 px-6 bg-[#94d600] hover:bg-[#a3e635] text-[#121f00] font-display font-bold text-sm sm:text-base rounded-xl flex items-center justify-center gap-2.5 transition-all duration-200 shadow-[0_4px_25px_rgba(148,214,0,0.32)] hover:shadow-[0_6px_30px_rgba(148,214,0,0.45)] active:scale-[0.99]" type="submit">
                      <span>Enviar instrucciones</span>
                      <span className="material-symbols-outlined font-bold text-xl">send</span>
                    </button>

                    <div className="text-center pt-2 text-sm text-zinc-400">
                      ¿Ya la recordaste?
                      <button className="text-[#94d600] hover:text-[#aff331] font-semibold ml-1.5 inline-flex items-center gap-1 group" type="button" onClick={() => setView('login')}>
                        <span>Iniciar sesión</span>
                        <span className="material-symbols-outlined text-base group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  <form className="space-y-4 relative z-10" onSubmit={async (e) => { 
                    e.preventDefault(); 
                    setLoading(true);
                    const { error } = await supabase.auth.signInWithPassword({ email, password });
                    setLoading(false);
                    if (error) {
                      showToast(translateAuthError(error), 'error');
                    } else {
                      window.location.href = '/panel/';
                    }
                  }}>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                        Correo electrónico
                      </label>
                      <div className="relative flex items-center">
                        <span className="material-symbols-outlined absolute left-3.5 text-zinc-400 text-xl pointer-events-none">mail</span>
                        <input className="w-full pl-11 pr-4 py-3 bg-[#0d0f14] text-white placeholder-zinc-500 rounded-xl border border-white/10 focus:outline-none focus:border-[#94d600] focus:ring-1 focus:ring-[#94d600] text-sm transition-all duration-150" placeholder="tu@empresa.com" required type="email"/>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                        Contraseña
                      </label>
                      <div className="relative flex items-center">
                        <span className="material-symbols-outlined absolute left-3.5 text-zinc-400 text-xl pointer-events-none">lock</span>
                        <input className="w-full pl-11 pr-11 py-3 bg-[#0d0f14] text-white placeholder-zinc-500 rounded-xl border border-white/10 focus:outline-none focus:border-[#94d600] focus:ring-1 focus:ring-[#94d600] text-sm transition-all duration-150" id="password-input" placeholder="••••••••••••" required type={showPassword ? "text" : "password"}/>
                        <button aria-label="Mostrar u ocultar contraseña" className="absolute right-3.5 text-zinc-400 hover:text-white p-1 transition-colors" type="button" onClick={() => setShowPassword(!showPassword)}>
                          <span className="material-symbols-outlined text-xl">{showPassword ? 'visibility' : 'visibility_off'}</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs sm:text-sm pt-1">
                      <label className="flex items-center gap-2.5 cursor-pointer select-none group">
                        <input defaultChecked className="w-4 h-4 rounded bg-[#0d0f14] border-white/20 text-[#94d600] focus:ring-[#94d600] focus:ring-offset-0 transition cursor-pointer" type="checkbox"/>
                        <span className="text-zinc-400 group-hover:text-zinc-200 transition-colors">Recordar mi sesión</span>
                      </label>
                      <a className="text-[#94d600] hover:text-[#aff331] font-medium transition-colors" href="#recuperar" onClick={(e) => { e.preventDefault(); setView('recover'); }}>
                        ¿Olvidaste tu contraseña?
                      </a>
                    </div>

                    <button className="w-full mt-3 py-3.5 px-6 bg-[#94d600] hover:bg-[#a3e635] text-[#121f00] font-display font-bold text-sm sm:text-base rounded-xl flex items-center justify-center gap-2.5 transition-all duration-200 shadow-[0_4px_25px_rgba(148,214,0,0.32)] hover:shadow-[0_6px_30px_rgba(148,214,0,0.45)] active:scale-[0.99]" type="submit">
                      <span>Iniciar sesión</span>
                      <span className="material-symbols-outlined font-bold text-xl">arrow_forward</span>
                    </button>

                    <div className="relative flex items-center justify-center my-3">
                      <div className="w-full h-px bg-white/10"></div>
                      <span className="absolute px-3 bg-[#13151b] font-mono text-xs text-zinc-500 uppercase">o</span>
                    </div>

                    <button className="w-full py-3 px-5 bg-[#0d0f14] hover:bg-white/[0.04] border border-white/10 hover:border-white/20 rounded-xl flex items-center justify-center gap-3 text-zinc-200 hover:text-white font-medium text-sm transition-all duration-150 active:scale-[0.99]" type="button">
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                        <path d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.87c2.27-2.09 3.675-5.17 3.675-9.15z" fill="#4285F4"></path>
                        <path d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.05c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.26v3.15C3.25 21.36 7.31 24 12 24z" fill="#34A853"></path>
                        <path d="M5.27 14.24c-.25-.72-.39-1.5-.39-2.24s.14-1.52.39-2.24V6.61H1.26C.46 8.21 0 10.04 0 12s.46 3.79 1.26 5.39l4.01-3.15z" fill="#FBBC05"></path>
                        <path d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.64 1.26 6.61l4.01 3.15c.95-2.85 3.6-4.96 6.73-4.96z" fill="#EA4335"></path>
                      </svg>
                      <span>Continuar con Google</span>
                    </button>

                    <div className="text-center pt-2 text-sm text-zinc-400">
                      ¿No tienes una cuenta?
                      <button className="text-[#94d600] hover:text-[#aff331] font-semibold ml-1.5 inline-flex items-center gap-1 group" type="button" onClick={() => setView('register')}>
                        <span>Crear cuenta</span>
                        <span className="material-symbols-outlined text-base group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
            
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                <svg className="w-full max-w-[480px] h-auto text-[#94d600] opacity-25 filter drop-shadow-[0_0_40px_rgba(148,214,0,0.35)]" fill="none" viewBox="0 0 500 500">
                  <path d="M430 170 C 400 70, 310 30, 210 40 C 90 55, 30 170, 45 295 C 60 415, 175 475, 300 460 C 405 445, 450 360, 455 285 L 260 285" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="12"></path>
                </svg>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 font-mono text-3xl font-bold text-[#94d600] opacity-50 drop-shadow-[0_0_15px_rgba(148,214,0,0.4)]">
                  &lt;/&gt;
                </div>
              </div>
              <div className="absolute w-[360px] h-[360px] rounded-full bg-[#94d600]/20 blur-[90px] pointer-events-none"></div>
              <div className="relative z-10 flex flex-col items-center">
                <img alt="Mascota GimiCode" className="w-full max-w-[420px] xl:max-w-[460px] h-auto max-h-[500px] object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.85)] filter hover:scale-[1.02] transition-transform duration-300" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBjduVjugiZzAMAIF0q5Py0di-DyBUUHuk1xT_ztUuQmveICa7KlILz_FJjd3-nAwUgNjk2jHu3E_HcG4S2CNefaT3A2ehnk8p3On_f62VTn46_eMIiQ1EUd2hNxI_t8NJTA92tG840W_9YfJn7QlgMYVkEGMejdnJu6FUeHJZCl4-aA2wPTd8aAjEGCraMk6uhdHZwPQzj6SUiMjPpPLOQEDqqeTYunDf5xUD3SwtCOXE8hH99CwwbkQMTourg56qkyw"/>
                <div className="w-3/4 h-8 bg-black/90 blur-xl rounded-full -mt-6"></div>
              </div>
            </div>

          </div>
        </div>
      </main>

      <section className="relative z-10 w-full border-t border-white/[0.06] bg-[#0b0c0e]/60 py-8 lg:py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-[#94d600]/30 transition-colors group">
              <div className="w-11 h-11 rounded-lg bg-[#94d600]/10 border border-[#94d600]/25 flex items-center justify-center text-[#94d600] shrink-0 group-hover:scale-105 transition-transform">
                <span className="font-mono text-base font-bold">&lt;/&gt;</span>
              </div>
              <div>
                <div className="font-display font-bold text-sm text-white flex items-center gap-1.5 mb-1">
                  <span className="text-xs text-[#94d600] font-mono">01</span>
                  <span>Desarrollo a la medida</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">Convertimos tus ideas en soluciones reales.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-[#94d600]/30 transition-colors group">
              <div className="w-11 h-11 rounded-lg bg-[#94d600]/10 border border-[#94d600]/25 flex items-center justify-center text-[#94d600] shrink-0 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-xl">deployed_code</span>
              </div>
              <div>
                <div className="font-display font-bold text-sm text-white flex items-center gap-1.5 mb-1">
                  <span className="text-xs text-[#94d600] font-mono">02</span>
                  <span>Productos propios</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">Creamos herramientas que impulsan tu negocio.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-[#94d600]/30 transition-colors group">
              <div className="w-11 h-11 rounded-lg bg-[#94d600]/10 border border-[#94d600]/25 flex items-center justify-center text-[#94d600] shrink-0 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-xl">groups</span>
              </div>
              <div>
                <div className="font-display font-bold text-sm text-white flex items-center gap-1.5 mb-1">
                  <span className="text-xs text-[#94d600] font-mono">03</span>
                  <span>Equipo experto</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">Talento y experiencia a tu servicio.</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-[#94d600]/30 transition-colors group">
              <div className="w-11 h-11 rounded-lg bg-[#94d600]/10 border border-[#94d600]/25 flex items-center justify-center text-[#94d600] shrink-0 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-xl">rocket_launch</span>
              </div>
              <div>
                <div className="font-display font-bold text-sm text-white flex items-center gap-1.5 mb-1">
                  <span className="text-xs text-[#94d600] font-mono">04</span>
                  <span>Innovación constante</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">Siempre un paso adelante en tecnología.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="w-full bg-[#090A0D] border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img alt="GimiCode" className="h-8 md:h-10 w-auto object-contain opacity-90" src="/gimicode.png" />
            <span className="text-xs text-slate-400">Software a la medida con sentido humano y comercial.</span>
          </div>
          <div className="text-xs text-slate-400">
            © 2026 GimiCode. Todos los derechos reservados.
          </div>
        </div>
      </footer>

      {/* Toast Notification */}
      <div className={`fixed top-6 right-6 sm:top-8 sm:right-8 z-50 transition-all duration-400 transform ${toast.show ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-10 opacity-0 scale-95 pointer-events-none'}`}>
        <div className={`flex items-center gap-3.5 px-5 py-4 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] border backdrop-blur-xl ${toast.type === 'error' ? 'bg-[#1f0e0e]/90 border-red-500/40 text-red-200' : 'bg-[#101705]/90 border-[#94d600]/40 text-[#94d600]'}`}>
          <span className="material-symbols-outlined text-2xl">
            {toast.type === 'error' ? 'error' : 'check_circle'}
          </span>
          <p className="text-sm font-medium pr-4 text-white drop-shadow-md">{toast.message}</p>
          <button type="button" onClick={() => setToast(prev => ({ ...prev, show: false }))} className={`p-1.5 rounded-lg transition-colors ml-1 ${toast.type === 'error' ? 'hover:bg-red-500/20 text-red-300' : 'hover:bg-[#94d600]/20 text-[#94d600]'}`}>
            <span className="material-symbols-outlined text-lg block">close</span>
          </button>
        </div>
      </div>
    </div>
  );
}
