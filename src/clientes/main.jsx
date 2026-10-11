import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import '../index.css'
import { ClientesPage } from './ClientesPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClientesPage />
    <Analytics />
  </StrictMode>,
)
