import React, { useState } from 'react';
import { supabase } from '../../../supabase';
import { useToast } from '../../components/ui/Toast';

export function CreateProjectPage({ profile }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToast();

  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
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
    meeting_date: '',
    meeting_time: '',
    meeting_admin_id: null,
  });

  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const fetchAvailableSlots = async (dateStr) => {
    setLoadingSlots(true);
    setAvailableSlots([]);
    setFormData(prev => ({ ...prev, meeting_date: dateStr, meeting_time: '', meeting_admin_id: null }));

    try {
      const dayOfWeekMap = { 0: 7, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6 };
      const dateObj = new Date(dateStr + "T00:00:00");
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

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('edit');
    if (id) {
      setEditId(id);
      loadProject(id);
    } else {
      const savedDraft = localStorage.getItem('newProjectDraft');
      if (savedDraft) {
        try {
          const parsed = JSON.parse(savedDraft);
          if (parsed.formData) setFormData(parsed.formData);
          if (parsed.currentStep) setCurrentStep(parsed.currentStep);
        } catch (e) {
          console.error('Error loading draft', e);
        }
      }
    }
  }, []);

  React.useEffect(() => {
    if (!editId) {
      localStorage.setItem('newProjectDraft', JSON.stringify({ formData, currentStep }));
    }
  }, [formData, currentStep, editId]);

  const loadProject = async (id) => {
    try {
      const { data, error } = await supabase.from('project_requests').select('*').eq('id', id).single();
      if (error) throw error;
      if (data) {
        setFormData({
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
        <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-[#13171e]/80 backdrop-blur-xl border border-white/[0.08] p-10 rounded-3xl shadow-2xl">
          
          {currentStep === 1 && (
            <div className="animate-fade-in">
              <h2 className="text-2xl font-bold text-white mb-2">Sobre ti y tu empresa</h2>
              <p className="text-sm text-slate-400 mb-8">Cuéntanos un poco sobre ti para conocer el contexto.</p>
              
              <div className="space-y-6">
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
                    {['Menos de $10,000 USD', 'Entre $10k y $30k USD', 'Más de $30k USD', 'Aún lo estamos definiendo'].map(range => (
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
              <p className="text-sm text-slate-400 mb-8">Selecciona un día y hora para que hablemos sobre tu proyecto. Si prefieres no agendar aún, puedes omitir seleccionando la fecha de hoy sin hora.</p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Fecha</label>
                  <input 
                    type="date" 
                    min={new Date().toISOString().split('T')[0]} 
                    value={formData.meeting_date} 
                    onChange={(e) => fetchAvailableSlots(e.target.value)} 
                    className="w-full bg-[#0c0e12] border border-white/[0.08] rounded-xl px-4 py-3 text-white focus:border-lime-500 focus:outline-none focus:ring-1 focus:ring-lime-500 transition-all" 
                  />
                </div>

                {formData.meeting_date && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3 mt-4">Horarios disponibles</label>
                    {loadingSlots ? (
                      <p className="text-sm text-lime-400 animate-pulse">Buscando horarios...</p>
                    ) : availableSlots.length === 0 ? (
                      <p className="text-sm text-slate-400 bg-white/[0.02] p-4 rounded-xl border border-white/[0.05]">No hay horarios disponibles para esta fecha. Intenta con otra.</p>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {availableSlots.map(slot => (
                          <button
                            key={slot.time}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, meeting_time: slot.time, meeting_admin_id: slot.admin_id }))}
                            className={`p-3 border rounded-xl text-sm font-semibold transition-all ${
                              formData.meeting_time === slot.time 
                                ? 'bg-lime-500 text-black border-lime-500 shadow-[0_0_15px_rgba(148,214,0,0.3)]' 
                                : 'bg-[#0c0e12] text-white border-white/[0.08] hover:border-white/20 hover:bg-white/[0.02]'
                            }`}
                          >
                            {slot.time}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
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
