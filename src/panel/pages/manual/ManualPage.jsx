import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Cargamos los archivos Markdown en bruto usando Vite (?raw)
import guiaAdmin from '../../data/manual/Guia_Admin.md?raw';
import guiaCliente from '../../data/manual/Guia_Cliente.md?raw';
import guiaDesarrollador from '../../data/manual/Guia_Desarrollador.md?raw';
import guiaLandingPage from '../../data/manual/Guia_Landing_Page.md?raw';
import guiaPortalClientes from '../../data/manual/Guia_Portal_Clientes.md?raw';

const DOCS = [
  { id: 'admin', title: '1. Administrador', content: guiaAdmin },
  { id: 'cliente', title: '2. Cliente', content: guiaCliente },
  { id: 'desarrollador', title: '3. Desarrollador', content: guiaDesarrollador },
  { id: 'landing', title: '4. Landing Page', content: guiaLandingPage },
  { id: 'portal', title: '5. Portal de Clientes', content: guiaPortalClientes },
];

export function ManualPage() {
  const [activeDoc, setActiveDoc] = useState(DOCS[0]);

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Sub-Sidebar */}
      <div className="w-64 bg-[#0c0e12] border-r border-white/[0.05] flex flex-col p-4 overflow-y-auto">
        <h2 className="text-lime-400 font-semibold text-lg mb-6">Manual de Usuario</h2>
        <div className="flex flex-col gap-2">
          {DOCS.map((doc) => (
            <button
              key={doc.id}
              onClick={() => setActiveDoc(doc)}
              className={`text-left px-4 py-2.5 rounded-lg text-sm transition-colors ${
                activeDoc.id === doc.id
                  ? 'bg-lime-500/10 text-lime-400 font-medium border border-lime-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]'
              }`}
            >
              {doc.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-[#090a0d] overflow-y-auto p-8 relative">
        <div className="max-w-4xl mx-auto">
          {/* Usamos un div con estilos directos para reemplazar Tailwind Typography que no está instalado */}
          <div className="prose-container text-slate-300">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({node, ...props}) => <h1 className="text-3xl font-bold text-white mb-6 border-b border-white/10 pb-4" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-2xl font-semibold text-white mt-10 mb-4 pb-2 border-b border-white/[0.05]" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-xl font-medium text-slate-200 mt-8 mb-3" {...props} />,
                p: ({node, ...props}) => <p className="leading-relaxed mb-4 text-slate-300" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc list-outside ml-6 mb-4 space-y-2 text-slate-300" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal list-outside ml-6 mb-4 space-y-2 text-slate-300" {...props} />,
                li: ({node, ...props}) => <li className="pl-1" {...props} />,
                a: ({node, ...props}) => <a className="text-lime-400 hover:underline" {...props} />,
                strong: ({node, ...props}) => <strong className="font-semibold text-white" {...props} />,
                code: ({node, inline, ...props}) => 
                  inline 
                    ? <code className="bg-white/5 text-lime-300 px-1.5 py-0.5 rounded text-sm font-mono" {...props} />
                    : <code className="block bg-[#15181e] text-slate-200 p-4 rounded-xl text-sm font-mono overflow-x-auto my-4 border border-white/[0.05]" {...props} />,
                blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-lime-500 bg-lime-500/5 py-2 pr-4 pl-6 my-6 rounded-r-xl italic text-slate-300" {...props} />
              }}
            >
              {activeDoc.content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
