import { useState, useEffect } from 'react';
import { Modal } from '../../components/ui/Modal';

const ICONS = [
  'badge', 'shield_person', 'terminal', 'person', 'engineering', 'support_agent', 
  'manage_accounts', 'verified_user', 'admin_panel_settings', 'psychology', 'stars', 'group'
];

const COLORS = [
  { id: 'lime', name: 'Lima', hex: 'bg-lime-400' },
  { id: 'sky', name: 'Azul', hex: 'bg-sky-400' },
  { id: 'violet', name: 'Violeta', hex: 'bg-violet-400' },
  { id: 'amber', name: 'Ámbar', hex: 'bg-amber-400' },
  { id: 'rose', name: 'Rosa', hex: 'bg-rose-400' },
  { id: 'teal', name: 'Teal', hex: 'bg-teal-400' },
];

export function RoleFormModal({ isOpen, onClose, onSubmit, isSubmitting, initialData = null, roles = [] }) {
  const [formData, setFormData] = useState({
    name: '', description: '', icon: 'badge', color: 'lime', copyFrom: ''
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({ ...initialData, copyFrom: '' });
      } else {
        setFormData({ name: '', description: '', icon: 'badge', color: 'lime', copyFrom: '' });
      }
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Editar rol' : 'Crear nuevo rol'}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Nombre del rol</label>
          <input 
            type="text" 
            required
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="Ej. Soporte Técnico"
            className="w-full bg-[#0c0e12] border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-lime-500/50 transition-colors"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Descripción (Opcional)</label>
          <textarea 
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="¿Qué puede hacer este rol?"
            className="w-full bg-[#0c0e12] border border-white/[0.06] rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-lime-500/50 transition-colors resize-none h-24"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Icono</label>
            <div className="grid grid-cols-4 gap-2">
              {ICONS.map(icon => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setFormData({...formData, icon})}
                  className={`flex items-center justify-center w-10 h-10 rounded-lg border transition-colors ${
                    formData.icon === icon 
                      ? 'bg-lime-400/10 border-lime-500/30 text-lime-400' 
                      : 'bg-[#0c0e12] border-white/[0.06] text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{icon}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Color</label>
            <div className="grid grid-cols-3 gap-2">
              {COLORS.map(c => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setFormData({...formData, color: c.id})}
                  className={`flex items-center gap-2 p-2 rounded-lg border transition-colors ${
                    formData.color === c.id 
                      ? 'bg-white/[0.08] border-white/[0.1] text-white' 
                      : 'bg-[#0c0e12] border-white/[0.06] text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full ${c.hex}`}></div>
                  <span className="text-[11px] font-medium">{c.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {!initialData && roles.length > 0 && (
          <div className="flex flex-col gap-2 pt-4 border-t border-white/[0.06]">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Basar permisos en (Opcional)</label>
            <div className="relative">
              <select
                value={formData.copyFrom}
                onChange={(e) => setFormData({...formData, copyFrom: e.target.value})}
                className="w-full bg-[#0c0e12] border border-white/[0.06] rounded-xl pl-4 pr-10 py-3 text-sm text-slate-200 focus:outline-none focus:border-lime-500/50 transition-colors appearance-none"
              >
                <option value="">Empezar desde cero</option>
                {roles.map(r => (
                  <option key={r.id} value={r.id}>Copiar permisos de {r.name}</option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">expand_more</span>
            </div>
            <p className="text-[11px] text-slate-500">Copia las páginas y widgets del rol seleccionado como punto de partida.</p>
          </div>
        )}

        <div className="flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/[0.04] transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-black text-sm font-bold transition-all shadow-[0_0_20px_rgba(163,230,53,0.2)] disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                <span>Guardando...</span>
              </>
            ) : (
              <span>{initialData ? 'Guardar cambios' : 'Crear rol'}</span>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
