import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    // Listen on every local network interface so phones/tablets on the
    // same Wi-Fi can open the Vite development server.
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,

    // Keep the browser API URL same-origin (/api). Vite forwards requests
    // to Express on this computer, so no LAN IP has to be hard-coded in React.
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
