import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  server: { port: 3001, strictPort: true },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      workbox: { globPatterns: ['**/*.{js,css,html,ico,png,svg,mp3,woff2}'], maximumFileSizeToCacheInBytes: 5000000 },
      registerType: 'autoUpdate',
      manifest: {
        name: 'Jigyasu Physics',
        short_name: 'Physics',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    }) as any
  ],
})
