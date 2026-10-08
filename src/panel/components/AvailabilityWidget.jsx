import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase';

const DAYS = [
  { id: 1, name: 'Lunes', short: 'L' },
  { id: 2, name: 'Martes', short: 'M' },
  { id: 3, name: 'Miércoles', short: 'X' },
  { id: 4, name: 'Jueves', short: 'J' },
  { id: 5, name: 'Viernes', short: 'V' },
  { id: 6, name: 'Sábado', short: 'S' },
  { id: 7, name: 'Domingo', short: 'D' }
];

export function AvailabilityWidget() {
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { data, error } = await supabase
          .from('admin_availability')
          .select('*')
          .eq('user_id', session.user.id)
          .maybeSingle();
        
        if (!error && data) {
          setAvailability(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAvailability();
  }, []);

  if (loading) {
    return (
      <div className="bg-[#13171e] rounded-2xl border border-white/[0.05] p-5 animate-pulse flex flex-col gap-3">
        <div className="h-4 bg-white/5 rounded w-1/3"></div>
        <div className="h-10 bg-white/5 rounded w-full"></div>
      </div>
    );
  }

  const getMeetingTypeLabel = (type) => {
    if (type === 'virtual') return { label: 'Virtual', icon: 'videocam' };
    if (type === 'presencial') return { label: 'Presencial', icon: 'storefront' };
    return { label: 'Virtual y Presencial', icon: 'handshake' };
  };

  const renderSchedule = () => {
    if (!availability) {
      return (
        <div className="text-center py-4">
          <p className="text-xs text-slate-400 mb-3">No has configurado tu horario.</p>
          <button 
            onClick={() => window.location.href = '/panel/disponibilidad'}
            className="text-xs font-semibold text-lime-400 hover:underline"
          >
            Configurar ahora
          </button>
        </div>
      );
    }

    const { schedule_type, schedule_data } = availability;
    const meetingType = schedule_data.meetingType || 'ambas';
    const typeInfo = getMeetingTypeLabel(meetingType);

    if (schedule_type === 'fixed') {
      const activeDays = schedule_data.days || [];
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2 text-xs font-medium text-slate-300 bg-white/[0.02] p-2 rounded-lg border border-white/[0.05]">
            <span className="material-symbols-outlined text-[16px] text-lime-400">{typeInfo.icon}</span>
            {typeInfo.label}
          </div>
          
          <div className="flex flex-wrap gap-1.5 justify-center">
            {DAYS.map(d => (
              <div 
                key={d.id} 
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ${activeDays.includes(d.id) ? 'bg-lime-500/20 text-lime-400 border border-lime-500/30' : 'text-slate-600 bg-black/20'}`}
              >
                {d.short}
              </div>
            ))}
          </div>
          <div className="text-center text-sm font-semibold text-white bg-[#0c0e12] py-2 rounded-xl border border-white/[0.05]">
            {schedule_data.start} - {schedule_data.end}
          </div>
        </div>
      );
    }

    // Custom
    const activeDaysList = DAYS.filter(d => schedule_data.days && schedule_data.days[d.id]?.active);
    
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 mb-2 text-xs font-medium text-slate-300 bg-white/[0.02] p-2 rounded-lg border border-white/[0.05]">
          <span className="material-symbols-outlined text-[16px] text-lime-400">{typeInfo.icon}</span>
          {typeInfo.label}
        </div>

        {activeDaysList.length === 0 ? (
          <p className="text-xs text-slate-500 text-center">Sin días activos</p>
        ) : (
          <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto pr-1 custom-scrollbar">
            {activeDaysList.map(d => {
              const dayData = schedule_data.days[d.id];
              return (
                <div key={d.id} className="flex items-center justify-between bg-[#0c0e12] px-3 py-2 rounded-lg border border-white/[0.02]">
                  <span className="text-xs font-medium text-slate-300">{d.name}</span>
                  <span className="text-xs font-mono text-lime-400">{dayData.start} - {dayData.end}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-[#13171e] rounded-3xl border border-white/[0.06] p-5 shadow-lg flex flex-col gap-4 relative overflow-hidden">
      <div className="flex items-center justify-between z-10">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <span className="material-symbols-outlined text-lime-400 text-[18px]">schedule</span>
          Tu Semana
        </h3>
        {availability && (
          <button 
            onClick={() => window.location.href = '/panel/disponibilidad'}
            className="w-7 h-7 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] flex items-center justify-center transition-colors"
            title="Editar horario"
          >
            <span className="material-symbols-outlined text-[14px] text-slate-400">edit</span>
          </button>
        )}
      </div>

      <div className="z-10">
        {renderSchedule()}
      </div>
      
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-lime-500/5 rounded-full blur-2xl pointer-events-none"></div>
    </div>
  );
}
