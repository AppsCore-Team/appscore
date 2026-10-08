import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabase';

export function ContactosPage({ role }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const isAdmin = role?.slug === 'administrador';

  useEffect(() => {
    if (isAdmin) {
      fetchMessages();
    } else {
      setError('No tienes permisos para ver esta sección.');
      setLoading(false);
    }
  }, [isAdmin]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (messageId, newStatus) => {
    try {
      const { error } = await supabase.from('contact_messages').update({ status: newStatus }).eq('id', messageId);
      if (error) throw error;
      
      const updatedMessages = messages.map(m => m.id === messageId ? { ...m, status: newStatus } : m);
      setMessages(updatedMessages);
      if (selectedMessage?.id === messageId) {
        setSelectedMessage({ ...selectedMessage, status: newStatus });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadge = (status) => {
    switch(status?.toLowerCase()) {
      case 'no leído':
        return <span className="px-2.5 py-1 rounded-md bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-semibold">No leído</span>;
      case 'leído':
        return <span className="px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold">Leído</span>;
      case 'contactado':
        return <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">Contactado</span>;
      default:
        return <span className="px-2.5 py-1 rounded-md bg-slate-500/10 text-slate-400 border border-slate-500/20 text-xs font-semibold">{status || 'No leído'}</span>;
    }
  };

  if (selectedMessage) {
    return (
      <div className="flex-1 flex flex-col h-full bg-[#0c0e12] overflow-hidden">
        <header className="px-8 py-6 border-b border-white/[0.05] bg-[#0c0e12]/80 backdrop-blur-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setSelectedMessage(null)} className="w-10 h-10 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center transition-colors">
              <span className="material-symbols-outlined text-slate-400">arrow_back</span>
            </button>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">Detalles del Mensaje</h1>
              <p className="text-xs text-slate-400">Enviado el {new Date(selectedMessage.created_at).toLocaleDateString()} a las {new Date(selectedMessage.created_at).toLocaleTimeString()}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-slate-400">Estado:</span>
            <select 
              value={selectedMessage.status}
              onChange={(e) => handleStatusChange(selectedMessage.id, e.target.value)}
              className="bg-[#15181e] border border-white/[0.08] text-sm text-white rounded-lg px-3 py-2 focus:outline-none focus:border-lime-500"
            >
              <option value="No leído">No leído</option>
              <option value="Leído">Leído</option>
              <option value="Contactado">Contactado</option>
            </select>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-3xl mx-auto space-y-6">
            
            <div className="bg-[#13171e] border border-white/[0.05] rounded-2xl p-6">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Información de Contacto</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Nombre</p>
                  <p className="text-sm text-white font-medium">{selectedMessage.user_name}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Empresa</p>
                  <p className="text-sm text-white font-medium">{selectedMessage.company_name}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Correo</p>
                  <a href={`mailto:${selectedMessage.user_email}`} className="text-sm text-lime-400 font-medium hover:underline">{selectedMessage.user_email}</a>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Tipo de proyecto</p>
                  <p className="text-sm text-white font-medium">{selectedMessage.project_type}</p>
                </div>
              </div>
            </div>

            <div className="bg-[#13171e] border border-white/[0.05] rounded-2xl p-6">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Mensaje / Visión</h2>
              <div className="p-4 bg-[#0c0e12] rounded-xl text-sm text-slate-300 leading-relaxed border border-white/[0.03] whitespace-pre-wrap">
                {selectedMessage.message}
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
      <header className="px-8 py-6 border-b border-white/[0.05] bg-[#0c0e12]/80 backdrop-blur-sm sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-white tracking-tight">Mensajes Web</h1>
        <p className="text-sm text-slate-400">
          Formularios de contacto recibidos desde la página principal.
        </p>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-lime-500/30 border-t-lime-500 rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
            {error}
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-20 border border-white/[0.05] rounded-3xl bg-[#13171e]/50 border-dashed">
            <span className="material-symbols-outlined text-6xl text-slate-700 mb-4">mail</span>
            <h3 className="text-xl font-bold text-white mb-2">Bandeja vacía</h3>
            <p className="text-sm text-slate-400">
              Aún no se han recibido mensajes desde la página de inicio.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {messages.map(msg => (
              <div 
                key={msg.id} 
                className={`bg-[#13171e] border hover:border-lime-500/30 rounded-2xl p-6 transition-colors flex flex-col md:flex-row gap-6 md:items-center cursor-pointer ${msg.status === 'No leído' ? 'border-lime-500/20' : 'border-white/[0.05]'}`}
                onClick={() => {
                  setSelectedMessage(msg);
                  if (msg.status === 'No leído') handleStatusChange(msg.id, 'Leído');
                }}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusBadge(msg.status)}
                    <span className="text-xs text-slate-500 font-mono">{new Date(msg.created_at).toLocaleDateString()} {new Date(msg.created_at).toLocaleTimeString()}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    {msg.user_name} <span className="text-sm font-normal text-slate-400">({msg.company_name})</span>
                  </h3>
                  <p className="text-xs text-lime-400 font-medium mb-2">
                    {msg.project_type}
                  </p>
                  <p className="text-sm text-slate-400 line-clamp-2">
                    {msg.message}
                  </p>
                </div>
                
                <div className="flex items-center gap-3 md:border-l border-white/[0.05] md:pl-6">
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
