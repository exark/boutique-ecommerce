import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { imagetools } from 'vite-imagetools';

export default defineConfig({
  plugins: [
    react(),
    imagetools({
      defaultDirectives: (url) => {
        if (url.searchParams.has('webp')) {
          return new URLSearchParams('format=webp&quality=80');
        }
        if (url.searchParams.has('avif')) {
          return new URLSearchParams('format=avif&quality=70');
        }
        return new URLSearchParams('quality=85');
      }
    }),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,jpg,jpeg,svg,webp,avif}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB limit
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/i\.imgur\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'imgur-images',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
              },
            },
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|webp|avif)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'local-images',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
              },
            },
          },
        ],
        cleanupOutdatedCaches: true,
      },
      manifest: {
        name: 'Solène Boutique',
        short_name: 'Solène',
        description: 'Boutique de mode élégante',
        theme_color: '#d16e8d',
        background_color: '#fff0f5',
        display: 'standalone',
        icons: [
          {
            src: '/logo_mobile.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/logo_mobile.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  build: {
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name].[hash][extname]',
        chunkFileNames: 'assets/js/[name].[hash].js',
        entryFileNames: 'assets/js/[name].[hash].js'
      }
    }
  }
});
