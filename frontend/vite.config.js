import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const apiTarget = process.env.VITE_API_TARGET || 'http://localhost:5000';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: apiTarget,
        changeOrigin: true,
      },
      '/uploads': {
        target: apiTarget,
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (/[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom)[\\/]/i.test(id)) {
              return 'vendor-react';
            }
            if (/[\\/]node_modules[\\/]chart\.js[\\/]/i.test(id)) {
              return 'vendor-charts';
            }
            if (/[\\/]node_modules[\\/]framer-motion[\\/]/i.test(id)) {
              return 'vendor-motion';
            }
            if (/[\\/]node_modules[\\/]lucide-react[\\/]/i.test(id)) {
              return 'vendor-icons';
            }
            return 'vendor-utils';
          }
        },
      },
    },
  },
});