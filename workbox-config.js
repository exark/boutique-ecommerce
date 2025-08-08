module.exports = {
  globDirectory: 'dist/',
  globPatterns: [
    '**/*.{html,js,css,png,jpg,jpeg,svg,webp,avif,woff,woff2}'
  ],
  swDest: 'dist/sw.js',
  skipWaiting: true,
  clientsClaim: true,
  cleanupOutdatedCaches: true,
  
  // Runtime caching strategies
  runtimeCaching: [
    {
      // Cache Imgur images with CacheFirst strategy
      urlPattern: /^https:\/\/i\.imgur\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'imgur-images-cache',
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
        cacheKeyWillBeUsed: async ({ request }) => {
          // Add daily cache bust for Imgur images
          const url = new URL(request.url);
          if (!url.searchParams.has('v')) {
            const dayStamp = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
            url.searchParams.set('v', dayStamp);
          }
          return url.href;
        },
        plugins: [
          {
            cacheWillUpdate: async ({ response }) => {
              // Only cache successful responses
              return response.status === 200;
            },
          },
        ],
      },
    },
    {
      // Cache local images with CacheFirst strategy
      urlPattern: /\.(?:png|jpg|jpeg|svg|webp|avif)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'local-images-cache',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
        },
      },
    },
    {
      // Cache API calls with NetworkFirst strategy
      urlPattern: /^https:\/\/api\./,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 5 * 60, // 5 minutes
        },
        networkTimeoutSeconds: 3,
      },
    },
    {
      // Cache Google Fonts with StaleWhileRevalidate
      urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'google-fonts-stylesheets',
      },
    },
    {
      // Cache Google Fonts files with CacheFirst
      urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts-webfonts',
        expiration: {
          maxEntries: 30,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
        },
      },
    },
  ],
  
  // Ignore certain files
  ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],
  
  // Manifest transformations
  manifestTransforms: [
    (manifestEntries) => {
      const manifest = manifestEntries.map((entry) => {
        // Add cache busting to critical resources
        if (entry.url.includes('index.html')) {
          entry.revision = Date.now().toString();
        }
        return entry;
      });
      return { manifest };
    },
  ],
};
