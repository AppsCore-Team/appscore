import { useState } from 'react';
import { Modal } from '../../components/ui/Modal';

export function UserFormModal({ isOpen, onClose, onSubmitDirect, onSubmitInvite, isSubmitting, roles = [] }) {
  const [activeTab, setActiveTab] = useState('direct'); // 'direct' or 'invite'
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    company: '',
    phone: '',
    roleId: roles.length > 0 ? roles[0].id : ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === 'direct') {
      onSubmitDirect(formData);
    } else {
      onSubmitInvite({ email: formData.email, roleId: formData.roleId });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Crear nuevo usuario">
      <div className="flex items-center gap-6 border-b border-white/[0.06] mb-6">
        <button 
          type="button"
          onClick={() => setActiveTab('direct')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'direct' ? 'border-lime-400 text-lime-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
        >
          Registrar Usuario
        </button>
        <button 
          type="button"
          onClick={() => setActiveTab('invite')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'invite' ? 'border-lime-400 text-lime-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
        >
          Enviar Invitación
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        
        {activeTab === 'direct' && (
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Nombre Completo</label>
            <input 
              type="text" 
              required
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              placeholder="Ej. Juan Pérez"
              className="w-full bg-[#0c0e12] border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-lime-500/50 transition-colors"
            />
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Correo Electrónico</label>
          <input 
            type="email" 
            required
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            placeholder="tu@empresa.com"
            className="w-full bg-[#0c0e12] border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-lime-500/50 transition-colors"
          />
        </div>

        {activeTab === 'direct' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Empresa (Opcional)</label>
              <input 
                type="text" 
                value={formData.company}
                onChange={(e) => setFormData({...formData, company: e.target.value})}
                placeholder="Empresa SAS"
                className="w-full bg-[#0c0e12] border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-lime-500/50 transition-colors"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Teléfono (Opcional)</label>
              <input 
                type="tel" 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="+1 234..."
                className="w-full bg-[#0c0e12] border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-lime-500/50 transition-colors"
              />
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Rol asignado</label>
          <select 
            required
            value={formData.roleId}
            onChange={(e) => setFormData({...formData, roleId: e.target.value})}
            className="w-full bg-[#0c0e12] border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-lime-500/50 transition-colors appearance-none"
          >
            {roles.map(r => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </div>

        {activeTab === 'direct' ? (
          <div className="p-4 bg-[#94d600]/10 border border-[#94d600]/20 rounded-xl mt-2">
            <p className="text-xs text-[#94d600] flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">info</span>
              El usuario recibirá un correo de bienvenida con un enlace para establecer su contraseña.
            </p>
          </div>
        ) : (
          <div className="p-4 bg-sky-400/10 border border-sky-400/20 rounded-xl mt-2">
            <p className="text-xs text-sky-400 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">mark_email_read</span>
              Se enviará un código de invitación único al correo proporcionado.
            </p>
          </div>
        )}

        <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-white/[0.06]">
          <button 
            type="button" 
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-semibold text-slate-400 hover:text-white transition-colors"
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="px-6 py-2.5 bg-lime-400 hover:bg-lime-300 text-black text-sm font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(163,230,53,0.15)] disabled:opacity-50 flex items-center gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
            ) : null}
            {activeTab === 'direct' ? 'Registrar Usuario' : 'Enviar Invitación'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
