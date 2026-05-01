import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  },
  preview: {
    allowedHosts: [
      'frontend-production-ce95.up.railway.app',
      'ttaskmanager.up.railway.app'
    ]
  }
});
