import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabase';

export function CitasPage({ profile, role }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter state for Admin
  const [selectedAdminFilter, setSelectedAdminFilter] = useState('');

  const isAdmin = role?.slug === 'administrador';

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      // Usamos la función RPC segura definida en la migración
      const { data, error } = await supabase.rpc('get_appointments');
      if (error) throw error;
      setAppointments(data || []);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Obtener la lista de administradores únicos para el filtro
  const uniqueAdmins = Array.from(new Set(appointments.map(a => a.admin_name))).filter(Boolean);

  const filteredAppointments = appointments.filter(app => {
    if (isAdmin && selectedAdminFilter && app.admin_name !== selectedAdminFilter) {
      return false;
    }
    return true;
  });

  // Dividir en Próximas y Pasadas
  const now = new Date();
  const upcoming = [];
  const past = [];

  filteredAppointments.forEach(app => {
    const appDate = new Date(`${app.meeting_date}T${app.meeting_time}`);
    if (appDate >= now) {
      upcoming.push(app);
    } else {
      past.push(app);
    }
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0c0e12] overflow-hidden">
      <header className="px-8 py-6 border-b border-white/[0.05] bg-[#0c0e12]/80 backdrop-blur-sm sticky top-0 z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Citas y Reuniones</h1>
          <p className="text-sm text-slate-400">
            {isAdmin ? 'Gestión de todas las citas agendadas de la empresa.' : 'Visualiza y gestiona tus citas programadas.'}
          </p>
        </div>
        
        {isAdmin && uniqueAdmins.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-400 font-semibold">Filtrar por Admin:</span>
            <select 
              value={selectedAdminFilter}
              onChange={(e) => setSelectedAdminFilter(e.target.value)}
              className="bg-[#15181e] border border-white/[0.08] text-sm text-white rounded-lg px-3 py-2 focus:outline-none focus:border-lime-500"
            >
              <option value="">Todos los administradores</option>
              {uniqueAdmins.map(adminName => (
                <option key={adminName} value={adminName}>{adminName}</option>
              ))}
            </select>
          </div>
        )}
      </header>

      <div className="flex-1 overflow-y-auto p-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-lime-500/30 border-t-lime-500 rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
            Error cargando las citas: {error}
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-20 border border-white/[0.05] rounded-3xl bg-[#13171e]/50 border-dashed">
            <span className="material-symbols-outlined text-6xl text-slate-700 mb-4">event_busy</span>
            <h3 className="text-xl font-bold text-white mb-2">No hay citas agendadas</h3>
            <p className="text-sm text-slate-400 mb-6 max-w-md mx-auto">
              Aún no hay reuniones programadas en el calendario.
            </p>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto space-y-10">
            {upcoming.length > 0 && (
              <section>
                <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-lime-500 animate-pulse"></span>
                  Próximas Citas
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {upcoming.map(app => (
                    <AppointmentCard key={app.project_id} app={app} isAdmin={isAdmin} isPast={false} />
                  ))}
                </div>
              </section>
            )}

            {past.length > 0 && (
              <section>
                <h2 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-600"></span>
                  Historial de Citas Pasadas
                </h2>
                <div className="grid gap-4 md:grid-cols-2 opacity-70">
                  {past.map(app => (
                    <AppointmentCard key={app.project_id} app={app} isAdmin={isAdmin} isPast={true} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function AppointmentCard({ app, isAdmin, isPast }) {
  const dateObj = new Date(`${app.meeting_date}T00:00:00`);
  const dayName = dateObj.toLocaleDateString(undefined, { weekday: 'long' });
  const dayNum = dateObj.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
  const year = dateObj.getFullYear();

  return (
    <div className={`border rounded-2xl p-5 flex flex-col gap-4 transition-all ${isPast ? 'bg-[#101318] border-white/[0.03]' : 'bg-[#13171e] border-white/[0.08] hover:border-lime-500/30'}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center shrink-0 ${isPast ? 'bg-white/[0.02] text-slate-500' : 'bg-lime-500/10 text-lime-400'}`}>
            <span className="text-xs font-bold uppercase">{dayName.substring(0,3)}</span>
            <span className="text-lg font-black leading-none">{dateObj.getDate()}</span>
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">{app.meeting_time}</h3>
            <p className="text-xs text-slate-400 capitalize">{dayName}, {dayNum} {year}</p>
          </div>
        </div>
        <div className="shrink-0">
          <span className="px-2.5 py-1 rounded-md bg-white/[0.04] text-slate-400 border border-white/[0.1] text-[10px] font-semibold uppercase tracking-wider">
            Proyecto: {app.project_status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-2 pt-4 border-t border-white/[0.04]">
        {isAdmin ? (
          <>
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Cliente</p>
              <p className="text-sm text-slate-200 font-medium truncate">{app.client_name || 'Desconocido'}</p>
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Atendido por</p>
              <p className="text-sm text-lime-400 font-medium truncate">{app.admin_name || 'Desconocido'}</p>
            </div>
          </>
        ) : (
          <div className="col-span-2">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Tu Asesor Asignado</p>
            <p className="text-sm text-lime-400 font-medium truncate flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">support_agent</span>
              {app.admin_name || 'Pendiente'}
            </p>
          </div>
        )}
      </div>

      <button 
        onClick={() => window.location.href = `/panel/proyectos?open=${app.project_id}`}
        className="mt-2 w-full py-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.05] text-white text-xs font-bold transition-all"
      >
        Ver detalles del proyecto
      </button>
    </div>
  );
}
