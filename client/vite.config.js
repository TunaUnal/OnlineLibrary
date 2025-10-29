import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react() ],
  port: 80,      // varsayılan HTTP portu
  strictPort: true,  // eğer 80 meşgulse hata ver
  host: false,    // tüm ağ arayüzlerinde dinle
  server: {
    proxy: {
      '/api': 'http://localhost/server'
    }
  },
})