import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // This proxy configuration is the key to fixing the issue.
    // It tells the Vite development server how to handle API requests.
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
