// Service Worker for Asset Caching and Offline Support
const CACHE_NAME = 'ibr-web-cache-v1';
const STATIC_CACHE_NAME = 'ibr-web-static-v1';
const RUNTIME_CACHE_NAME = 'ibr-web-runtime-v1';

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/images/',
  '/assets/',
  '/favicon.svg',
  '/robots.txt',
  '/sitemap-index.xml',
  '/opengraph.png',
];

// Cache strategies
const cacheStrategies = {
  networkFirst: async (request) => {
    try {
      const response = await caches.match(request);
      if (response) {
        return response;
      }

      const fetchResponse = await fetch(request);
      const cache = await caches.open(RUNTIME_CACHE_NAME);
      cache.put(request, fetchResponse.clone());
      return fetchResponse;
    } catch (error) {
      console.error('Network First strategy failed:', error);
      return caches.match(request);
    }
  },
  cacheFirst: async (request) => {
    try {
      const response = await caches.match(request);
      if (response) {
        return response;
      }

      const fetchResponse = await fetch(request);
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, fetchResponse.clone());
      return fetchResponse;
    } catch (error) {
      console.error('Cache First strategy failed:', error);
      return caches.match(request);
    }
  },
  staleWhileRevalidate: async (request) => {
    try {
      const response = await caches.match(request);
      if (response && response.headers.get('date')) {
        const cacheDate = new Date(response.headers.get('date'));
        const maxAge = 60 * 60 * 1000; // 1 hour
        const age = Date.now() - cacheDate.getTime();

        if (age < maxAge) {
          return response;
        }
      }

      const fetchResponse = await fetch(request);
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, fetchResponse.clone());
      return fetchResponse;
    } catch (error) {
      console.error('Stale While Revalidate strategy failed:', error);
      return caches.match(request);
    }
  },
  networkOnly: async (request) => {
    try {
      return await fetch(request);
    } catch (error) {
      console.error('Network Only strategy failed:', error);
      return caches.match(request);
    }
  },
};

// Install event listener
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );

  console.log('Service Worker installed');
});

// Activate event listener
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== STATIC_CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );

  console.log('Service Worker activated');
});

// Fetch event listener with caching
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url, self.location.origin);

  // Skip for non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Cache static assets
  if (STATIC_ASSETS.some((path) => url.pathname === path || url.pathname.startsWith(path))) {
    event.respondWith(cacheStrategies.cacheFirst(request));
    return;
  }

  // Cache images and media
  if (
    url.pathname.includes('/images/') ||
    url.pathname.includes('/assets/') ||
    url.pathname.match(/\.(png|jpg|jpeg|svg|webp|avif|gif|mp4|webm)$/)
  ) {
    event.respondWith(cacheStrategies.staleWhileRevalidate(request));
    return;
  }

  // Cache CSS and JS
  if (url.pathname.match(/\.(css|js|json|ico|svg)$/)) {
    event.respondWith(cacheStrategies.staleWhileRevalidate(request));
    return;
  }

  // Network first for other requests
  event.respondWith(cacheStrategies.networkFirst(request));
});
