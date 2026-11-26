import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Optimize the lazy CommonJS dependency at dev startup to avoid a first-use reload.
  optimizeDeps: { include: ['howler'] },
})
