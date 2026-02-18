import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /api\.tidesandcurrents\.noaa\.gov/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'tide-data',
              expiration: { maxEntries: 10, maxAgeSeconds: 86400 },
            },
          },
          {
            urlPattern: /api\.open-meteo\.com/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'wind-data',
              expiration: { maxEntries: 10, maxAgeSeconds: 43200 },
              networkTimeoutSeconds: 5,
            },
          },
          {
            urlPattern: /marine-api\.open-meteo\.com/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'marine-data',
              expiration: { maxEntries: 10, maxAgeSeconds: 43200 },
              networkTimeoutSeconds: 5,
            },
          },
          {
            urlPattern: /tile\.openstreetmap\.org/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'map-tiles',
              expiration: { maxEntries: 200, maxAgeSeconds: 604800 },
            },
          },
        ],
      },
      manifest: {
        name: 'Exuma Cuts Navigator',
        short_name: 'Cuts Nav',
        description: 'Tide and current guide for Exuma Cays cuts',
        theme_color: '#0c4a6e',
        background_color: '#f0f9ff',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
    }),
  ],
})
