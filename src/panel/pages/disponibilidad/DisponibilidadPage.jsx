import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabase';

const DAYS = [
  { id: 1, name: 'Lunes', short: 'L' },
  { id: 2, name: 'Martes', short: 'M' },
  { id: 3, name: 'Miércoles', short: 'X' },
  { id: 4, name: 'Jueves', short: 'J' },
  { id: 5, name: 'Viernes', short: 'V' },
  { id: 6, name: 'Sábado', short: 'S' },
  { id: 7, name: 'Domingo', short: 'D' }
];

const DEFAULT_CUSTOM = DAYS.reduce((acc, day) => {
  acc[day.id] = { active: day.id <= 5, start: '09:00', end: '18:00' };
  return acc;
}, {});

export function DisponibilidadPage({ role }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const [scheduleType, setScheduleType] = useState('fixed');
  const [meetingType, setMeetingType] = useState('ambas');
  const [fixedDays, setFixedDays] = useState([1, 2, 3, 4, 5]);
  const [fixedTime, setFixedTime] = useState({ start: '09:00', end: '18:00' });
  const [customSchedule, setCustomSchedule] = useState(DEFAULT_CUSTOM);

  const isAdmin = role?.slug === 'administrador';

  useEffect(() => {
    if (isAdmin) {
      loadAvailability();
    } else {
      setError('No tienes permisos para ver esta sección.');
      setLoading(false);
    }
  }, [isAdmin]);

  const loadAvailability = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('admin_availability')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setScheduleType(data.schedule_type);
        if (data.schedule_data.meetingType) {
          setMeetingType(data.schedule_data.meetingType);
        }
        
        if (data.schedule_type === 'fixed') {
          setFixedDays(data.schedule_data.days || []);
          setFixedTime({
            start: data.schedule_data.start || '09:00',
            end: data.schedule_data.end || '18:00'
          });
          // Restore custom data just in case they switch back
          if (data.schedule_data.customBackup) {
            setCustomSchedule(data.schedule_data.customBackup);
          }
        } else {
          setCustomSchedule(data.schedule_data.days || DEFAULT_CUSTOM);
          // Restore fixed data
          if (data.schedule_data.fixedBackup) {
            setFixedDays(data.schedule_data.fixedBackup.days);
            setFixedTime(data.schedule_data.fixedBackup.time);
          }
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccessMsg('');
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No session active');

      let schedule_data = {};
      if (scheduleType === 'fixed') {
        schedule_data = {
          days: fixedDays,
          start: fixedTime.start,
          end: fixedTime.end,
          customBackup: customSchedule,
          meetingType
        };
      } else {
        schedule_data = {
          days: customSchedule,
          fixedBackup: { days: fixedDays, time: fixedTime },
          meetingType
        };
      }

      const payload = {
        user_id: session.user.id,
        schedule_type: scheduleType,
        schedule_data
      };

      const { error } = await supabase
        .from('admin_availability')
        .upsert(payload, { onConflict: 'user_id' });

      if (error) throw error;

      setSuccessMsg('¡Horario guardado correctamente!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleFixedDay = (dayId) => {
    if (fixedDays.includes(dayId)) {
      setFixedDays(fixedDays.filter(d => d !== dayId));
    } else {
      setFixedDays([...fixedDays, dayId].sort());
    }
  };

  const updateCustomDay = (dayId, field, value) => {
    setCustomSchedule(prev => ({
      ...prev,
      [dayId]: { ...prev[dayId], [field]: value }
    }));
  };

  if (!isAdmin) {
    return (
      <div className="p-8 text-center text-slate-400">
        Esta sección es exclusiva para administradores.
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0c0e12] overflow-y-auto">
      <header className="px-8 py-8 border-b border-white/[0.05] bg-[#0c0e12]/80 backdrop-blur-sm sticky top-0 z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Mi Disponibilidad</h1>
          <p className="text-sm text-slate-400 mt-1">
            Configura el horario en el que estás disponible para atender proyectos y reuniones.
          </p>
        </div>
        
        <button 
          onClick={handleSave}
          disabled={saving || loading}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-black text-sm font-bold shadow-[0_0_15px_rgba(148,214,0,0.2)] transition-all shrink-0 disabled:opacity-50"
        >
          {saving ? (
            <span className="material-symbols-outlined animate-spin text-[20px]">sync</span>
          ) : (
            <span className="material-symbols-outlined text-[20px]">save</span>
          )}
          {saving ? 'Guardando...' : 'Guardar Horario'}
        </button>
      </header>

      <div className="p-8 max-w-4xl mx-auto w-full">
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}
        
        {successMsg && (
          <div className="mb-6 p-4 bg-lime-500/10 border border-lime-500/20 rounded-xl text-lime-400 text-sm flex items-center gap-2 animate-fade-in">
            <span className="material-symbols-outlined">check_circle</span>
            {successMsg}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-lime-500/30 border-t-lime-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">

            {/* Meeting Type Selection */}
            <div className="bg-[#13171e] border border-white/[0.05] rounded-3xl p-8">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-lime-400">videocam</span>
                Tipo de Reuniones
              </h3>
              <p className="text-sm text-slate-400 mb-6">Selecciona cómo prefieres realizar tus reuniones en este horario.</p>
              
              <div className="flex flex-wrap gap-4">
                {['presencial', 'virtual', 'ambas'].map(type => (
                  <label key={type} className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all flex-1 min-w-[200px] ${meetingType === type ? 'bg-lime-500/10 border-lime-500' : 'bg-[#0c0e12] border-white/[0.08] hover:border-white/20'}`}>
                    <input type="radio" name="meetingType" value={type} checked={meetingType === type} onChange={(e) => setMeetingType(e.target.value)} className="hidden" />
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 ${meetingType === type ? 'border-lime-500' : 'border-slate-600'}`}>
                      {meetingType === type && <div className="w-2.5 h-2.5 bg-lime-500 rounded-full"></div>}
                    </div>
                    <span className="text-sm font-medium text-slate-200 capitalize">{type === 'ambas' ? 'Ambas (Presencial y Virtual)' : type}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Type Selection */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div 
                onClick={() => setScheduleType('fixed')}
                className={`p-6 rounded-2xl border cursor-pointer transition-all ${scheduleType === 'fixed' ? 'bg-lime-500/5 border-lime-500 shadow-[0_0_20px_rgba(163,230,53,0.1)]' : 'bg-[#13171e] border-white/[0.05] hover:border-white/20'}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${scheduleType === 'fixed' ? 'border-lime-500' : 'border-slate-600'}`}>
                    {scheduleType === 'fixed' && <div className="w-3 h-3 bg-lime-500 rounded-full"></div>}
                  </div>
                  <span className="material-symbols-outlined text-3xl text-slate-500 opacity-50">calendar_view_week</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Horario Regular</h3>
                <p className="text-sm text-slate-400">El mismo horario para todos los días que trabajes.</p>
              </div>

              <div 
                onClick={() => setScheduleType('custom')}
                className={`p-6 rounded-2xl border cursor-pointer transition-all ${scheduleType === 'custom' ? 'bg-lime-500/5 border-lime-500 shadow-[0_0_20px_rgba(163,230,53,0.1)]' : 'bg-[#13171e] border-white/[0.05] hover:border-white/20'}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${scheduleType === 'custom' ? 'border-lime-500' : 'border-slate-600'}`}>
                    {scheduleType === 'custom' && <div className="w-3 h-3 bg-lime-500 rounded-full"></div>}
                  </div>
                  <span className="material-symbols-outlined text-3xl text-slate-500 opacity-50">edit_calendar</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Horario Personalizado</h3>
                <p className="text-sm text-slate-400">Configura horas diferentes para cada día de la semana.</p>
              </div>
            </div>

            {/* Fixed Schedule UI */}
            {scheduleType === 'fixed' && (
              <div className="bg-[#13171e] border border-white/[0.05] rounded-3xl p-8 animate-fade-in">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-lime-400">event_available</span>
                  Configurar Días y Horas
                </h3>
                
                <div className="space-y-8">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-4">¿Qué días de la semana estás disponible?</label>
                    <div className="flex flex-wrap gap-3">
                      {DAYS.map(day => (
                        <button
                          key={day.id}
                          onClick={() => toggleFixedDay(day.id)}
                          className={`w-12 h-12 rounded-full font-bold text-sm transition-all flex items-center justify-center ${fixedDays.includes(day.id) ? 'bg-lime-400 text-black shadow-[0_0_15px_rgba(148,214,0,0.3)]' : 'bg-[#1a1f26] text-slate-400 hover:bg-[#232a33] hover:text-white border border-white/[0.05]'}`}
                        >
                          {day.short}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-4">¿En qué rango de horas?</label>
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col gap-2">
                        <span className="text-xs text-slate-500 uppercase font-semibold">Hora de inicio</span>
                        <input 
                          type="time" 
                          value={fixedTime.start} 
                          onChange={(e) => setFixedTime({...fixedTime, start: e.target.value})}
                          className="bg-[#0c0e12] border border-white/[0.1] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-lime-500 transition-colors"
                        />
                      </div>
                      <span className="mt-6 text-slate-500 font-medium">a</span>
                      <div className="flex flex-col gap-2">
                        <span className="text-xs text-slate-500 uppercase font-semibold">Hora de fin</span>
                        <input 
                          type="time" 
                          value={fixedTime.end} 
                          onChange={(e) => setFixedTime({...fixedTime, end: e.target.value})}
                          className="bg-[#0c0e12] border border-white/[0.1] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-lime-500 transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Custom Schedule UI */}
            {scheduleType === 'custom' && (
              <div className="bg-[#13171e] border border-white/[0.05] rounded-3xl p-8 animate-fade-in">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-lime-400">tune</span>
                  Día por Día
                </h3>
                
                <div className="divide-y divide-white/[0.05]">
                  {DAYS.map(day => {
                    const data = customSchedule[day.id] || DEFAULT_CUSTOM[day.id];
                    
                    return (
                      <div key={day.id} className="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={() => updateCustomDay(day.id, 'active', !data.active)}
                            className={`relative w-12 h-6 rounded-full transition-colors ${data.active ? 'bg-lime-400' : 'bg-slate-700'}`}
                          >
                            <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${data.active ? 'translate-x-6' : 'translate-x-0'}`}></div>
                          </button>
                          <span className={`w-24 font-semibold text-sm ${data.active ? 'text-white' : 'text-slate-500'}`}>{day.name}</span>
                        </div>

                        {data.active ? (
                          <div className="flex items-center gap-3">
                            <input 
                              type="time" 
                              value={data.start} 
                              onChange={(e) => updateCustomDay(day.id, 'start', e.target.value)}
                              className="bg-[#0c0e12] border border-white/[0.1] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-lime-500 transition-colors"
                            />
                            <span className="text-slate-500 text-sm">a</span>
                            <input 
                              type="time" 
                              value={data.end} 
                              onChange={(e) => updateCustomDay(day.id, 'end', e.target.value)}
                              className="bg-[#0c0e12] border border-white/[0.1] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-lime-500 transition-colors"
                            />
                          </div>
                        ) : (
                          <div className="text-sm text-slate-600 italic sm:w-[210px] text-right">No disponible</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}
