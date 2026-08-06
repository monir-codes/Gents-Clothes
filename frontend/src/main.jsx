import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async';
import axios from 'axios';
import './index.css'
import App from './App.jsx'

// In production, point to the live Vercel backend. In dev, it will use the Vite proxy if this is removed, 
// but setting it explicitly ensures Vercel frontend can talk to Vercel backend.
if (import.meta.env.PROD) {
  axios.defaults.baseURL = '';
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
)
