import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Guess the Fake',
        short_name: 'Guess Fake',
        description: 'A family game where players find the fake statement.',
        theme_color: '#14532d',
        background_color: '#f8f5ed',
        display: 'standalone',
        categories: ['games', 'entertainment', 'family'],
        icons: [
          {
            src: 'assets/icons/icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,jpg,jpeg,webp,mp3,ico}'],
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024
      }
    })
  ],
  build: {
    sourcemap: true
  }
});
