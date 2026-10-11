import React, { useState } from 'react';
import { supabase } from '../../../supabase';
import { useToast } from '../../components/ui/Toast';
import { DatePickerCalendar } from '../../components/ui/DatePickerCalendar';

const getTodayStr = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Límite de 2 meses a partir de la fecha actual
const getMaxDateStr = () => {
  const now = new Date();
  const target = new Date(now.getFullYear(), now.getMonth() + 2, now.getDate());
  const year = target.getFullYear();
  const month = String(target.getMonth() + 1).padStart(2, '0');
  const day = String(target.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getDefaultFormData = (profile) => ({
  project_name: '',
  contact_name: profile?.full_name || '',
  company: profile?.company || '',
  email: profile?.email || '',
  role_in_company: '',
  main_problem: '',
  current_solution: '',
  project_stage: '',
  critical_deadline: '',
  success_criteria: '',
  investment_range: '',
  meeting_date: getTodayStr(),
  meeting_time: '',
  meeting_admin_id: null,
});

export function CreateProjectPage({ profile }) {
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editId, setEditId] = useState(null);

  // Lazy initialization to immediately restore saved draft on first render
  const [formData, setFormData] = useState(() => {
    const defaults = getDefaultFormData(profile);
    const params = new URLSearchParams(window.location.search);
    if (!params.get('edit')) {
      try {
        const savedDraft = localStorage.getItem('newProjectDraft');
        if (savedDraft) {
          const parsed = JSON.parse(savedDraft);
          if (parsed && parsed.formData) {
            return { ...defaults, ...parsed.formData };
          }
        }
      } catch (e) {
        console.error('Error loading saved draft:', e);
      }
    }
    return defaults;
  });

  const [currentStep, setCurrentStep] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    if (!params.get('edit')) {
      try {
        const savedDraft = localStorage.getItem('newProjectDraft');
        if (savedDraft) {
          const parsed = JSON.parse(savedDraft);
          if (parsed && typeof parsed.currentStep === 'number' && parsed.currentStep >= 1 && parsed.currentStep <= 5) {
            return parsed.currentStep;
          }
        }
      } catch (e) {
        console.error('Error loading saved step:', e);
      }
    }
    return 1;
  });

  const [hasDraftRestored, setHasDraftRestored] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('edit')) return false;
    try {
      const saved = localStorage.getItem('newProjectDraft');
      if (saved) {
        const parsed = JSON.parse(saved);
        return Boolean(parsed?.formData?.project_name || parsed?.formData?.main_problem || (parsed?.currentStep > 1));
      }
    } catch {}
    return false;
  });

  const isFirstRender = React.useRef(true);

  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const fetchAvailableSlots = async (dateStr) => {
    setLoadingSlots(true);
    setAvailableSlots([]);
    setFormData(prev => ({ ...prev, meeting_date: dateStr, meeting_time: '', meeting_admin_id: null }));

    try {
      const dayOfWeekMap = { 0: 7, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6 };
      const [year, month, day] = dateStr.split('-');
      const dateObj = new Date(year, month - 1, day);
      const dayId = dayOfWeekMap[dateObj.getDay()];
      
      const { data: adminsAv } = await supabase.from('admin_availability').select('*');
      const { data: booked } = await supabase.rpc('get_booked_meetings', { p_date: dateStr });
      
      const allSlotsMap = new Map();
      
      adminsAv?.forEach(admin => {
        let startStr = null;
        let endStr = null;
        
        if (admin.schedule_type === 'fixed') {
           if (admin.schedule_data?.days?.includes(dayId)) {
             startStr = admin.schedule_data.start;
             endStr = admin.schedule_data.end;
           }
        } else {
           const dayConf = admin.schedule_data?.days?.[dayId];
           if (dayConf?.active) {
             startStr = dayConf.start;
             endStr = dayConf.end;
           }
        }
        
        if (startStr && endStr) {
           const startHour = parseInt(startStr.split(':')[0]);
           const endHour = parseInt(endStr.split(':')[0]);
           
           for (let h = startHour; h < endHour; h++) {
             const timeStr = `${h.toString().padStart(2, '0')}:00`;
             const isBooked = booked?.some(b => b.meeting_admin_id === admin.user_id && b.meeting_time === timeStr);
             if (!isBooked) {
               if (!allSlotsMap.has(timeStr)) {
                 allSlotsMap.set(timeStr, admin.user_id);
               }
             }
           }
        }
      });
      
      const availableArr = Array.from(allSlotsMap.entries()).map(([time, admin_id]) => ({ time, admin_id }));
      availableArr.sort((a,b) => a.time.localeCompare(b.time));
      setAvailableSlots(availableArr);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSlots(false);
    }
  };

  // Check edit query param on mount
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('edit');
    if (id) {
      setEditId(id);
      loadProject(id);
    }
  }, []);

  // Update contact info from profile when profile loads
  React.useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        contact_name: prev.contact_name || profile.full_name || '',
        company: prev.company || profile.company || '',
        email: prev.email || profile.email || '',
      }));
    }
  }, [profile]);

  // Save draft whenever formData or currentStep changes (skip first render to prevent overwriting)
  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!editId) {
      localStorage.setItem('newProjectDraft', JSON.stringify({ formData, currentStep }));
    }
  }, [formData, currentStep, editId]);

  const handleDiscardDraft = () => {
    localStorage.removeItem('newProjectDraft');
    setFormData(getDefaultFormData(profile));
    setCurrentStep(1);
    setHasDraftRestored(false);
    addToast('Borrador descartado. Iniciando formulario en limpio.', 'info');
  };

  React.useEffect(() => {
    if (currentStep === 5) {
      const targetDate = formData.meeting_date || getTodayStr();
      if (!formData.meeting_date) {
        setFormData(prev => ({ ...prev, meeting_date: targetDate }));
      }
      fetchAvailableSlots(targetDate);
    }
  }, [currentStep]);

  const loadProject = async (id) => {
    try {
      const { data, error } = await supabase.from('project_requests').select('*').eq('id', id).single();
      if (error) throw error;
      if (data) {
        setFormData({
          project_name: data.project_name || '',
          contact_name: data.contact_name,
          company: data.company,
          email: data.email,
          role_in_company: data.role_in_company,
          main_problem: data.main_problem,
          current_solution: data.current_solution,
          project_stage: data.project_stage,
          critical_deadline: data.critical_deadline,
          success_criteria: data.success_criteria,
          investment_range: data.investment_range,
        });
      }
    } catch (err) {
      addToast('Error cargando el proyecto a editar', 'error');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, 5));
  const handlePrev = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentStep < 5) {
      handleNext();
      return;
    }
    
    setIsSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No hay sesión activa');

      if (editId) {
        const { error } = await supabase.from('project_requests').update(formData).eq('id', editId);
        if (error) throw error;
        addToast('Proyecto actualizado exitosamente', 'success');
      } else {
        const { error } = await supabase.from('project_requests').insert({
          user_id: session.user.id,
          status: 'En espera reunión',
          ...formData
        });
        if (error) throw error;
        addToast('Proyecto solicitado exitosamente', 'success');
        localStorage.removeItem('newProjectDraft');
      }
      window.location.href = '/panel/proyectos';
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressPercent = (currentStep / 5) * 100;

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0c0e12] relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-lime-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Header / Progress */}
      <header className="px-8 py-6 border-b border-white/[0.05] relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button onClick={() => window.location.href = '/panel/proyectos'} className="w-10 h-10 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center transition-colors">
              <span className="material-symbols-outlined text-slate-400">arrow_back</span>
            </button>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">{editId ? 'Editar Proyecto' : 'Nuevo Proyecto'}</h1>
              <p className="text-xs text-slate-400">Paso {currentStep} de 5</p>
            </div>
          </div>
          <div className="text-lime-400 font-mono text-sm font-bold">
            {progressPercent}%
          </div>
        </div>
        <div className="w-full h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
          <div 
            className="h-full bg-lime-400 transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </header>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto p-8 relative z-10 flex items-center justify-center">
        <form onSubmit={handleSubmit} className={`w-full ${currentStep === 5 ? 'max-w-5xl' : 'max-w-2xl'} transition-all duration-300 bg-[#13171e]/80 backdrop-blur-xl border border-white/[0.08] p-6 sm:p-10 rounded-3xl shadow-2xl`}>
          
          {hasDraftRestored && !editId && (
            <div className="mb-6 flex items-center justify-between p-3.5 rounded-2xl bg-lime-500/10 border border-lime-500/20 text-xs text-lime-400">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px]">history_edu</span>
                <span>Continuando borrador guardado (Paso {currentStep} de 5)</span>
              </div>
              <button
                type="button"
                onClick={handleDiscardDraft}
                className="text-slate-400 hover:text-white hover:underline text-[11px] font-semibold transition-colors"
              >
                Empezar de cero
              </button>
            </div>
          )}

          {currentStep === 1 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-white mb-2">Sobre ti y tu empresa</h2>
              <p className="text-sm text-slate-400 mb-8">Cuéntanos un poco sobre ti y el nombre de tu proyecto.</p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Nombre del Proyecto</label>
                  <input required name="project_name" placeholder="Ej: Rediseño App Móvil, Plataforma E-commerce..." value={formData.project_name} onChange={handleChange} className="w-full bg-[#0c0e12] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-lime-500 focus:outline-none focus:ring-1 focus:ring-lime-500 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Nombre completo</label>
                  <input required name="contact_name" value={formData.contact_name} onChange={handleChange} className="w-full bg-[#0c0e12] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-lime-500 focus:outline-none focus:ring-1 focus:ring-lime-500 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Empresa</label>
                  <input required name="company" value={formData.company} onChange={handleChange} className="w-full bg-[#0c0e12] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-lime-500 focus:outline-none focus:ring-1 focus:ring-lime-500 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Correo</label>
                  <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-[#0c0e12] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-lime-500 focus:outline-none focus:ring-1 focus:ring-lime-500 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Tu rol dentro del proyecto/empresa</label>
                  <input required name="role_in_company" placeholder="Ej: CEO, Líder técnico, Gerente de producto..." value={formData.role_in_company} onChange={handleChange} className="w-full bg-[#0c0e12] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-lime-500 focus:outline-none focus:ring-1 focus:ring-lime-500 transition-all" />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-white mb-2">El Problema</h2>
              <p className="text-sm text-slate-400 mb-8">En palabras sencillas, ¿cuál es el problema principal que necesitas resolver o la idea que quieres lanzar?</p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Descripción del problema/idea</label>
                  <textarea required name="main_problem" rows={4} value={formData.main_problem} onChange={handleChange} className="w-full bg-[#0c0e12] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-lime-500 focus:outline-none focus:ring-1 focus:ring-lime-500 transition-all resize-none"></textarea>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">¿Cómo lo resuelven actualmente?</label>
                  <textarea name="current_solution" rows={3} placeholder="Ej: Usamos Excel, procesos manuales..." value={formData.current_solution} onChange={handleChange} className="w-full bg-[#0c0e12] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-lime-500 focus:outline-none focus:ring-1 focus:ring-lime-500 transition-all resize-none"></textarea>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-white mb-2">Contexto del Proyecto</h2>
              <p className="text-sm text-slate-400 mb-8">¿En qué etapa se encuentra el proyecto actualmente?</p>
              
              <div className="space-y-6">
                <div className="grid gap-3">
                  {['Es solo una idea', 'Tenemos diseños/bocetos', 'Es un sistema existente que queremos mejorar'].map(stage => (
                    <label key={stage} className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${formData.project_stage === stage ? 'bg-lime-500/10 border-lime-500' : 'bg-[#0c0e12] border-white/[0.08] hover:border-white/20'}`}>
                      <input type="radio" name="project_stage" value={stage} checked={formData.project_stage === stage} onChange={handleChange} className="hidden" />
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 ${formData.project_stage === stage ? 'border-lime-500' : 'border-slate-500'}`}>
                        {formData.project_stage === stage && <div className="w-2.5 h-2.5 bg-lime-500 rounded-full"></div>}
                      </div>
                      <span className="text-sm font-medium text-slate-200">{stage}</span>
                    </label>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 mt-4">¿Tienen alguna fecha límite crítica o hito importante?</label>
                  <input required name="critical_deadline" placeholder="Ej: Lanzamiento en 3 meses, feria en noviembre..." value={formData.critical_deadline} onChange={handleChange} className="w-full bg-[#0c0e12] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-lime-500 focus:outline-none focus:ring-1 focus:ring-lime-500 transition-all" />
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-white mb-2">Metas y Presupuesto</h2>
              <p className="text-sm text-slate-400 mb-8">¿Qué define el éxito para este proyecto?</p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Criterio de éxito absoluto</label>
                  <textarea required name="success_criteria" rows={3} placeholder="Ej: Reducir tiempos de atención, no tener caídas..." value={formData.success_criteria} onChange={handleChange} className="w-full bg-[#0c0e12] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-lime-500 focus:outline-none focus:ring-1 focus:ring-lime-500 transition-all resize-none"></textarea>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3 mt-4">Rango de inversión estimado</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {['Menos de $1 Millón', 'Entre $1 y $10 millones', 'Más de $10 millones', 'Aún lo estamos definiendo'].map(range => (
                      <label key={range} className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${formData.investment_range === range ? 'bg-lime-500/10 border-lime-500' : 'bg-[#0c0e12] border-white/[0.08] hover:border-white/20'}`}>
                        <input type="radio" name="investment_range" value={range} checked={formData.investment_range === range} onChange={handleChange} className="hidden" />
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mr-3 shrink-0 ${formData.investment_range === range ? 'border-lime-500' : 'border-slate-500'}`}>
                          {formData.investment_range === range && <div className="w-2 h-2 bg-lime-500 rounded-full"></div>}
                        </div>
                        <span className="text-xs font-medium text-slate-200">{range}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-white mb-2">Reunión de Exploración</h2>
              <p className="text-sm text-slate-400 mb-6">Selecciona el día y la hora que mejor se adapten a tu disponibilidad para explorar tu proyecto.</p>

              {/* Inscripción informativa de reunión virtual */}
              <div className="mb-6 p-4 rounded-xl bg-lime-500/10 border border-lime-500/20 flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-lg bg-lime-500/20 text-lime-400 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-[20px]">videocam</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-lime-400 uppercase tracking-wider mb-1">
                    Primera Reunión Virtual
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Esta sesión se llevará a cabo de manera virtual. Toda la información necesaria y el enlace para conectarte te serán enviados a tu correo electrónico en un plazo máximo de 24 horas antes del encuentro.
                  </p>
                </div>
              </div>
              
              {/* Layout Calendario y Horarios Dinámicos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                
                {/* Columna Izquierda: Calendario Interactivo */}
                <div className="flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Selecciona el día
                    </label>
                    <span className="text-[11px] text-lime-400 font-medium flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">date_range</span>
                      Hasta 2 meses
                    </span>
                  </div>
                  <DatePickerCalendar 
                    value={formData.meeting_date || getTodayStr()} 
                    minDate={getTodayStr()}
                    maxDate={getMaxDateStr()}
                    onChange={(newDate) => {
                      fetchAvailableSlots(newDate);
                    }}
                  />
                </div>

                {/* Columna Derecha: Horarios Disponibles */}
                <div className="flex flex-col">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Horarios Disponibles
                  </label>

                  <div className="bg-[#0c0e12] border border-white/[0.08] rounded-2xl p-5 sm:p-6 flex-1 flex flex-col justify-between shadow-xl min-h-[380px]">
                    <div>
                      <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/[0.06]">
                        <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
                          <span className="material-symbols-outlined text-[16px] text-lime-400">schedule</span>
                          Turnos del día
                        </span>
                        {availableSlots.length > 0 && !loadingSlots && (
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-lime-500/10 text-lime-400 border border-lime-500/20">
                            {availableSlots.length} libre{availableSlots.length !== 1 ? 's' : ''}
                          </span>
                        )}
                      </div>

                      {loadingSlots ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-3">
                          <div className="w-8 h-8 border-3 border-lime-500/30 border-t-lime-500 rounded-full animate-spin"></div>
                          <p className="text-xs text-lime-400 animate-pulse font-medium">Buscando horarios...</p>
                        </div>
                      ) : availableSlots.length === 0 ? (
                        <div className="flex flex-col items-center justify-center text-center py-16 px-4">
                          <div className="w-12 h-12 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center text-slate-500 mb-3">
                            <span className="material-symbols-outlined text-[24px]">event_busy</span>
                          </div>
                          <p className="text-sm font-semibold text-slate-300 mb-1">Sin turnos disponibles</p>
                          <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                            No hay horarios libres para esta fecha. Por favor haz clic en otro día disponible del calendario.
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[320px] overflow-y-auto overflow-x-hidden pr-1.5">
                          {availableSlots.map(slot => (
                            <button
                              key={slot.time}
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, meeting_time: slot.time, meeting_admin_id: slot.admin_id }))}
                              className={`py-3 px-3 border rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap min-w-0 ${
                                formData.meeting_time === slot.time 
                                  ? 'bg-lime-400 text-black border-lime-400 shadow-[0_0_15px_rgba(163,230,53,0.35)] scale-[1.02]' 
                                  : 'bg-white/[0.03] text-white border-white/[0.08] hover:border-lime-500/40 hover:bg-lime-500/5 hover:text-lime-300'
                              }`}
                            >
                              <span className="material-symbols-outlined text-[15px] shrink-0">
                                {formData.meeting_time === slot.time ? 'check_circle' : 'schedule'}
                              </span>
                              <span>{slot.time}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {formData.meeting_time && (
                      <div className="mt-4 pt-3 border-t border-white/[0.06] text-xs text-slate-300 flex items-center justify-between">
                        <span className="text-slate-400">Hora elegida:</span>
                        <span className="font-bold text-lime-400 flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[15px]">alarm_on</span>
                          {formData.meeting_time}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Controls */}
          <div className="mt-10 flex items-center justify-between pt-6 border-t border-white/[0.08]">
            {currentStep > 1 ? (
              <button type="button" onClick={handlePrev} className="px-6 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white font-semibold text-sm transition-colors">
                Anterior
              </button>
            ) : <div></div>}

            <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-8 py-3 rounded-xl bg-lime-400 hover:bg-lime-300 text-black font-bold text-sm shadow-[0_0_20px_rgba(163,230,53,0.3)] transition-all disabled:opacity-70">
              {isSubmitting ? 'Guardando...' : (currentStep === 5 ? (editId ? 'Actualizar Proyecto' : 'Agendar y Solicitar') : 'Siguiente')}
              {currentStep < 5 && <span className="material-symbols-outlined text-[18px]">arrow_forward</span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
