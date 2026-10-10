import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../../supabase';
import { useToast } from '../../components/ui/Toast';

export function SoportePage({ profile, role }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [admins, setAdmins] = useState([]);
  
  const [newMessage, setNewMessage] = useState('');
  const [newMsgFile, setNewMsgFile] = useState(null);
  
  const [viewerImage, setViewerImage] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTicketData, setNewTicketData] = useState({ subject: '', description: '', priority: 'medium', project_id: '' });
  const [newTicketFiles, setNewTicketFiles] = useState([]);
  
  const [pendingAssignment, setPendingAssignment] = useState(null);
  const [clientProjects, setClientProjects] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  
  const msgFileInputRef = useRef(null);
  const ticketFileInputRef = useRef(null);
  const { addToast } = useToast();
  
  const isAdmin = role?.slug === 'administrador' || role?.slug === 'desarrollador';

  useEffect(() => {
    fetchTickets();
    if (isAdmin) fetchAdmins();
  }, []);

  useEffect(() => {
    if (showCreateModal && clientProjects.length === 0 && !isAdmin) {
      fetchClientProjects();
    }
  }, [showCreateModal]);

  const fetchClientProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('project_requests')
        .select('id, main_problem')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false });
        
      if (!error && data) {
        setClientProjects(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAdmins = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, roles(slug)');
      if (!error && data) {
        const adminProfiles = data
          .filter(p => p.roles && ['administrador', 'desarrollador'].includes(p.roles.slug))
          .map(p => ({
            ...p,
            display_name: `${p.full_name} (${p.roles.slug === 'administrador' ? 'Admin' : 'Dev'})`
          }));
        setAdmins(adminProfiles);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const { data: unreadData } = await supabase.rpc('get_ticket_unread_counts');
      const unreadMap = {};
      if (unreadData) unreadData.forEach(r => unreadMap[r.ticket_id] = parseInt(r.unread_count));

      let query = supabase
        .from('tickets')
        .select('*, profiles!tickets_client_id_fkey(full_name, company), project_requests(main_problem), assignee:profiles!tickets_assigned_to_fkey(full_name)')
        .order('created_at', { ascending: false });
      
      const { data, error } = await query;
      if (error) throw error;
      setTickets((data || []).map(t => ({ ...t, unread_count: unreadMap[t.id] || 0 })));
    } catch (err) {
      addToast('Error al cargar tickets: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (ticketId) => {
    if (!profile) return;
    try {
      await supabase.from('ticket_user_reads').upsert({
        ticket_id: ticketId,
        user_id: profile.id,
        last_read_at: new Date().toISOString()
      });
      setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, unread_count: 0 } : t));
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenTicket = async (ticket) => {
    setSelectedTicket(ticket);
    fetchMessages(ticket.id);
    fetchAssignments(ticket.id);

    markAsRead(ticket.id);

    if (isAdmin && !ticket.assigned_to) {
      await assignTicket(ticket, profile.id, null);
    }
  };

  const fetchMessages = async (ticketId) => {
    try {
      const { data, error } = await supabase
        .from('ticket_messages')
        .select('*, senderData:profiles!ticket_messages_sender_id_fkey(full_name, avatar_url, roles(slug))')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      addToast('Error al cargar mensajes', 'error');
    }
  };

  const fetchAssignments = async (ticketId) => {
    try {
      const { data, error } = await supabase
        .from('ticket_assignments')
        .select('*, from_profile:profiles!ticket_assignments_assigned_from_fkey(full_name), to_profile:profiles!ticket_assignments_assigned_to_fkey(full_name)')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });
      if (!error && data) {
        setAssignments(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const assignTicket = async (ticket, newAssigneeId, oldAssigneeId) => {
    try {
      await supabase.from('ticket_assignments').insert({
        ticket_id: ticket.id,
        assigned_from: oldAssigneeId,
        assigned_to: newAssigneeId
      });
      
      await supabase.from('tickets').update({ assigned_to: newAssigneeId }).eq('id', ticket.id);
      
      const updated = { ...ticket, assigned_to: newAssigneeId };
      setSelectedTicket(updated);
      setTickets(prev => prev.map(t => t.id === ticket.id ? updated : t));
      fetchAssignments(ticket.id);
      
      // Update the assignee locally to show correct name immediately
      const assigneeData = admins.find(a => a.id === newAssigneeId);
      if (assigneeData) {
        updated.assignee = { full_name: assigneeData.full_name };
      }
    } catch (err) {
      addToast('Error al reasignar ticket: ' + err.message, 'error');
    }
  };

  const uploadFile = async (file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${profile.id}-${Math.random()}.${fileExt}`;
    const { error } = await supabase.storage.from('ticket_assets').upload(fileName, file);
    if (error) throw error;
    const { data } = supabase.storage.from('ticket_assets').getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !newMsgFile) return;
    
    setSubmitting(true);
    try {
      let attachments = [];
      if (newMsgFile) {
        const url = await uploadFile(newMsgFile);
        attachments.push(url);
      }

      const { data, error } = await supabase
        .from('ticket_messages')
        .insert([{
          ticket_id: selectedTicket.id,
          sender_id: profile.id,
          message: newMessage.trim(),
          attachments: attachments
        }])
        .select('*, senderData:profiles!ticket_messages_sender_id_fkey(full_name, avatar_url, roles(slug))')
        .single();
        
      if (error) throw error;
      setMessages([...messages, data]);
      setNewMessage('');
      setNewMsgFile(null);
      markAsRead(selectedTicket.id);
    } catch (err) {
      addToast('Error al enviar mensaje: ' + err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!newTicketData.subject.trim() || !newTicketData.description.trim()) return;
    
    setSubmitting(true);
    try {
      let attachments = [];
      if (newTicketFiles.length > 0) {
        for (const file of newTicketFiles) {
          const url = await uploadFile(file);
          attachments.push(url);
        }
      }

      const { data, error } = await supabase
        .from('tickets')
        .insert([{
          client_id: profile.id,
          project_id: newTicketData.project_id || null,
          subject: newTicketData.subject,
          description: newTicketData.description,
          priority: newTicketData.priority,
          attachments: attachments
        }])
        .select('*, profiles!tickets_client_id_fkey(full_name, company), project_requests(main_problem), assignee:profiles!tickets_assigned_to_fkey(full_name)')
        .single();
        
      if (error) throw error;
      
      setTickets([data, ...tickets]);
      setShowCreateModal(false);
      setNewTicketData({ subject: '', description: '', priority: 'medium', project_id: '' });
      setNewTicketFiles([]);
      addToast('Ticket creado exitosamente', 'success');
    } catch (err) {
      addToast('Error al crear ticket: ' + err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChangeStatus = async (newStatus) => {
    try {
      const { error } = await supabase
        .from('tickets')
        .update({ status: newStatus })
        .eq('id', selectedTicket.id);
        
      if (error) throw error;
      
      const updated = { ...selectedTicket, status: newStatus };
      setSelectedTicket(updated);
      setTickets(tickets.map(t => t.id === updated.id ? updated : t));
      addToast('Estado actualizado', 'success');
    } catch (err) {
      addToast('Error al cambiar estado', 'error');
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'open': return <span className="px-2 py-1 rounded-md bg-blue-500/10 text-blue-400 text-[10px] font-bold tracking-wider uppercase">Abierto</span>;
      case 'in_progress': return <span className="px-2 py-1 rounded-md bg-yellow-500/10 text-yellow-500 text-[10px] font-bold tracking-wider uppercase">En Proceso</span>;
      case 'resolved': return <span className="px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-bold tracking-wider uppercase">Resuelto</span>;
      case 'closed': return <span className="px-2 py-1 rounded-md bg-slate-500/10 text-slate-400 text-[10px] font-bold tracking-wider uppercase">Cerrado</span>;
      default: return null;
    }
  };

  const getPriorityBadge = (priority) => {
    switch(priority) {
      case 'low': return <span className="text-slate-400 text-xs font-semibold">Baja</span>;
      case 'medium': return <span className="text-blue-400 text-xs font-semibold">Media</span>;
      case 'high': return <span className="text-orange-400 text-xs font-semibold">Alta</span>;
      case 'urgent': return <span className="text-red-500 text-xs font-bold">Urgente</span>;
      default: return null;
    }
  };
  
  // Combine messages and assignments into a single timeline array
  const getTimeline = () => {
    const timeline = [
      ...messages.map(m => ({ ...m, type: 'message' })),
      ...assignments.map(a => ({ ...a, type: 'assignment' }))
    ];
    return timeline.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  };

  if (selectedTicket) {
    const timeline = getTimeline();
    
    return (
      <div className="flex-1 flex flex-col h-full bg-[#0c0e12] overflow-hidden">
        <header className="px-8 py-6 border-b border-white/[0.05] bg-[#0c0e12]/80 backdrop-blur-sm flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSelectedTicket(null)} className="w-10 h-10 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center transition-colors">
              <span className="material-symbols-outlined text-slate-400">arrow_back</span>
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-white tracking-tight">{selectedTicket.subject}</h1>
                {getStatusBadge(selectedTicket.status)}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-xs text-slate-400">Ticket #{selectedTicket.id.split('-')[0]} • Creado el {new Date(selectedTicket.created_at).toLocaleDateString()}</p>
                {selectedTicket.project_requests && (
                  <span className="px-2 py-0.5 rounded bg-lime-500/10 text-[10px] text-lime-400 border border-lime-500/20 font-semibold truncate max-w-[200px]" title={selectedTicket.project_requests.main_problem}>
                    Proyecto: {selectedTicket.project_requests.main_problem}
                  </span>
                )}
                {selectedTicket.assignee && (
                  <span className="px-2 py-0.5 rounded bg-blue-500/10 text-[10px] text-blue-400 border border-blue-500/20 font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">person</span>
                    Asignado a: {selectedTicket.assignee.full_name}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {isAdmin && (
            <div className="flex items-center gap-4">
              {/* Reasignar */}
              {(selectedTicket.assigned_to === profile.id || !selectedTicket.assigned_to) && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-400">Asignado a:</span>
                  <select 
                    value={selectedTicket.assigned_to || ''}
                    onChange={(e) => {
                      if (e.target.value && e.target.value !== selectedTicket.assigned_to) {
                        setPendingAssignment({
                          newAssigneeId: e.target.value,
                          oldAssigneeId: selectedTicket.assigned_to,
                          ticket: selectedTicket
                        });
                      }
                    }}
                    className="bg-[#15181e] border border-white/[0.08] text-sm text-white rounded-lg px-3 py-1.5 focus:outline-none focus:border-lime-500"
                  >
                    {!selectedTicket.assigned_to && <option value="">Sin asignar</option>}
                    {admins.map(a => (
                      <option key={a.id} value={a.id}>{a.display_name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex items-center gap-2 border-l border-white/[0.1] pl-4">
                <span className="text-xs font-semibold text-slate-400">Estado:</span>
                <select 
                  value={selectedTicket.status}
                  onChange={(e) => handleChangeStatus(e.target.value)}
                  className="bg-[#15181e] border border-white/[0.08] text-sm text-white rounded-lg px-3 py-1.5 focus:outline-none focus:border-lime-500"
                >
                  <option value="open">Abierto</option>
                  <option value="in_progress">En Proceso</option>
                  <option value="resolved">Resuelto</option>
                  <option value="closed">Cerrado</option>
                </select>
              </div>
            </div>
          )}
        </header>

        <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6 max-w-4xl mx-auto w-full">
          {/* Main Description */}
          <div className="bg-[#13171e] border border-white/[0.05] rounded-2xl p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold">
                  {selectedTicket.profiles?.full_name?.charAt(0) || 'C'}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{selectedTicket.profiles?.full_name}</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">{selectedTicket.profiles?.company}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Prioridad</p>
                {getPriorityBadge(selectedTicket.priority)}
              </div>
            </div>
            <div className="p-4 bg-[#0c0e12] rounded-xl text-sm text-slate-300 leading-relaxed border border-white/[0.03]">
              {selectedTicket.description}
            </div>
            {selectedTicket.attachments && selectedTicket.attachments.length > 0 && (
              <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                {selectedTicket.attachments.map((url, i) => (
                  <button key={i} onClick={() => { setViewerImage(url); setZoomLevel(1); }} className="block w-24 h-24 rounded-lg overflow-hidden border border-white/[0.1] hover:border-lime-500 transition-colors shrink-0">
                    <img src={url} alt="Attachment" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="flex flex-col gap-4">
            {timeline.map(item => {
              if (item.type === 'assignment') {
                return (
                  <div key={item.id} className="flex justify-center my-2">
                    <div className="px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.05] text-[11px] text-slate-400 font-medium flex items-center gap-2">
                      <span className="material-symbols-outlined text-[14px]">swap_horiz</span>
                      {item.from_profile ? (
                        <span>De <b>{item.from_profile.full_name}</b> a <b>{item.to_profile?.full_name}</b></span>
                      ) : (
                        <span>Asignado a <b>{item.to_profile?.full_name}</b></span>
                      )}
                    </div>
                  </div>
                );
              }

              const isMe = item.sender_id === profile.id;
              // Because we use an explicit alias 'senderData', it will be in item.senderData
              const rawSender = item.senderData || item.profiles;
              const senderProfile = Array.isArray(rawSender) ? rawSender[0] : rawSender;
              
              let roleName = 'Cliente';
              const slug = senderProfile?.roles?.slug || senderProfile?.roles?.[0]?.slug;
              if (slug === 'administrador') roleName = 'Administrador';
              if (slug === 'desarrollador') roleName = 'Desarrollador';
              
              const isAgency = slug === 'administrador' || slug === 'desarrollador';
              const displayName = senderProfile?.full_name || (isAgency ? 'Soporte Técnico' : 'Cliente');

              return (
                <div key={item.id} className={`flex gap-4 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                    {senderProfile?.avatar_url ? (
                      <img src={senderProfile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white text-xs font-bold">{displayName.charAt(0)}</span>
                    )}
                  </div>
                  <div className={`max-w-[80%] rounded-2xl p-4 ${isMe ? 'bg-lime-500/10 border border-lime-500/20 text-lime-50' : 'bg-[#15181e] border border-white/[0.05] text-slate-200'}`}>
                    <div className={`flex items-center gap-2 mb-1 ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <span className="text-[11px] font-bold opacity-70 flex items-center gap-1.5">
                        {displayName}
                        <span className={`px-1.5 py-0.5 rounded text-[8px] uppercase tracking-wider font-bold ${isAgency ? 'bg-lime-500/20 text-lime-400' : 'bg-white/10 text-slate-400'}`}>
                          {roleName}
                        </span>
                      </span>
                      <span className="text-[9px] opacity-40">{new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{item.message}</p>
                    {item.attachments && item.attachments.length > 0 && (
                      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                        {item.attachments.map((url, i) => (
                          <button key={i} onClick={() => { setViewerImage(url); setZoomLevel(1); }} className="block w-20 h-20 rounded-lg overflow-hidden border border-white/[0.2] hover:border-lime-500/50 hover:opacity-80 transition-all shrink-0">
                            <img src={url} alt="Attachment" className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Message Input */}
        {selectedTicket.status !== 'closed' ? (
          <div className="p-6 border-t border-white/[0.05] bg-[#0c0e12] max-w-4xl mx-auto w-full shrink-0">
            <form onSubmit={handleSendMessage} className="flex items-center gap-3 bg-[#15181e] border border-white/[0.08] rounded-2xl p-2 focus-within:border-lime-500/50 transition-colors">
              <input type="file" ref={msgFileInputRef} className="hidden" accept="image/*" onChange={(e) => setNewMsgFile(e.target.files[0])} />
              <button 
                type="button"
                onClick={() => msgFileInputRef.current?.click()}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors shrink-0 ${newMsgFile ? 'bg-lime-500/20 text-lime-400' : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08]'}`}
                title="Adjuntar imagen"
              >
                <span className="material-symbols-outlined text-[20px]">image</span>
              </button>
              
              <input 
                type="text" 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Escribe un mensaje..."
                className="flex-1 bg-transparent px-2 text-sm text-white focus:outline-none"
              />
              
              <button 
                type="submit"
                disabled={submitting || (!newMessage.trim() && !newMsgFile)}
                className="px-5 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 disabled:bg-slate-700 disabled:text-slate-500 text-black text-sm font-bold shadow-[0_0_15px_rgba(148,214,0,0.2)] transition-all flex items-center gap-2 shrink-0"
              >
                {submitting ? (
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
                ) : (
                  <span className="material-symbols-outlined text-[18px]">send</span>
                )}
                Enviar
              </button>
            </form>
            {newMsgFile && (
              <div className="mt-2 text-xs text-lime-400 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">attachment</span>
                Imagen adjunta: {newMsgFile.name} 
                <button onClick={() => setNewMsgFile(null)} className="ml-2 text-slate-500 hover:text-red-400">Quitar</button>
              </div>
            )}
          </div>
        ) : (
          <div className="p-6 border-t border-white/[0.05] bg-[#0c0e12] max-w-4xl mx-auto w-full text-center shrink-0">
            <p className="text-sm text-slate-500 font-medium">Este ticket está cerrado y no admite más respuestas.</p>
          </div>
        )}

        {/* Image Viewer Modal */}
        {viewerImage && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md">
            <div className="absolute top-6 right-6 flex items-center gap-4 z-[110]">
              <button onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.25))} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors">
                <span className="material-symbols-outlined">zoom_out</span>
              </button>
              <button onClick={() => setZoomLevel(1)} className="text-xs text-white/50 hover:text-white font-semibold min-w-[3rem] text-center">
                {Math.round(zoomLevel * 100)}%
              </button>
              <button onClick={() => setZoomLevel(prev => Math.min(3, prev + 0.25))} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors">
                <span className="material-symbols-outlined">zoom_in</span>
              </button>
              <div className="w-px h-6 bg-white/20 mx-2"></div>
              <button onClick={() => setViewerImage(null)} className="w-10 h-10 rounded-full bg-white/10 hover:bg-red-500/80 text-white flex items-center justify-center transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="w-full h-full overflow-auto flex items-center justify-center p-4">
              <img 
                src={viewerImage} 
                alt="Visualizador" 
                style={{ transform: `scale(${zoomLevel})`, transition: 'transform 0.15s ease-out' }}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>
        )}

        {/* Modal Reasignar Ticket */}
        {pendingAssignment && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <div className="bg-[#13171e] border border-white/[0.08] rounded-3xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 shadow-2xl">
              <div className="p-7 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-5 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
                  <span className="material-symbols-outlined text-blue-400 text-3xl">move_up</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 tracking-tight">¿Confirmar traslado?</h3>
                <p className="text-sm text-slate-400 mb-8">
                  Estás a punto de reasignar este ticket a <strong className="text-white">{admins.find(a => a.id === pendingAssignment.newAssigneeId)?.display_name}</strong>. A partir de ahora, este agente será el único responsable de solucionarlo.
                </p>
                
                <div className="flex gap-3 w-full">
                  <button 
                    onClick={() => setPendingAssignment(null)}
                    className="flex-1 px-4 py-3 rounded-xl text-sm font-bold text-slate-300 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.05] transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={() => {
                      assignTicket(pendingAssignment.ticket, pendingAssignment.newAssigneeId, pendingAssignment.oldAssigneeId);
                      setPendingAssignment(null);
                    }}
                    className="flex-1 px-4 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 text-white text-sm font-bold shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">check</span>
                    Sí, reasignar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0c0e12] overflow-hidden">
      <header className="px-8 py-6 border-b border-white/[0.05] bg-[#0c0e12]/80 backdrop-blur-sm sticky top-0 z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Soporte Técnico</h1>
          <p className="text-sm text-slate-400">
            {isAdmin ? 'Gestiona los tickets de soporte de tus clientes.' : 'Abre un ticket si necesitas ayuda o reportar un problema.'}
          </p>
        </div>
        
        {!isAdmin && (
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-black text-sm font-bold shadow-[0_0_15px_rgba(148,214,0,0.2)] transition-all shrink-0"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            Nuevo Ticket
          </button>
        )}
      </header>

      <div className="flex-1 overflow-y-auto p-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-lime-500/30 border-t-lime-500 rounded-full animate-spin"></div>
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-20 border border-white/[0.05] rounded-3xl bg-[#13171e]/50 border-dashed">
            <span className="material-symbols-outlined text-6xl text-slate-700 mb-4">support_agent</span>
            <h3 className="text-xl font-bold text-white mb-2">No hay tickets de soporte</h3>
            <p className="text-sm text-slate-400 mb-6 max-w-md mx-auto">
              Todo funciona perfectamente. Si necesitas ayuda, no dudes en contactarnos abriendo un ticket.
            </p>
            {!isAdmin && (
              <button 
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white text-sm font-bold border border-white/[0.1] transition-all"
              >
                Abrir mi primer ticket
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-3 max-w-5xl mx-auto">
            {tickets.map(ticket => (
              <div 
                key={ticket.id} 
                onClick={() => handleOpenTicket(ticket)}
                className="bg-[#13171e] border border-white/[0.05] hover:border-lime-500/30 rounded-2xl p-5 transition-all cursor-pointer flex flex-col md:flex-row md:items-center gap-4 group relative"
              >
                {(ticket.unread_count > 0 && (!ticket.assigned_to || ticket.assigned_to === profile?.id || !isAdmin)) && (
                  <div className="absolute -top-2 -right-2 bg-lime-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full shadow-[0_0_10px_rgba(132,204,22,0.5)] z-10 flex items-center gap-1 border-2 border-[#13171e]">
                    <span className="material-symbols-outlined text-[10px]">mark_chat_unread</span>
                    {ticket.unread_count} nuevo{ticket.unread_count !== 1 ? 's' : ''}
                  </div>
                )}
                <div className="w-12 h-12 rounded-full bg-[#15181e] border border-white/[0.05] flex items-center justify-center shrink-0">
                  <span className={`material-symbols-outlined text-[24px] ${ticket.status === 'resolved' ? 'text-emerald-400' : 'text-lime-400'}`}>
                    {ticket.status === 'resolved' ? 'check_circle' : 'forum'}
                  </span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-base font-bold text-white truncate group-hover:text-lime-400 transition-colors">{ticket.subject}</h3>
                    {getStatusBadge(ticket.status)}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span>Ticket #{ticket.id.split('-')[0]}</span>
                    <span>•</span>
                    <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
                    {isAdmin && (
                      <>
                        <span>•</span>
                        <span className="font-semibold text-slate-400">{ticket.profiles?.full_name}</span>
                      </>
                    )}
                    {ticket.project_requests && (
                      <>
                        <span>•</span>
                        <span className="px-1.5 py-0.5 rounded bg-white/[0.05] text-[10px] text-slate-400 truncate max-w-[150px]">
                          {ticket.project_requests.main_problem}
                        </span>
                      </>
                    )}
                    {ticket.assignee && (
                      <>
                        <span>•</span>
                        <span className="text-blue-400 flex items-center gap-1 font-semibold">
                          <span className="material-symbols-outlined text-[12px]">person</span>
                          {ticket.assignee.full_name}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-right hidden sm:block">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Prioridad</p>
                    {getPriorityBadge(ticket.priority)}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/[0.03] flex items-center justify-center text-slate-400 group-hover:bg-lime-500/10 group-hover:text-lime-400 transition-colors">
                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Crear Ticket */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#13171e] border border-white/[0.08] rounded-3xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 shadow-2xl">
            <div className="px-6 py-5 border-b border-white/[0.05] flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Nuevo Ticket de Soporte</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleCreateTicket} className="p-6 space-y-5">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Asunto del problema</label>
                <input 
                  type="text" 
                  value={newTicketData.subject}
                  onChange={e => setNewTicketData({...newTicketData, subject: e.target.value})}
                  placeholder="Ej. Error al iniciar sesión en mi panel"
                  className="w-full bg-[#0c0e12] border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-lime-500/50 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Proyecto (Opcional)</label>
                <select 
                  value={newTicketData.project_id}
                  onChange={e => setNewTicketData({...newTicketData, project_id: e.target.value})}
                  className="w-full bg-[#0c0e12] border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-lime-500/50 transition-colors"
                >
                  <option value="">-- Sin proyecto asignado --</option>
                  {clientProjects.map(p => (
                    <option key={p.id} value={p.id}>{p.main_problem}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Prioridad</label>
                <select 
                  value={newTicketData.priority}
                  onChange={e => setNewTicketData({...newTicketData, priority: e.target.value})}
                  className="w-full bg-[#0c0e12] border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-lime-500/50 transition-colors"
                >
                  <option value="low">Baja - Dudas generales</option>
                  <option value="medium">Media - Problema que no bloquea mi trabajo</option>
                  <option value="high">Alta - Funcionalidad rota</option>
                  <option value="urgent">Urgente - Sistema caído completamente</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Descripción detallada</label>
                <textarea 
                  value={newTicketData.description}
                  onChange={e => setNewTicketData({...newTicketData, description: e.target.value})}
                  placeholder="Describe qué estabas haciendo y qué error apareció..."
                  className="w-full h-24 bg-[#0c0e12] border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-lime-500/50 transition-colors resize-none"
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Adjuntar capturas (Opcional)</label>
                <input type="file" ref={ticketFileInputRef} className="hidden" accept="image/*" multiple onChange={(e) => setNewTicketFiles(Array.from(e.target.files))} />
                <button 
                  type="button" 
                  onClick={() => ticketFileInputRef.current?.click()}
                  className="w-full border border-dashed border-white/[0.2] hover:border-lime-500/50 bg-[#0c0e12] rounded-xl px-4 py-3 text-xs font-semibold text-slate-400 hover:text-lime-400 transition-colors flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">add_photo_alternate</span>
                  {newTicketFiles.length > 0 ? `${newTicketFiles.length} imagen(es) seleccionada(s)` : 'Haz clic para adjuntar imágenes'}
                </button>
              </div>
              
              <div className="pt-2 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowCreateModal(false)}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:bg-white/[0.05] transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={submitting || !newTicketData.subject || !newTicketData.description}
                  className="px-6 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-black text-sm font-bold shadow-[0_0_15px_rgba(148,214,0,0.2)] transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting ? (
                    <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
                  ) : (
                    <span className="material-symbols-outlined text-[18px]">send</span>
                  )}
                  Enviar Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
