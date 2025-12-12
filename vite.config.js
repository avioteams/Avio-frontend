import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 5173,
    proxy: {
      // Proxy all /api requests to backend
      '/api': {
        target: 'https://avio-backend-v6no.onrender.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path
      },
      // Proxy /system requests (for health check)
      '/system': {
        target: 'https://avio-backend-v6no.onrender.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path
      },
      // Proxy /auth requests
      '/auth': {
        target: 'https://avio-backend-v6no.onrender.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path
      }
    }
  }
  build: {
    outDir: 'dist',
    sourcemap: false,
    
    // Optimize bundle
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'web3': ['ethers']
        }
      }
    }
  }
})