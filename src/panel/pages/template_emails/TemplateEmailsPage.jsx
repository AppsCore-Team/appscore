import { useState, useEffect, useMemo, useRef } from 'react';
import { supabase } from '../../../supabase';
import { useToast } from '../../components/ui/Toast';
import { Modal } from '../../components/ui/Modal';
import { DEFAULT_TEMPLATES } from './defaultTemplates';

export function TemplateEmailsPage({ profile }) {
  const { addToast } = useToast();
  const textareaRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSlug, setActiveSlug] = useState('welcome');
  const [templates, setTemplates] = useState({});
  const [originalTemplates, setOriginalTemplates] = useState({});
  const [previewDevice, setPreviewDevice] = useState('desktop'); // 'desktop' | 'mobile'

  // Modals
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [testEmail, setTestEmail] = useState(profile?.email || '');
  const [testName, setTestName] = useState(profile?.full_name || 'Admin AppsCore');
  const [sendingTest, setSendingTest] = useState(false);
  const [copiedVar, setCopiedVar] = useState(null);

  // Fetch templates from database
  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('email_templates')
        .select('*');

      if (error) {
        console.error('Error al cargar plantillas:', error);
        addToast('No se pudieron cargar las plantillas de la base de datos.', 'error');
      }

      const map = {};
      const originalMap = {};

      // Seed from DB or defaults
      Object.keys(DEFAULT_TEMPLATES).forEach(slug => {
        const found = data?.find(item => item.slug === slug);
        const tpl = found
          ? {
              id: found.id,
              slug: found.slug,
              name: found.name || DEFAULT_TEMPLATES[slug].name,
              description: found.description || DEFAULT_TEMPLATES[slug].description,
              subject: found.subject || DEFAULT_TEMPLATES[slug].subject,
              html_content: found.html_content || DEFAULT_TEMPLATES[slug].html_content,
              available_variables: found.available_variables || DEFAULT_TEMPLATES[slug].available_variables,
              updated_at: found.updated_at
            }
          : { ...DEFAULT_TEMPLATES[slug] };

        map[slug] = tpl;
        originalMap[slug] = { ...tpl };
      });

      setTemplates(map);
      setOriginalTemplates(originalMap);
    } catch (err) {
      console.error('Error inesperado al cargar plantillas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const activeTemplate = templates[activeSlug] || DEFAULT_TEMPLATES[activeSlug];
  const originalActiveTemplate = originalTemplates[activeSlug];

  const isDirty = useMemo(() => {
    if (!activeTemplate || !originalActiveTemplate) return false;
    return (
      activeTemplate.subject !== originalActiveTemplate.subject ||
      activeTemplate.html_content !== originalActiveTemplate.html_content
    );
  }, [activeTemplate, originalActiveTemplate]);

  // Handle field change
  const handleChange = (field, value) => {
    setTemplates(prev => ({
      ...prev,
      [activeSlug]: {
        ...prev[activeSlug],
        [field]: value
      }
    }));
  };

  // Insert variable at cursor in HTML editor
  const insertVariable = (varKey) => {
    const textToInsert = `{{${varKey}}}`;
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = activeTemplate.html_content || '';
    const newText = currentText.substring(0, start) + textToInsert + currentText.substring(end);

    handleChange('html_content', newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + textToInsert.length, start + textToInsert.length);
    }, 50);

    addToast(`Variable {{${varKey}}} insertada`, 'success');
  };

  // Copy variable to clipboard
  const copyVariable = (varKey) => {
    navigator.clipboard.writeText(`{{${varKey}}}`);
    setCopiedVar(varKey);
    addToast(`{{${varKey}}} copiado al portapapeles`, 'success');
    setTimeout(() => setCopiedVar(null), 2000);
  };

  // Save changes to Supabase
  const handleSave = async () => {
    if (!activeTemplate) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('email_templates')
        .upsert({
          slug: activeSlug,
          name: activeTemplate.name,
          description: activeTemplate.description,
          subject: activeTemplate.subject,
          html_content: activeTemplate.html_content,
          available_variables: activeTemplate.available_variables,
          updated_at: new Date().toISOString()
        }, { onConflict: 'slug' });

      if (error) {
        throw error;
      }

      setOriginalTemplates(prev => ({
        ...prev,
        [activeSlug]: { ...activeTemplate, updated_at: new Date().toISOString() }
      }));

      addToast('Plantilla guardada exitosamente.', 'success');
    } catch (err) {
      console.error('Error al guardar plantilla:', err);
      addToast('Error al guardar la plantilla: ' + (err.message || 'Error desconocido'), 'error');
    } finally {
      setSaving(false);
    }
  };

  // Reset to default template
  const handleConfirmReset = () => {
    const defaultTpl = DEFAULT_TEMPLATES[activeSlug];
    if (!defaultTpl) return;

    handleChange('subject', defaultTpl.subject);
    handleChange('html_content', defaultTpl.html_content);
    setIsResetModalOpen(false);
    addToast('Plantilla restablecida a los valores predeterminados (recuerda Guardar).', 'info');
  };

  // Generate live preview HTML with replaced variables
  const previewHtml = useMemo(() => {
    if (!activeTemplate?.html_content) return '';
    let html = activeTemplate.html_content;
    const sampleData = DEFAULT_TEMPLATES[activeSlug]?.sample_data || {};

    Object.entries(sampleData).forEach(([key, val]) => {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      html = html.replace(regex, val);
    });

    return html;
  }, [activeTemplate, activeSlug]);

  // Send test email
  const handleSendTestEmail = async () => {
    if (!testEmail || !testEmail.includes('@')) {
      addToast('Por favor ingresa un correo de destino válido.', 'error');
      return;
    }

    setSendingTest(true);
    try {
      const sampleData = DEFAULT_TEMPLATES[activeSlug]?.sample_data || {};
      let compiledSubject = activeTemplate.subject || 'Prueba de Plantilla';
      let compiledHtml = activeTemplate.html_content || '';

      Object.entries(sampleData).forEach(([key, val]) => {
        const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
        compiledSubject = compiledSubject.replace(regex, val);
        compiledHtml = compiledHtml.replace(regex, val);
      });

      const { data, error } = await supabase.functions.invoke('send-test-email', {
        body: {
          to_email: testEmail,
          to_name: testName,
          subject: `[PRUEBA] ${compiledSubject}`,
          html_content: compiledHtml
        }
      });

      if (error) {
        throw error;
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      addToast(`Correo de prueba enviado con éxito a ${testEmail}. Revisa tu bandeja de entrada o Spam.`, 'success');
      setIsTestModalOpen(false);
    } catch (err) {
      console.error('Error al enviar correo de prueba:', err);
      addToast('Error al enviar correo: ' + (err.message || 'Error en Edge Function'), 'error');
    } finally {
      setSendingTest(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[500px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-lime-500/30 border-t-lime-500 rounded-full animate-spin"></div>
          <span className="text-xs text-slate-400">Cargando plantillas de correo...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto w-full">
      {/* Encabezado Principal */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-lime-500/10 border border-lime-500/20 flex items-center justify-center text-lime-400">
              <span className="material-symbols-filled text-2xl">mark_email_read</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Template Emails</h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Personaliza el asunto y el diseño HTML de los correos transaccionales enviados por Brevo.
              </p>
            </div>
          </div>
        </div>

        {/* Acciones Superiores */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setIsResetModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.08] text-xs font-semibold transition-all"
            title="Restablecer plantilla al diseño original"
          >
            <span className="material-symbols-outlined text-[18px]">history</span>
            <span>Restablecer por Defecto</span>
          </button>

          <button
            onClick={() => setIsTestModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-semibold transition-all shadow-[0_0_15px_rgba(6,182,212,0.12)]"
            title="Enviar un correo de prueba real a tu bandeja"
          >
            <span className="material-symbols-outlined text-[18px]">forward_to_inbox</span>
            <span>Enviar Correo de Prueba</span>
          </button>

          <button
            onClick={handleSave}
            disabled={saving || !isDirty}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-lg ${
              isDirty
                ? 'bg-gradient-to-r from-lime-500 to-lime-400 hover:from-lime-400 hover:to-lime-300 text-black shadow-lime-500/20 hover:scale-[1.02]'
                : 'bg-white/[0.05] text-slate-500 border border-white/[0.06] cursor-not-allowed'
            }`}
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                <span>Guardando...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">save</span>
                <span>{isDirty ? 'Guardar Cambios' : 'Guardado'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tabs Selector de Plantillas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {Object.entries(DEFAULT_TEMPLATES).map(([slug, tpl]) => {
          const isSelected = activeSlug === slug;
          const currentTpl = templates[slug] || tpl;
          const isTemplateDirty =
            currentTpl.subject !== originalTemplates[slug]?.subject ||
            currentTpl.html_content !== originalTemplates[slug]?.html_content;

          return (
            <button
              key={slug}
              onClick={() => setActiveSlug(slug)}
              className={`flex flex-col text-left p-4 rounded-2xl border transition-all relative overflow-hidden ${
                isSelected
                  ? 'bg-[#151a22] border-lime-500/50 shadow-[0_4px_25px_rgba(148,214,0,0.12)]'
                  : 'bg-[#0f1217]/70 border-white/[0.05] hover:bg-[#13171e] hover:border-white/[0.12]'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1.5">
                <div className="flex items-center gap-2">
                  <span className={`material-symbols-outlined text-[20px] ${isSelected ? 'text-lime-400' : 'text-slate-400'}`}>
                    {slug === 'welcome' ? 'waving_hand' : slug === 'invite' ? 'mail_lock' : 'contact_mail'}
                  </span>
                  <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                    {tpl.name}
                  </span>
                </div>
                {isTemplateDirty && (
                  <span className="flex h-2 w-2 relative" title="Cambios sin guardar">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-lime-500"></span>
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                {tpl.description}
              </p>
              <div className="mt-3 pt-2.5 border-t border-white/[0.04] flex items-center justify-between text-[10px] text-slate-500">
                <span className="font-mono">slug: {slug}</span>
                <span>{tpl.available_variables?.length || 0} variables</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Tarjeta de Configuración y Variables */}
      <div className="bg-[#12151b] border border-white/[0.06] rounded-2xl p-5 space-y-4">
        {/* Asunto */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-lime-400 text-[16px]">title</span>
              Asunto del Correo (Subject)
            </label>
            <span className="text-[11px] text-slate-500">
              {activeTemplate?.subject?.length || 0} caracteres
            </span>
          </div>
          <input
            type="text"
            value={activeTemplate?.subject || ''}
            onChange={(e) => handleChange('subject', e.target.value)}
            placeholder="Escribe el asunto del correo..."
            className="w-full bg-[#0a0c10] border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-lime-500/50 transition-colors"
          />
        </div>

        {/* Variables Disponibles */}
        <div className="pt-2 border-t border-white/[0.04]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-lime-400 text-[15px]">data_object</span>
              Variables Dinámicas Disponibles (haz clic para copiar o insertar):
            </span>
            <span className="text-[10px] text-slate-500">
              Reemplazadas automáticamente al enviar
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {activeTemplate?.available_variables?.map(v => (
              <div
                key={v.key}
                className="group flex items-center bg-[#181d26] hover:bg-lime-950/40 border border-white/[0.08] hover:border-lime-500/40 rounded-lg pl-2.5 pr-1 py-1 transition-all"
              >
                <div 
                  onClick={() => copyVariable(v.key)}
                  className="cursor-pointer flex items-center gap-1.5"
                  title={`${v.description} (clic para copiar)`}
                >
                  <code className="text-[11px] font-mono text-lime-400 font-bold">
                    {`{{${v.key}}}`}
                  </code>
                  <span className="text-[10px] text-slate-400 group-hover:text-slate-300 hidden sm:inline">
                    · {v.description}
                  </span>
                </div>

                <div className="flex items-center ml-2 border-l border-white/[0.08] pl-1 gap-0.5">
                  <button
                    onClick={() => copyVariable(v.key)}
                    className="p-1 hover:text-lime-300 text-slate-400 transition-colors"
                    title="Copiar etiqueta"
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      {copiedVar === v.key ? 'check' : 'content_copy'}
                    </span>
                  </button>
                  <button
                    onClick={() => insertVariable(v.key)}
                    className="p-1 hover:text-lime-300 text-slate-400 transition-colors"
                    title="Insertar en editor HTML"
                  >
                    <span className="material-symbols-outlined text-[14px]">add_circle</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dual Column: Editor de Código HTML y Vista Previa */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        {/* Columna Izquierda: Editor HTML */}
        <div className="bg-[#12151b] border border-white/[0.06] rounded-2xl overflow-hidden flex flex-col shadow-xl">
          <div className="flex items-center justify-between px-4 py-3 bg-[#0a0c10] border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-lime-400 text-[18px]">html</span>
              <span className="text-xs font-bold text-white tracking-wide">Editor de Plantilla HTML</span>
              {isDirty && (
                <span className="px-2 py-0.5 rounded-full bg-lime-500/20 text-lime-400 text-[10px] font-semibold border border-lime-500/30">
                  Modificado
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(activeTemplate?.html_content || '');
                  addToast('Código HTML copiado al portapapeles', 'success');
                }}
                className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white text-[11px] font-medium flex items-center gap-1.5 transition-colors"
              >
                <span className="material-symbols-outlined text-[14px]">content_copy</span>
                <span>Copiar HTML</span>
              </button>
            </div>
          </div>

          <div className="p-2 bg-[#090b0e]">
            <textarea
              ref={textareaRef}
              value={activeTemplate?.html_content || ''}
              onChange={(e) => handleChange('html_content', e.target.value)}
              placeholder="Escribe el código HTML de tu plantilla..."
              spellCheck={false}
              className="w-full h-[620px] bg-transparent text-slate-200 font-mono text-[11px] leading-relaxed p-4 focus:outline-none resize-none selection:bg-lime-500/30 selection:text-white overflow-y-auto"
              style={{ tabSize: 2 }}
            />
          </div>

          <div className="px-4 py-2 bg-[#0a0c10] border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Líneas: {(activeTemplate?.html_content || '').split('\n').length}</span>
            <span>Bytes: {new Blob([activeTemplate?.html_content || '']).size} B</span>
          </div>
        </div>

        {/* Columna Derecha: Vista Previa en Vivo */}
        <div className="bg-[#12151b] border border-white/[0.06] rounded-2xl overflow-hidden flex flex-col shadow-xl">
          <div className="flex items-center justify-between px-4 py-3 bg-[#0a0c10] border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-cyan-400 text-[18px]">visibility</span>
              <span className="text-xs font-bold text-white tracking-wide">Vista Previa Interactiva</span>
              <span className="text-[11px] text-slate-500 hidden sm:inline">(Datos de Demostración)</span>
            </div>

            {/* Selector de Dispositivo */}
            <div className="flex items-center bg-[#15181e] p-0.5 rounded-lg border border-white/[0.06]">
              <button
                onClick={() => setPreviewDevice('desktop')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-semibold transition-all ${
                  previewDevice === 'desktop'
                    ? 'bg-lime-500 text-black shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">desktop_windows</span>
                <span>Escritorio (700px)</span>
              </button>
              <button
                onClick={() => setPreviewDevice('mobile')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-semibold transition-all ${
                  previewDevice === 'mobile'
                    ? 'bg-lime-500 text-black shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">smartphone</span>
                <span>Móvil (380px)</span>
              </button>
            </div>
          </div>

          {/* Contenedor del Iframe de Vista Previa */}
          <div className="p-4 bg-[#07080b] flex items-center justify-center min-h-[620px] overflow-hidden">
            <div
              className={`transition-all duration-300 bg-[#0f1218] rounded-xl overflow-hidden border border-white/[0.08] shadow-2xl flex flex-col ${
                previewDevice === 'mobile' ? 'w-[380px] h-[620px]' : 'w-full max-w-[720px] h-[620px]'
              }`}
            >
              {/* Barra simulada del navegador de correo */}
              <div className="bg-[#1a1f29] px-3 py-2 border-b border-white/[0.08] flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                </div>
                <div className="flex-1 text-center">
                  <span className="text-[10px] text-slate-300 font-medium truncate block max-w-[300px] mx-auto">
                    {activeTemplate?.subject || 'Sin Asunto'}
                  </span>
                </div>
              </div>

              {/* Iframe sandboxed */}
              <iframe
                title="Email Preview"
                srcDoc={previewHtml}
                className="w-full h-full border-0 bg-[#0f1218]"
                sandbox="allow-same-origin"
              />
            </div>
          </div>

          <div className="px-4 py-2 bg-[#0a0c10] border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-500">
            <span>Visualización renderizada con variables de prueba</span>
            <span className="text-lime-400">● Listo para envío</span>
          </div>
        </div>
      </div>

      {/* Modal: Restablecer por Defecto */}
      <Modal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        title="Restablecer Plantilla Original"
      >
        <div className="space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined text-2xl">warning</span>
          </div>

          <div className="text-center space-y-1.5">
            <h4 className="text-sm font-bold text-white">¿Estás seguro de restablecer esta plantilla?</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              El contenido de la plantilla <strong className="text-white">{activeTemplate?.name}</strong> volverá a su estado inicial de fábrica. Podrás revisar los cambios antes de presionar Guardar.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.06]">
            <button
              onClick={() => setIsResetModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 text-xs font-semibold transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmReset}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-colors"
            >
              Sí, Restablecer
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal: Enviar Correo de Prueba */}
      <Modal
        isOpen={isTestModalOpen}
        onClose={() => setIsTestModalOpen(false)}
        title="Enviar Correo de Prueba (Brevo)"
        maxWidth="max-w-lg"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-400 leading-relaxed">
            Se enviará un correo real utilizando la API de Brevo con el diseño actual de la plantilla{' '}
            <strong className="text-white">{activeTemplate?.name}</strong> y datos de demostración.
          </p>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Correo Electrónico de Destino *
              </label>
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="ejemplo@correo.com"
                className="w-full bg-[#0a0c10] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Nombre del Destinatario (Prueba)
              </label>
              <input
                type="text"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                placeholder="Juan Pérez"
                className="w-full bg-[#0a0c10] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            <div className="p-3 bg-white/[0.02] border border-white/[0.06] rounded-xl space-y-1">
              <span className="text-[11px] font-semibold text-slate-300 block">Asunto que se enviará:</span>
              <span className="text-xs text-cyan-300 block font-mono">
                [PRUEBA] {activeTemplate?.subject}
              </span>
            </div>

            <div className="p-3 bg-cyan-950/30 border border-cyan-500/20 rounded-xl text-[11px] text-cyan-200/90 flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[16px] text-cyan-400 mt-0.5 shrink-0">info</span>
              <div className="leading-relaxed">
                <strong className="text-cyan-300">Consejo de entrega:</strong> Para una recepción inmediata, ingresa tu correo personal (como Gmail o Outlook) y revisa también la carpeta de <em>Spam / Correo no deseado</em>.
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.06]">
            <button
              onClick={() => setIsTestModalOpen(false)}
              disabled={sendingTest}
              className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 text-xs font-semibold transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSendTestEmail}
              disabled={sendingTest}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white text-xs font-bold transition-all shadow-lg shadow-cyan-500/20"
            >
              {sendingTest ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Enviando por Brevo...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[16px]">send</span>
                  <span>Enviar Ahora</span>
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
