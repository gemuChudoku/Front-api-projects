import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
  base: './',  // ← Esto cambia las rutas a relativas
  server: {
    port: 3000
  }
})