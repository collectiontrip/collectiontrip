import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    open: true, // Automatically opens the app in the default browser
    hmr: { 
      overlay: true, // Enables error overlay in the browser
    },
    watch: {
      usePolling: true, // Ensures compatibility with certain environments
    },
    proxy: {
      '/media': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
