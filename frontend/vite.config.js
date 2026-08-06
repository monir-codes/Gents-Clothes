import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://gent-fits-1do5.vercel.app',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'https://gent-fits-1do5.vercel.app',
        changeOrigin: true,
      },
      '/sitemap.xml': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  }
});
