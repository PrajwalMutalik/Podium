import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  preview: {
    port: 4173,
    host: '0.0.0.0',
    allowedHosts: [
      'podium-1.onrender.com', // Add this line
      'localhost',
      '127.0.0.1',
    ],
  },
  server: {
    proxy: {
      // Any request that starts with "/api" will be forwarded.
      '/api': {
        // The target is your backend Express server.
        target: 'http://localhost:5001',
        // This is necessary for the server to accept the request.
        changeOrigin: true,
        // This line is optional but can be helpful for debugging.
        secure: false,
      },
    },
  },
});