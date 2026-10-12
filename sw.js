/**
 * Service Worker for Terminal Decoder
 * Provides offline caching and PWA support
 */

const CACHE_NAME = 'terminal-decoder-v3';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './parser.js',
  './commands.json',
  './favicon.png',
  './manifest.json'
];

// Install event — precache core assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activate event — clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event — Stale-While-Revalidate strategy
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Skip non-GET requests and analytics tracking scripts
  if (event.request.method !== 'GET' || url.pathname.includes('/_vercel/')) {
    return;
  }

  event.respondWith(
    (async () => {
      const cachedResponse = await caches.match(event.request);

      const fetchPromise = (async () => {
        try {
          const networkResponse = await fetch(event.request);
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            const cache = await caches.open(CACHE_NAME);
            await cache.put(event.request, responseToCache);
          }
          return networkResponse;
        } catch (_) {
          return cachedResponse;
        }
      })();

      return cachedResponse || (await fetchPromise);
    })()
  );
});
