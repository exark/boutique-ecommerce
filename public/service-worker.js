/* eslint-disable no-undef */
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

workbox.routing.registerRoute(
  /\.(webp|jpg)$/i,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'product-images',
    plugins: [
      new workbox.expiration.ExpirationPlugin({ maxEntries: 300, maxAgeSeconds: 31536000 })
    ]
  })
);
