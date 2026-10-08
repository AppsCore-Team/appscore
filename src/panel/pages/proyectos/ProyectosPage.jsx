import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabase';

export function ProyectosPage({ role }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  const isAdmin = role?.slug === 'administrador';

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('project_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenProject = async (project) => {
    let updatedProject = { ...project };
    // Cambiar a "En revision" si el admin lo abre y estaba en Pendiente
    if (isAdmin && project.status === 'Pendiente') {
      try {
        const { error } = await supabase.from('project_requests').update({ status: 'En revision' }).eq('id', project.id);
        if (!error) {
          updatedProject.status = 'En revision';
          setProjects(prev => prev.map(p => p.id === project.id ? updatedProject : p));
        }
      } catch (err) {
        console.error(err);
      }
    }
    setSelectedProject(updatedProject);
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const { error } = await supabase.from('project_requests').update({ status: newStatus }).eq('id', selectedProject.id);
      if (error) throw error;
      const updated = { ...selectedProject, status: newStatus };
      setSelectedProject(updated);
      setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadge = (status) => {
    switch(status?.toLowerCase()) {
      case 'pendiente':
        return <span className="px-2.5 py-1 rounded-md bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 text-xs font-semibold">Pendiente</span>;
      case 'en revision':
      case 'en revisión':
        return <span className="px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-semibold">En revisión</span>;
      case 'en progreso':
        return <span className="px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold">En progreso</span>;
      case 'completado':
        return <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">Completado</span>;
      default:
        return <span className="px-2.5 py-1 rounded-md bg-slate-500/10 text-slate-400 border border-slate-500/20 text-xs font-semibold">{status || 'Pendiente'}</span>;
    }
  };

  if (selectedProject) {
    return (
      <div className="flex-1 flex flex-col h-full bg-[#0c0e12] overflow-hidden">
        <header className="px-8 py-6 border-b border-white/[0.05] bg-[#0c0e12]/80 backdrop-blur-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setSelectedProject(null)} className="w-10 h-10 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center transition-colors">
              <span className="material-symbols-outlined text-slate-400">arrow_back</span>
            </button>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Detalles del Proyecto</h1>
              <p className="text-xs text-slate-400">Solicitado el {new Date(selectedProject.created_at).toLocaleDateString()}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {isAdmin ? (
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-slate-400">Estado:</span>
                <select 
                  value={selectedProject.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="bg-[#15181e] border border-white/[0.08] text-sm text-white rounded-lg px-3 py-2 focus:outline-none focus:border-lime-500"
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="En revision">En revisión</option>
                  <option value="En progreso">En progreso</option>
                  <option value="Completado">Completado</option>
                </select>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                {getStatusBadge(selectedProject.status)}
                {selectedProject.status === 'Pendiente' && (
                  <button 
                    onClick={() => window.location.href = '/panel/nuevo-proyecto?edit=' + selectedProject.id}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-white text-xs font-semibold transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">edit</span>
                    Editar solicitud
                  </button>
                )}
              </div>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-3xl mx-auto space-y-6">
            
            <div className="bg-[#13171e] border border-white/[0.05] rounded-2xl p-6">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Información del Cliente</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Nombre</p>
                  <p className="text-sm text-white font-medium">{selectedProject.contact_name}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Empresa</p>
                  <p className="text-sm text-white font-medium">{selectedProject.company}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Correo</p>
                  <p className="text-sm text-lime-400 font-medium">{selectedProject.email}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Rol</p>
                  <p className="text-sm text-white font-medium">{selectedProject.role_in_company}</p>
                </div>
              </div>
            </div>

            <div className="bg-[#13171e] border border-white/[0.05] rounded-2xl p-6">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">El Problema y la Solución Actual</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">Problema Principal</p>
                  <div className="p-4 bg-[#0c0e12] rounded-xl text-sm text-slate-300 leading-relaxed border border-white/[0.03]">
                    {selectedProject.main_problem}
                  </div>
                </div>
                {selectedProject.current_solution && (
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">¿Cómo lo resuelven actualmente?</p>
                    <div className="p-4 bg-[#0c0e12] rounded-xl text-sm text-slate-300 leading-relaxed border border-white/[0.03]">
                      {selectedProject.current_solution}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-[#13171e] border border-white/[0.05] rounded-2xl p-6">
                <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Contexto</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Etapa del proyecto</p>
                    <p className="text-sm text-white font-medium">{selectedProject.project_stage}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Fecha límite crítica</p>
                    <p className="text-sm text-white font-medium">{selectedProject.critical_deadline}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Presupuesto estimado</p>
                    <p className="text-sm text-lime-400 font-bold">{selectedProject.investment_range}</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#13171e] border border-white/[0.05] rounded-2xl p-6">
                <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Metas de Éxito</h2>
                <div className="p-4 bg-[#0c0e12] rounded-xl text-sm text-slate-300 leading-relaxed border border-white/[0.03] h-[calc(100%-2rem)]">
                  {selectedProject.success_criteria}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0c0e12] overflow-hidden">
      {/* Header */}
      <header className="px-8 py-6 border-b border-white/[0.05] bg-[#0c0e12]/80 backdrop-blur-sm sticky top-0 z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Proyectos</h1>
          <p className="text-sm text-slate-400">
            {isAdmin ? 'Gestión de proyectos solicitados por los clientes.' : 'Aquí puedes ver el estado de los proyectos que has solicitado.'}
          </p>
        </div>
        
        <button 
          onClick={() => window.location.href = '/panel/nuevo-proyecto'}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-black text-sm font-bold shadow-[0_0_15px_rgba(148,214,0,0.2)] transition-all shrink-0"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          Crear Nuevo Proyecto
        </button>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-lime-500/30 border-t-lime-500 rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
            Error cargando proyectos: {error}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 border border-white/[0.05] rounded-3xl bg-[#13171e]/50 border-dashed">
            <span className="material-symbols-outlined text-6xl text-slate-700 mb-4">folder_open</span>
            <h3 className="text-xl font-bold text-white mb-2">No hay proyectos</h3>
            <p className="text-sm text-slate-400 mb-6 max-w-md mx-auto">
              Aún no tienes ningún proyecto solicitado. Da el primer paso y cuéntanos tu idea.
            </p>
            <button 
              onClick={() => window.location.href = '/panel/nuevo-proyecto'}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white text-sm font-bold border border-white/[0.1] transition-all"
            >
              Crear mi primer proyecto
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {projects.map(project => (
              <div key={project.id} className="bg-[#13171e] border border-white/[0.05] hover:border-lime-500/30 rounded-2xl p-6 transition-colors flex flex-col md:flex-row gap-6 md:items-center cursor-pointer" onClick={() => handleOpenProject(project)}>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusBadge(project.status)}
                    <span className="text-xs text-slate-500 font-mono">{new Date(project.created_at).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">
                    {project.main_problem}
                  </h3>
                  {isAdmin && (
                    <p className="text-xs text-lime-400 font-medium">
                      Cliente: {project.contact_name} ({project.company})
                    </p>
                  )}
                  <p className="text-sm text-slate-400 line-clamp-2 mt-2">
                    <span className="font-semibold text-slate-300">Etapa:</span> {project.project_stage}
                  </p>
                </div>
                
                <div className="flex items-center gap-3 md:border-l border-white/[0.05] md:pl-6">
                  <div className="text-right hidden sm:block">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-1">Presupuesto estimado</p>
                    <p className="text-sm text-slate-300 font-medium">{project.investment_range}</p>
                  </div>
                  <button className="w-10 h-10 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
