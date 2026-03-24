import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/VALUATION-GAME/',
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000,
  },
})
