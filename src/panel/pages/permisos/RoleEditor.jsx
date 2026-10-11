import { PermissionSection } from './PermissionSection';
import { QuickActionsPicker } from './QuickActionsPicker';
import { RolePreview } from './RolePreview';
import { getRoleColor } from '../../components/ui/roleColors';

export function RoleEditor({ role, adminData, drafts, onEdit, onDuplicate, onDelete }) {
  const { modules, widgets, quickActions } = adminData;
  const { modules: draftModules, setModules, widgets: draftWidgets, setWidgets, actions: draftActions, setActions } = drafts;

  // Filter modules
  const availableModules = modules.filter(m => m.access_mode === 'role' || m.access_mode === 'all');
  const inicioModule = modules.find(m => m.slug === 'inicio');
  
  // Quick Actions widget logic
  const qaWidget = widgets.find(w => w.slug === 'quick_actions');
  const isQaActive = qaWidget && draftWidgets.has(qaWidget.id);

  const color = getRoleColor(role.color);

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto h-full">
      {/* Editor Column */}
      <div className="flex-1 flex flex-col gap-8 min-w-0 pb-20">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-white/[0.06]">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color.bg} ${color.text}`}>
              <span className="material-symbols-outlined text-[32px]">{role.icon}</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">{role.name}</h2>
                {role.is_system && (
                  <span className="text-[10px] uppercase tracking-wider font-bold bg-white/10 text-slate-300 px-2 py-0.5 rounded-full">Sistema</span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1">{role.description || 'Sin descripción'}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button onClick={onEdit} className="w-9 h-9 rounded-xl border border-white/[0.06] hover:bg-white/[0.04] text-slate-400 hover:text-white flex items-center justify-center transition-colors" title="Editar detalles">
              <span className="material-symbols-outlined text-[18px]">edit</span>
            </button>
            <button onClick={onDuplicate} className="w-9 h-9 rounded-xl border border-white/[0.06] hover:bg-white/[0.04] text-slate-400 hover:text-white flex items-center justify-center transition-colors" title="Duplicar rol">
              <span className="material-symbols-outlined text-[18px]">content_copy</span>
            </button>
            {!role.is_system && (
              <button onClick={onDelete} className="w-9 h-9 rounded-xl border border-red-500/20 hover:bg-red-500/10 text-red-400 flex items-center justify-center transition-colors ml-2" title="Eliminar rol">
                <span className="material-symbols-outlined text-[18px]">delete</span>
              </button>
            )}
          </div>
        </div>

        {/* Permissions */}
        <div className="flex flex-col gap-10">
          <PermissionSection 
            title="Páginas del Menú" 
            items={availableModules} 
            draftSet={draftModules} 
            setDraftSet={setModules}
            forceActiveId={inicioModule?.id}
          />
          
          <div className="flex flex-col gap-3">
            <PermissionSection 
              title="Widgets del Dashboard" 
              items={widgets} 
              draftSet={draftWidgets} 
              setDraftSet={setWidgets}
            />
            
            {/* Quick Actions Picker */}
            {qaWidget && (
              <QuickActionsPicker 
                actions={quickActions}
                draftActions={draftActions}
                setDraftActions={setActions}
                isWidgetActive={isQaActive}
              />
            )}
          </div>
        </div>

      </div>

      {/* Preview Column */}
      <div className="w-full lg:w-80 flex-shrink-0 lg:sticky lg:top-0 h-fit pb-20">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Vista Previa</h3>
        <RolePreview 
          role={role}
          color={color}
          modules={availableModules.filter(m => draftModules.has(m.id) || m.id === inicioModule?.id)}
          widgets={widgets.filter(w => draftWidgets.has(w.id))}
          actionsCount={draftActions.size}
        />
      </div>
    </div>
  );
}
