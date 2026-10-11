import { useState, useRef } from 'react';
import { supabase } from '../../../supabase';
import { useToast } from '../../components/ui/Toast';

export function PerfilPage({ profile, role }) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    company: profile?.company || '',
    phone: profile?.phone || '',
  });
  const [passwordData, setPasswordData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || null);
  const fileInputRef = useRef(null);
  const { addToast } = useToast();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          company: formData.company,
          phone: formData.phone,
          avatar_url: avatarUrl
        })
        .eq('id', profile.id);

      if (error) throw error;
      addToast('Perfil actualizado con éxito', 'success');
      // Option to force reload to update header
      setTimeout(() => window.location.reload(), 1000);
    } catch (err) {
      addToast('Error al actualizar el perfil: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (passwordData.password !== passwordData.confirmPassword) {
      addToast('Las contraseñas no coinciden', 'error');
      return;
    }
    if (passwordData.password.length < 6) {
      addToast('La contraseña debe tener al menos 6 caracteres', 'error');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.password
      });

      if (error) throw error;
      addToast('Contraseña actualizada con éxito', 'success');
      setPasswordData({ password: '', confirmPassword: '' });
    } catch (err) {
      addToast('Error al actualizar contraseña: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 2 * 1024 * 1024) {
      addToast('La imagen no debe superar los 2MB', 'error');
      return;
    }

    setLoading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${profile.id}-${Math.random()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('avatars').getPublicUrl(fileName);
      setAvatarUrl(data.publicUrl);
      
      // Auto-save just the avatar so user sees it quickly
      const { error: profileError } = await supabase.from('profiles').update({ avatar_url: data.publicUrl }).eq('id', profile.id);
      if (profileError) throw profileError;
      
      addToast('Avatar actualizado', 'success');
      setTimeout(() => window.location.reload(), 1000);
      
    } catch (err) {
      addToast('Error al subir imagen: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0c0e12] overflow-hidden">
      <header className="px-8 py-6 border-b border-white/[0.05] bg-[#0c0e12]/80 backdrop-blur-sm sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-white tracking-tight">Mi Perfil</h1>
        <p className="text-sm text-slate-400">Gestiona tu información personal y de seguridad.</p>
      </header>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Tabs */}
          <div className="w-full md:w-64 flex flex-col gap-2 shrink-0">
            <button 
              onClick={() => setActiveTab('general')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left ${activeTab === 'general' ? 'bg-lime-500/10 text-lime-400 border border-lime-500/20 font-semibold' : 'text-slate-400 hover:bg-white/[0.02] hover:text-slate-200 border border-transparent'}`}
            >
              <span className="material-symbols-outlined text-[20px]">person</span>
              General
            </button>
            <button 
              onClick={() => setActiveTab('seguridad')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left ${activeTab === 'seguridad' ? 'bg-lime-500/10 text-lime-400 border border-lime-500/20 font-semibold' : 'text-slate-400 hover:bg-white/[0.02] hover:text-slate-200 border border-transparent'}`}
            >
              <span className="material-symbols-outlined text-[20px]">lock</span>
              Seguridad
            </button>
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-[#13171e] border border-white/[0.05] rounded-3xl p-8">
            
            {activeTab === 'general' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-6 pb-8 border-b border-white/[0.05]">
                  <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-black/40 border border-lime-500/30 flex items-center justify-center shrink-0">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <span className="material-symbols-filled text-4xl text-slate-500 group-hover:text-lime-400 transition-colors">person</span>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="material-symbols-outlined text-white text-[24px]">photo_camera</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">Foto de Perfil</h3>
                    <p className="text-xs text-slate-400 mb-3">JPG, GIF o PNG. Tamaño máximo 2MB.</p>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                    <button onClick={() => fileInputRef.current?.click()} className="px-4 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-white transition-colors border border-white/[0.1]">
                      Subir nueva foto
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Nombre Completo</label>
                      <input 
                        type="text" 
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleInputChange}
                        className="w-full bg-[#0c0e12] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-lime-500/50 focus:bg-[#15181e] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Correo Electrónico</label>
                      <input 
                        type="email" 
                        value={profile.email}
                        disabled
                        className="w-full bg-[#0c0e12]/50 border border-white/[0.02] rounded-xl px-4 py-2.5 text-sm text-slate-500 cursor-not-allowed"
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Empresa</label>
                      <input 
                        type="text" 
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="w-full bg-[#0c0e12] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-lime-500/50 focus:bg-[#15181e] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Teléfono</label>
                      <input 
                        type="tel" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full bg-[#0c0e12] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-lime-500/50 focus:bg-[#15181e] transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button 
                    onClick={handleSaveProfile}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-black text-sm font-bold shadow-[0_0_15px_rgba(148,214,0,0.2)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
                    ) : (
                      <span className="material-symbols-outlined text-[20px]">save</span>
                    )}
                    Guardar Cambios
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'seguridad' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Cambiar Contraseña</h3>
                  <p className="text-xs text-slate-400 mb-6">Asegúrate de usar al menos 6 caracteres para tu nueva contraseña.</p>
                </div>

                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Nueva Contraseña</label>
                    <input 
                      type="password" 
                      name="password"
                      value={passwordData.password}
                      onChange={handlePasswordChange}
                      placeholder="••••••••"
                      className="w-full bg-[#0c0e12] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-lime-500/50 focus:bg-[#15181e] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Confirmar Contraseña</label>
                    <input 
                      type="password" 
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="••••••••"
                      className="w-full bg-[#0c0e12] border border-white/[0.06] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-lime-500/50 focus:bg-[#15181e] transition-colors"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    onClick={handleUpdatePassword}
                    disabled={loading || !passwordData.password}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white text-sm font-bold border border-white/[0.1] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Actualizar Contraseña
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
