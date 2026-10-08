import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const panelFallback = () => ({
  name: 'panel-spa-fallback',
  configureServer: (server) => {
    server.middlewares.use((req, res, next) => {
      if (req.url && req.url.startsWith('/panel/') && !req.url.includes('.')) {
        req.url = '/panel/index.html';
      }
      next();
    });
  },
  configurePreviewServer: (server) => {
    server.middlewares.use((req, res, next) => {
      if (req.url && req.url.startsWith('/panel/') && !req.url.includes('.')) {
        req.url = '/panel/index.html';
      }
      next();
    });
  }
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), panelFallback()],
  envPrefix: ['VITE_', 'SUPABASE_'],
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        clientes: 'clientes/index.html',
        panel: 'panel/index.html',
      }
    }
  }
})
