import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
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
      registerType: 'autoUpdate',
      workbox: {
        // Cache all static assets including audio files
        globPatterns: ['**/*.{js,css,html,ico,png,svg,mp3,woff2,webp}'],
        maximumFileSizeToCacheInBytes: 50_000_000,
        // All navigation requests fall back to index.html for client-side routing,
        // EXCEPT api calls — those must reach the network.
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api/],
        runtimeCaching: [
          {
            // Images: serve from cache first, revalidate in background (30-day shelf life)
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'jigyasu-images',
              expiration: {
                maxEntries: 150,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            // Audio files: cache first for offline playback
            urlPattern: /\.(?:mp3|wav|ogg|m4a)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'jigyasu-audio',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 90, // 90 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            // Fonts: cache first, long shelf life
            urlPattern: /\.(?:woff|woff2|ttf|otf|eot)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'jigyasu-fonts',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            // JavaScript and CSS: stale while revalidate
            urlPattern: /\.(?:js|css)$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'jigyasu-static',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            // API calls: network first with cache fallback
            urlPattern: /^https:\/\/api\./,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'jigyasu-api',
              networkTimeoutSeconds: 10,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60, // 1 hour
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            // External CDN resources: cache first
            urlPattern: /^https:\/\/cdn\./,
            handler: 'CacheFirst',
            options: {
              cacheName: 'jigyasu-cdn',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
        // Skip waiting for new service worker to activate immediately
        skipWaiting: true,
        // Clients claim immediately
        clientsClaim: true,
      },
      manifest: {
        name: 'Jigyasu',
        short_name: 'Jigyasu',
        description: 'Free visual STEM learning for every child in India. Works offline. 6 Indian languages.',
        theme_color: '#4F46E5',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        lang: 'en-IN',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            // 'any maskable' allows Android to apply adaptive icon shaping
            purpose: 'any maskable',
          },
        ],
      },
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/learnos'),
    },
  },
  server: {
    headers: {
      // Content Security Policy - Strict but functional for Jigyasu
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' https://plausible.io; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://plausible.io; media-src 'self' data:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none';",
      // Prevent clickjacking
      'X-Frame-Options': 'DENY',
      // Prevent MIME type sniffing
      'X-Content-Type-Options': 'nosniff',
      // Enable XSS protection (modern browsers have built-in protection)
      'X-XSS-Protection': '1; mode=block',
      // Control referrer information
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      // Permissions Policy - Restrict browser features
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    },
    proxy: {
      '/physics': { target: 'http://localhost:3001', changeOrigin: true },
      '/toys': { target: 'http://localhost:3002', changeOrigin: true },
      '/camp': { target: 'http://localhost:3007', changeOrigin: true },
      '/bio': { target: 'http://localhost:3003', changeOrigin: true },
      '/biology': { target: 'http://localhost:3003', changeOrigin: true },
      '/math': { target: 'http://localhost:3004', changeOrigin: true },
      '/chem': { target: 'http://localhost:3005', changeOrigin: true },
      '/chemistry': { target: 'http://localhost:3005', changeOrigin: true },
      '/cosmos': { target: 'http://localhost:3006', changeOrigin: true },
    }
  }
})
