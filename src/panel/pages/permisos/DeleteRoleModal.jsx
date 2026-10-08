import { useState, useEffect } from 'react';
import { Modal } from '../../components/ui/Modal';

export function DeleteRoleModal({ isOpen, onClose, onSubmit, isSubmitting, roleToDelete, roles, usersCount }) {
  const [reassignTo, setReassignTo] = useState('');

  useEffect(() => {
    if (isOpen) {
      setReassignTo('');
      // Auto-select first available alternative role if users need reassignment
      if (usersCount > 0) {
        const firstAlt = roles.find(r => r.id !== roleToDelete?.id);
        if (firstAlt) setReassignTo(firstAlt.id);
      }
    }
  }, [isOpen, roleToDelete, roles, usersCount]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(reassignTo);
  };

  if (!roleToDelete) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Eliminar rol">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        
        <div className="flex flex-col gap-3">
          <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mx-auto mb-2">
            <span className="material-symbols-outlined text-[24px]">warning</span>
          </div>
          
          <p className="text-sm text-slate-300 text-center leading-relaxed">
            ¿Estás seguro de que quieres eliminar el rol <span className="font-bold text-white">{roleToDelete.name}</span>?
            Esta acción no se puede deshacer.
          </p>
        </div>

        {usersCount > 0 && (
          <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 flex flex-col gap-3">
            <p className="text-xs text-red-200">
              Hay <strong className="text-red-400">{usersCount} {usersCount === 1 ? 'usuario' : 'usuarios'}</strong> con este rol.
              Debes reasignarlos a otro rol antes de eliminarlo.
            </p>
            
            <div className="flex flex-col gap-2 mt-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Reasignar usuarios a</label>
              <div className="relative">
                <select
                  required
                  value={reassignTo}
                  onChange={(e) => setReassignTo(e.target.value)}
                  className="w-full bg-[#0c0e12] border border-white/[0.06] rounded-xl pl-4 pr-10 py-3 text-sm text-slate-200 focus:outline-none focus:border-red-500/50 transition-colors appearance-none"
                >
                  <option value="" disabled>Selecciona un rol...</option>
                  {roles.filter(r => r.id !== roleToDelete.id).map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">expand_more</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 mt-2">
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
            disabled={isSubmitting || (usersCount > 0 && !reassignTo)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-red-500 hover:bg-red-400 text-white text-sm font-bold transition-all shadow-[0_0_20px_rgba(239,68,68,0.2)] disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Eliminando...</span>
              </>
            ) : (
              <span>Eliminar rol</span>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
