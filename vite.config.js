import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
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
