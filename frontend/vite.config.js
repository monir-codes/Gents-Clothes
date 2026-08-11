import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://gents-clothes-server.vercel.app',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'https://gents-clothes-server.vercel.app',
        changeOrigin: true,
      }
    }
  }
});
