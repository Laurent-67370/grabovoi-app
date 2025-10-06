const CACHE_NAME = 'grabovoi-app-cache-v1';
const FILES_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './exercises.json',
  './icon-192x192.png',
  './icon-512x512.png'
];

// Installation du Service Worker et mise en cache des fichiers de l'application
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache ouvert');
        return cache.addAll(FILES_TO_CACHE);
      })
  );
});

// Stratégie "Cache d'abord"
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Si la réponse est dans le cache, on la retourne
        if (response) {
          return response;
        }
        // Sinon, on la récupère sur le réseau, on la met en cache et on la retourne
        return fetch(event.request).then(
          (networkResponse) => {
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            return networkResponse;
          }
        );
      })
  );
});