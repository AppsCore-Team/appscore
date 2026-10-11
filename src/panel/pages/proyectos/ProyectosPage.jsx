import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabase';
import { useToast } from '../../components/ui/Toast';

export function ProyectosPage({ profile, role }) {
  const { addToast } = useToast();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [clientAppointments, setClientAppointments] = useState([]);

  // Tabs: 'detalles' | 'documentos' | 'tickets'
  const [activeTab, setActiveTab] = useState('detalles');

  // Internal Notes Drawer
  const [showNotesDrawer, setShowNotesDrawer] = useState(false);
  const [notes, setNotes] = useState([]);
  const [notesLoading, setNotesLoading] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [submittingNote, setSubmittingNote] = useState(false);

  // Documents state
  const [documents, setDocuments] = useState([]);
  const [docsLoading, setDocsLoading] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [isDraggingDoc, setIsDraggingDoc] = useState(false);
  const docFileInputRef = React.useRef(null);

  // Project Tickets state
  const [projectTickets, setProjectTickets] = useState([]);
  const [ticketsLoading, setTicketsLoading] = useState(false);

  const isAdmin = role?.slug === 'administrador' || role?.slug === 'desarrollador';

  const PROJECT_STATUSES = [
    'En espera reunión',
    'Realizando cotización',
    'En espera respuesta cotización',
    'En planeación',
    'En Desarrollo',
    'En Espera Producción',
    'Proyecto Finalizado',
  ];

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

      // Auto-open project if specified in URL query
      const params = new URLSearchParams(window.location.search);
      const openId = params.get('open');
      if (openId && data) {
        const p = data.find(proj => proj.id === openId);
        if (p) {
          handleOpenProject(p);
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenProject = async (project) => {
    let updatedProject = { ...project };

    // Auto-advance status if admin opens a brand new request
    if (isAdmin && (project.status === 'Pendiente' || project.status === 'En espera reunión')) {
      // Keep or update as needed
    }

    try {
      const { data, error } = await supabase.rpc('get_appointments');
      if (!error && data) {
        setClientAppointments(data.filter(app => app.client_id === project.user_id));
      }
    } catch (err) {
      console.error(err);
    }

    setSelectedProject(updatedProject);
    setActiveTab('detalles');

    // Fetch related docs, tickets and notes
    fetchDocuments(project.id);
    fetchProjectTickets(project.id);
    if (isAdmin) {
      fetchNotes(project.id);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const { error } = await supabase.from('project_requests').update({ status: newStatus }).eq('id', selectedProject.id);
      if (error) throw error;
      const updated = { ...selectedProject, status: newStatus };
      setSelectedProject(updated);
      setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
      addToast(`Estado cambiado a "${newStatus}"`, 'success');
    } catch (err) {
      console.error(err);
      addToast('Error al actualizar estado: ' + err.message, 'error');
    }
  };

  // --- Internal Notes Handlers ---
  const fetchNotes = async (projectId) => {
    setNotesLoading(true);
    try {
      const { data, error } = await supabase
        .from('project_internal_notes')
        .select('*, profiles(full_name)')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setNotes(data || []);
    } catch (err) {
      console.error('Error fetching internal notes:', err);
    } finally {
      setNotesLoading(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;
    setSubmittingNote(true);
    try {
      const { data, error } = await supabase
        .from('project_internal_notes')
        .insert({
          project_id: selectedProject.id,
          admin_id: profile?.id,
          content: newNoteContent.trim(),
        })
        .select('*, profiles(full_name)')
        .single();
      if (error) throw error;
      setNotes(prev => [data, ...prev]);
      setNewNoteContent('');
      addToast('Nota agregada exitosamente', 'success');
    } catch (err) {
      addToast('Error al guardar nota: ' + err.message, 'error');
    } finally {
      setSubmittingNote(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      const { error } = await supabase
        .from('project_internal_notes')
        .delete()
        .eq('id', noteId);
      if (error) throw error;
      setNotes(prev => prev.filter(n => n.id !== noteId));
      addToast('Nota eliminada', 'success');
    } catch (err) {
      addToast('Error al eliminar nota: ' + err.message, 'error');
    }
  };

  // --- Documents Handlers ---
  const fetchDocuments = async (projectId) => {
    setDocsLoading(true);
    try {
      const { data, error } = await supabase
        .from('project_documents')
        .select('*, profiles(full_name)')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setDocuments(data || []);
    } catch (err) {
      console.error('Error loading documents:', err);
    } finally {
      setDocsLoading(false);
    }
  };

  const handleUploadFiles = async (filesList) => {
    if (!filesList || filesList.length === 0) return;
    const files = Array.from(filesList);
    setUploadingDoc(true);

    let successCount = 0;
    try {
      for (const file of files) {
        const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        const storagePath = `${selectedProject.id}/${Date.now()}_${cleanFileName}`;

        const { error: uploadError } = await supabase.storage
          .from('project-files')
          .upload(storagePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error(`Error al subir ${file.name}:`, uploadError);
          continue;
        }

        const { data: docData, error: dbError } = await supabase
          .from('project_documents')
          .insert({
            project_id: selectedProject.id,
            uploaded_by: profile?.id,
            file_name: file.name,
            file_path: storagePath,
            file_type: file.type || file.name.split('.').pop(),
            file_size: file.size,
          })
          .select('*, profiles(full_name)')
          .single();

        if (dbError) {
          console.error(`Error guardando registro de ${file.name}:`, dbError);
          continue;
        }

        setDocuments(prev => [docData, ...prev]);
        successCount++;
      }

      if (successCount === 1) {
        addToast('Documento subido correctamente', 'success');
      } else if (successCount > 1) {
        addToast(`${successCount} documentos subidos correctamente`, 'success');
      } else {
        addToast('No se pudo subir ningún archivo', 'error');
      }
    } catch (err) {
      addToast('Error al subir archivos: ' + err.message, 'error');
    } finally {
      setUploadingDoc(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDraggingDoc) setIsDraggingDoc(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget)) return;
    setIsDraggingDoc(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingDoc(false);
    if (!isAdmin) return;
    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      handleUploadFiles(e.dataTransfer.files);
    }
  };

  const handleDownloadDoc = async (doc) => {
    try {
      const { data, error } = await supabase.storage
        .from('project-files')
        .createSignedUrl(doc.file_path, 60, { download: doc.file_name });
      if (error) throw error;
      if (data?.signedUrl) {
        const link = document.createElement('a');
        link.href = data.signedUrl;
        link.download = doc.file_name;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      addToast('Error al descargar documento: ' + err.message, 'error');
    }
  };

  const handlePreviewDoc = async (doc) => {
    try {
      const { data, error } = await supabase.storage
        .from('project-files')
        .createSignedUrl(doc.file_path, 300);
      if (error) throw error;
      if (data?.signedUrl) {
        setPreviewDoc({ ...doc, signedUrl: data.signedUrl });
      }
    } catch (err) {
      addToast('Error al generar vista previa: ' + err.message, 'error');
    }
  };

  const handleDeleteDoc = async (doc) => {
    if (!confirm(`¿Estás seguro de eliminar el documento "${doc.file_name}"?`)) return;
    try {
      await supabase.storage.from('project-files').remove([doc.file_path]);
      const { error } = await supabase.from('project_documents').delete().eq('id', doc.id);
      if (error) throw error;
      setDocuments(prev => prev.filter(d => d.id !== doc.id));
      addToast('Documento eliminado', 'success');
    } catch (err) {
      addToast('Error al eliminar: ' + err.message, 'error');
    }
  };

  // --- Tickets Handlers ---
  const fetchProjectTickets = async (projectId) => {
    setTicketsLoading(true);
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select('*, assignee:profiles!tickets_assigned_to_fkey(full_name)')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setProjectTickets(data || []);
    } catch (err) {
      console.error('Error fetching project tickets:', err);
    } finally {
      setTicketsLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getDocIcon = (fileName = '') => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (['pdf'].includes(ext)) return 'picture_as_pdf';
    if (['jpg', 'jpeg', 'png', 'svg', 'webp', 'gif'].includes(ext)) return 'image';
    if (['doc', 'docx'].includes(ext)) return 'description';
    if (['xls', 'xlsx', 'csv'].includes(ext)) return 'table_view';
    if (['zip', 'rar', '7z'].includes(ext)) return 'folder_zip';
    return 'draft';
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'En espera reunión':
      case 'Pendiente':
        return <span className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold">En espera reunión</span>;
      case 'Realizando cotización':
      case 'En revision':
      case 'En revisión':
        return <span className="px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold">Realizando cotización</span>;
      case 'En espera respuesta cotización':
        return <span className="px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-semibold">En espera respuesta cotización</span>;
      case 'En planeación':
        return <span className="px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold">En planeación</span>;
      case 'En Desarrollo':
      case 'En progreso':
        return <span className="px-2.5 py-1 rounded-md bg-lime-500/10 text-lime-400 border border-lime-500/20 text-xs font-semibold">En Desarrollo</span>;
      case 'En Espera Producción':
        return <span className="px-2.5 py-1 rounded-md bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs font-semibold">En Espera Producción</span>;
      case 'Proyecto Finalizado':
      case 'Completado':
      case 'Desplegado':
        return <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">Proyecto Finalizado</span>;
      default:
        return <span className="px-2.5 py-1 rounded-md bg-slate-500/10 text-slate-400 border border-slate-500/20 text-xs font-semibold">{status || 'En espera reunión'}</span>;
    }
  };

  if (selectedProject) {
    return (
      <div className="flex-1 flex flex-col h-full bg-[#0c0e12] overflow-hidden relative">
        {/* Detail Header */}
        <header className="px-8 py-5 border-b border-white/[0.05] bg-[#0c0e12]/80 backdrop-blur-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSelectedProject(null)} 
                className="w-10 h-10 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center transition-colors"
                title="Volver a la lista"
              >
                <span className="material-symbols-outlined text-slate-400">arrow_back</span>
              </button>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  {selectedProject.project_name || 'Proyecto sin nombre'}
                </h1>
                <p className="text-xs text-slate-400">
                  Solicitado el {new Date(selectedProject.created_at).toLocaleDateString()}
                  {selectedProject.company && ` · ${selectedProject.company}`}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {isAdmin && (
                <button
                  onClick={() => setShowNotesDrawer(true)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-300 text-xs font-semibold transition-colors shadow-sm"
                  title="Notas internas para administradores"
                >
                  <span className="material-symbols-outlined text-[18px]">sticky_note_2</span>
                  <span>Notas internas</span>
                  {notes.length > 0 && (
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-black text-[10px] font-bold flex items-center justify-center">
                      {notes.length}
                    </span>
                  )}
                </button>
              )}

              {isAdmin ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-400 hidden sm:inline">Estado:</span>
                  <select 
                    value={selectedProject.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="bg-[#15181e] border border-white/[0.08] text-xs font-medium text-white rounded-xl px-3 py-2 focus:outline-none focus:border-lime-500"
                  >
                    {PROJECT_STATUSES.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  {getStatusBadge(selectedProject.status)}
                  {selectedProject.status === 'En espera reunión' && (
                    <button 
                      onClick={() => window.location.href = '/panel/nuevo-proyecto?edit=' + selectedProject.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-white text-xs font-semibold transition-colors"
                    >
                      <span className="material-symbols-outlined text-[15px]">edit</span>
                      Editar
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 pt-1 border-t border-white/[0.04]">
            <button
              onClick={() => setActiveTab('detalles')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'detalles'
                  ? 'bg-lime-500/15 text-lime-400 border border-lime-500/25 shadow-[0_0_15px_rgba(148,214,0,0.1)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <span className="material-symbols-outlined text-[17px]">info</span>
              Detalles
            </button>

            <button
              onClick={() => setActiveTab('documentos')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'documentos'
                  ? 'bg-lime-500/15 text-lime-400 border border-lime-500/25 shadow-[0_0_15px_rgba(148,214,0,0.1)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <span className="material-symbols-outlined text-[17px]">folder</span>
              Documentos
              {documents.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-white/[0.08] text-[10px] text-slate-300">
                  {documents.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('tickets')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'tickets'
                  ? 'bg-lime-500/15 text-lime-400 border border-lime-500/25 shadow-[0_0_15px_rgba(148,214,0,0.1)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <span className="material-symbols-outlined text-[17px]">confirmation_number</span>
              Tickets de Soporte
              {projectTickets.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-white/[0.08] text-[10px] text-slate-300">
                  {projectTickets.length}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto space-y-6">

            {/* TAB 1: DETALLES */}
            {activeTab === 'detalles' && (
              <>
                {selectedProject.meeting_date && (
                  <div className="bg-lime-500/10 border border-lime-500/20 rounded-2xl p-6 flex items-center justify-between">
                    <div>
                      <h2 className="text-xs font-bold text-lime-500 uppercase tracking-wider mb-1">Reunión de Exploración Agendada</h2>
                      <p className="text-sm text-white font-medium mb-1">
                        {new Date(selectedProject.meeting_date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} a las {selectedProject.meeting_time}
                      </p>
                      {clientAppointments.find(app => app.project_id === selectedProject.id)?.admin_name && (
                        <p className="text-[10px] text-lime-500/80 uppercase font-semibold">
                          Atendida por: {clientAppointments.find(app => app.project_id === selectedProject.id).admin_name}
                        </p>
                      )}
                    </div>
                    <div className="w-12 h-12 rounded-full bg-lime-500/20 flex items-center justify-center">
                      <span className="material-symbols-outlined text-lime-400 text-[24px]">event_available</span>
                    </div>
                  </div>
                )}

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

                {/* Historial de Citas del Proyecto */}
                {clientAppointments.filter(app => app.project_id === selectedProject.id).length > 0 && (
                  <div className="bg-[#13171e] border border-white/[0.05] rounded-2xl p-6">
                    <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center justify-between">
                      <span>Historial de Citas del Proyecto</span>
                      <span className="px-2 py-0.5 rounded-full bg-white/[0.05] text-[10px]">
                        {clientAppointments.filter(app => app.project_id === selectedProject.id).length} citas
                      </span>
                    </h2>
                    <div className="space-y-3">
                      {clientAppointments.filter(app => app.project_id === selectedProject.id).map((app, index) => {
                        const dateObj = new Date(`${app.meeting_date}T00:00:00`);
                        const isPast = new Date(`${app.meeting_date}T${app.meeting_time}`) < new Date();
                        return (
                          <div key={`${app.project_id}-${index}`} className={`p-4 rounded-xl border flex items-center justify-between ${isPast ? 'bg-[#0c0e12] border-white/[0.02] opacity-70' : 'bg-[#15181e] border-white/[0.05]'}`}>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <p className="text-sm text-white font-bold">{app.meeting_time}</p>
                                {!isPast && (
                                  <span className="px-1.5 py-0.5 rounded bg-lime-500/20 text-lime-400 text-[9px] uppercase font-bold tracking-wider">Próxima</span>
                                )}
                              </div>
                              <p className="text-[10px] text-slate-400 capitalize">{dateObj.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Asesor</p>
                              <p className="text-xs text-lime-400 font-medium">{app.admin_name || 'Pendiente'}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

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
              </>
            )}

            {/* TAB 2: DOCUMENTOS */}
            {activeTab === 'documentos' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-white tracking-tight">Documentación del Proyecto</h2>
                    <p className="text-xs text-slate-400">
                      Cotizaciones, propuestas comerciales, facturas y archivos relevantes del proyecto.
                    </p>
                  </div>

                  {isAdmin && (
                    <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-black text-xs font-bold cursor-pointer transition-all shadow-[0_0_15px_rgba(148,214,0,0.2)]">
                      <span className="material-symbols-outlined text-[18px]">upload_file</span>
                      <span>{uploadingDoc ? 'Subiendo...' : 'Subir Documentos'}</span>
                      <input 
                        type="file" 
                        multiple
                        disabled={uploadingDoc}
                        onChange={(e) => {
                          handleUploadFiles(e.target.files);
                          e.target.value = '';
                        }} 
                        className="hidden" 
                      />
                    </label>
                  )}
                </div>

                {isAdmin && (
                  <div
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => docFileInputRef.current?.click()}
                    className={`p-6 border-2 border-dashed rounded-2xl cursor-pointer transition-all flex flex-col items-center justify-center text-center gap-2 group ${
                      isDraggingDoc
                        ? 'border-lime-400 bg-lime-500/15 shadow-[0_0_30px_rgba(148,214,0,0.2)] scale-[1.01]'
                        : 'border-white/[0.1] hover:border-lime-500/40 bg-[#13171e]/60 hover:bg-[#13171e]'
                    }`}
                  >
                    <input 
                      ref={docFileInputRef}
                      type="file" 
                      multiple
                      disabled={uploadingDoc}
                      onChange={(e) => {
                        handleUploadFiles(e.target.files);
                        e.target.value = '';
                      }} 
                      className="hidden" 
                    />
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                      isDraggingDoc ? 'bg-lime-500 text-black' : 'bg-white/[0.04] text-lime-400 border border-white/[0.06]'
                    }`}>
                      <span className="material-symbols-outlined text-[26px]">
                        {uploadingDoc ? 'sync' : isDraggingDoc ? 'file_download' : 'cloud_upload'}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">
                        {uploadingDoc ? 'Subiendo documentos...' : isDraggingDoc ? '¡Suelta los archivos aquí!' : 'Arrastra y suelta tus documentos aquí'}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        O haz clic para seleccionar archivos desde tu dispositivo (puedes subir varios a la vez)
                      </p>
                    </div>
                  </div>
                )}

                {docsLoading ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="w-8 h-8 border-4 border-lime-500/30 border-t-lime-500 rounded-full animate-spin"></div>
                  </div>
                ) : documents.length === 0 ? (
                  <div className="text-center py-16 border border-white/[0.05] rounded-3xl bg-[#13171e]/50 border-dashed">
                    <span className="material-symbols-outlined text-5xl text-slate-600 mb-3">folder_open</span>
                    <h3 className="text-base font-bold text-white mb-1">Sin documentos aún</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      {isAdmin 
                        ? 'Carga cotizaciones, diagramas o entregables para que el cliente los visualice y descargue.'
                        : 'Aún no se han compartido documentos para este proyecto.'}
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {documents.map(doc => (
                      <div 
                        key={doc.id}
                        className="bg-[#13171e] border border-white/[0.05] hover:border-white/10 rounded-2xl p-4 flex items-center justify-between gap-4 transition-colors"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.05] flex items-center justify-center text-lime-400 shrink-0">
                            <span className="material-symbols-outlined text-[22px]">{getDocIcon(doc.file_name)}</span>
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-sm font-semibold text-white truncate">{doc.file_name}</h4>
                            <p className="text-[11px] text-slate-400 flex items-center gap-2">
                              <span>{formatFileSize(doc.file_size)}</span>
                              <span>•</span>
                              <span>Subido el {new Date(doc.created_at).toLocaleDateString()}</span>
                              {doc.profiles?.full_name && (
                                <>
                                  <span>•</span>
                                  <span className="text-slate-300">por {doc.profiles.full_name}</span>
                                </>
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => handlePreviewDoc(doc)}
                            className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
                            title="Previsualizar archivo"
                          >
                            <span className="material-symbols-outlined text-[16px]">visibility</span>
                            <span className="hidden sm:inline">Ver</span>
                          </button>

                          <button
                            onClick={() => handleDownloadDoc(doc)}
                            className="px-3 py-1.5 rounded-lg bg-lime-500/10 hover:bg-lime-500/20 text-xs font-semibold text-lime-400 flex items-center gap-1.5 transition-colors"
                            title="Descargar archivo"
                          >
                            <span className="material-symbols-outlined text-[16px]">download</span>
                            <span className="hidden sm:inline">Descargar</span>
                          </button>

                          {isAdmin && (
                            <button
                              onClick={() => handleDeleteDoc(doc)}
                              className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 flex items-center justify-center transition-colors"
                              title="Eliminar documento"
                            >
                              <span className="material-symbols-outlined text-[16px]">delete</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: TICKETS DE SOPORTE */}
            {activeTab === 'tickets' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-white tracking-tight">Tickets de Soporte Vinculados</h2>
                    <p className="text-xs text-slate-400">
                      Consultas, solicitudes y requerimientos técnicos asociados a este proyecto.
                    </p>
                  </div>

                  <button
                    onClick={() => window.location.href = '/panel/soporte'}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.1] text-white text-xs font-semibold transition-all"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                    Nuevo Ticket
                  </button>
                </div>

                {ticketsLoading ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="w-8 h-8 border-4 border-lime-500/30 border-t-lime-500 rounded-full animate-spin"></div>
                  </div>
                ) : projectTickets.length === 0 ? (
                  <div className="text-center py-16 border border-white/[0.05] rounded-3xl bg-[#13171e]/50 border-dashed">
                    <span className="material-symbols-outlined text-5xl text-slate-600 mb-3">confirmation_number</span>
                    <h3 className="text-base font-bold text-white mb-1">No hay tickets asociados</h3>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Cualquier ticket de soporte abierto para este proyecto aparecerá organizado aquí.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-3">
                    {projectTickets.map(ticket => (
                      <div 
                        key={ticket.id}
                        onClick={() => window.location.href = `/panel/soporte?open=${ticket.id}`}
                        className="bg-[#13171e] border border-white/[0.05] hover:border-lime-500/30 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer transition-colors"
                      >
                        <div>
                          <div className="flex items-center gap-2.5 mb-2">
                            <span className="text-xs font-bold text-lime-400 font-mono">#{ticket.id.slice(0, 8)}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              ticket.status === 'abierto' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                              ticket.status === 'en_proceso' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                              ticket.status === 'resuelto' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                              'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                            }`}>
                              {ticket.status.replace('_', ' ')}
                            </span>
                            <span className="text-xs text-slate-500">
                              {new Date(ticket.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-white mb-1">{ticket.subject}</h4>
                          <p className="text-xs text-slate-400 line-clamp-1">{ticket.description}</p>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 sm:border-l border-white/[0.05] sm:pl-5">
                          {ticket.assignee?.full_name && (
                            <div className="text-right">
                              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Asignado</p>
                              <p className="text-xs text-slate-200 font-medium">{ticket.assignee.full_name}</p>
                            </div>
                          )}
                          <span className="material-symbols-outlined text-slate-400 text-[20px]">chevron_right</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>

        {/* ADMIN INTERNAL NOTES DRAWER */}
        {isAdmin && showNotesDrawer && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-fade-in"
              onClick={() => setShowNotesDrawer(false)}
            />

            {/* Sliding Panel */}
            <aside className="relative w-full max-w-md bg-[#0f1117] border-l border-white/[0.08] h-full flex flex-col z-10 shadow-2xl animate-slide-left">
              <div className="p-6 border-b border-white/[0.06] flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-amber-400 text-[20px]">sticky_note_2</span>
                    Notas Internas
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Visibles únicamente para Administradores y Desarrolladores.
                  </p>
                </div>
                <button 
                  onClick={() => setShowNotesDrawer(false)}
                  className="w-8 h-8 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>

              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="p-5 border-b border-white/[0.06] bg-[#13161f]/50">
                <textarea
                  required
                  rows={3}
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  placeholder="Escribe una observación, avance o pendiente de este proyecto..."
                  className="w-full bg-[#090b0e] border border-white/[0.08] rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400/50 resize-none"
                />
                <div className="flex justify-end mt-2.5">
                  <button
                    type="submit"
                    disabled={submittingNote || !newNoteContent.trim()}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-all disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                    {submittingNote ? 'Guardando...' : 'Guardar Nota'}
                  </button>
                </div>
              </form>

              {/* Notes List */}
              <div className="flex-1 overflow-y-auto p-5 space-y-3">
                {notesLoading ? (
                  <div className="flex justify-center py-10">
                    <div className="w-6 h-6 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin"></div>
                  </div>
                ) : notes.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <span className="material-symbols-outlined text-4xl mb-2 opacity-50">note_alt</span>
                    <p className="text-xs">No hay notas registradas para este proyecto.</p>
                  </div>
                ) : (
                  notes.map(note => (
                    <div key={note.id} className="p-4 rounded-xl bg-[#13161f] border border-white/[0.05] relative group">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[11px] font-bold text-amber-400">
                          {note.profiles?.full_name || 'Administrador'}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {new Date(note.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                        {note.content}
                      </p>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20 text-red-400 transition-all"
                        title="Eliminar nota"
                      >
                        <span className="material-symbols-outlined text-[14px]">delete</span>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </aside>
          </div>
        )}

        {/* PREVIEW DOCUMENT MODAL */}
        {previewDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setPreviewDoc(null)}
            />
            <div className="relative w-full max-w-4xl max-h-[85vh] bg-[#11141a] border border-white/10 rounded-2xl flex flex-col overflow-hidden z-10 shadow-2xl">
              <div className="p-4 border-b border-white/[0.08] flex items-center justify-between bg-[#151821]">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="material-symbols-outlined text-lime-400">{getDocIcon(previewDoc.file_name)}</span>
                  <h3 className="text-sm font-bold text-white truncate">{previewDoc.file_name}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownloadDoc(previewDoc)}
                    className="px-3 py-1.5 rounded-lg bg-lime-500/10 text-lime-400 hover:bg-lime-500/20 text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[15px]">download</span>
                    Descargar
                  </button>
                  <button
                    onClick={() => setPreviewDoc(null)}
                    className="w-8 h-8 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-black/40 min-h-[400px]">
                {previewDoc.file_type?.startsWith('image/') || ['jpg', 'jpeg', 'png', 'svg', 'webp', 'gif'].includes(previewDoc.file_name.split('.').pop()?.toLowerCase()) ? (
                  <img src={previewDoc.signedUrl} alt={previewDoc.file_name} className="max-w-full max-h-[70vh] object-contain rounded-lg" />
                ) : previewDoc.file_type === 'application/pdf' || previewDoc.file_name.endsWith('.pdf') ? (
                  <iframe src={previewDoc.signedUrl} title={previewDoc.file_name} className="w-full h-[70vh] rounded-lg border-0" />
                ) : (
                  <div className="text-center p-8">
                    <span className="material-symbols-outlined text-5xl text-slate-500 mb-3">draft</span>
                    <p className="text-sm text-slate-300 font-medium mb-1">Previsualización no disponible para este tipo de archivo.</p>
                    <p className="text-xs text-slate-500 mb-4">Puedes descargarlo para abrirlo en tu equipo.</p>
                    <button
                      onClick={() => handleDownloadDoc(previewDoc)}
                      className="px-4 py-2 rounded-xl bg-lime-400 hover:bg-lime-300 text-black text-xs font-bold inline-flex items-center gap-2 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">download</span>
                      Descargar archivo
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Projects List View
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
              <div 
                key={project.id} 
                className="bg-[#13171e] border border-white/[0.05] hover:border-lime-500/30 rounded-2xl p-6 transition-colors flex flex-col md:flex-row gap-6 md:items-center cursor-pointer" 
                onClick={() => handleOpenProject(project)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusBadge(project.status)}
                    <span className="text-xs text-slate-500 font-mono">
                      {new Date(project.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">
                    {project.project_name || project.main_problem}
                  </h3>

                  {project.project_name && (
                    <p className="text-xs text-slate-400 line-clamp-1 mb-2">
                      {project.main_problem}
                    </p>
                  )}

                  {isAdmin && (
                    <p className="text-xs text-lime-400 font-medium">
                      Cliente: {project.contact_name} ({project.company})
                    </p>
                  )}

                  <p className="text-xs text-slate-500 mt-2">
                    <span className="font-semibold text-slate-400">Etapa:</span> {project.project_stage}
                  </p>
                </div>
                
                <div className="flex items-center gap-4 md:border-l border-white/[0.05] md:pl-6">
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
