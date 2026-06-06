import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/cosmos/',
  
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'framer-motion': ['framer-motion'],
          'lucide': ['lucide-react']
        }
      }
    }
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      workbox: { globPatterns: ['**/*.{js,css,html,ico,png,svg,mp3,woff2}'], maximumFileSizeToCacheInBytes: 5000000 },
      registerType: 'autoUpdate',
      manifest: {
        name: 'Jigyasu Learn',
        short_name: 'Learn',
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as any
  ],
})
