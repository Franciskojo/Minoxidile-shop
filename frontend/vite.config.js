import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteCompression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    react(),
    viteCompression({ algorithm: 'brotliCompress' }), // Compress output for prod
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          // React core
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // Redux / RTK
          'vendor-redux': ['@reduxjs/toolkit', 'react-redux'],
          // UI libraries
          'vendor-ui': ['react-hot-toast', 'react-icons', '@headlessui/react'],
          // Data viz
          'vendor-charts': ['recharts'],
          // Networking
          // 'vendor-axios': ['axios'], // axios is used via RTK Query internally - skip
          // Socket
          'vendor-socket': ['socket.io-client'],
        },
      },
    },
  },
});
