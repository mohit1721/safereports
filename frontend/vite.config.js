import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react() , tailwindcss()],
  server: {
    host: '0.0.0.0', // Make sure the app is accessible outside of the container
    port: 5173,      // Use port 5173, as you mentioned
  },
})
