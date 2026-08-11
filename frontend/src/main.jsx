import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async';
import axios from 'axios';
import './index.css'
import App from './App.jsx'

// In production, point to the live Vercel backend using the env variable.
if (import.meta.env.PROD) {
  // Hardcoded to ensure Vercel's outdated env variables don't override this
  axios.defaults.baseURL = 'https://gents-clothes-server.vercel.app';
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
)
