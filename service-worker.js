const CACHE_NAME = 'boom-brawl-v1';
const ASSETS = [
  '/Boom-Brawl/',
  '/Boom-Brawl/index.html',
  '/Boom-Brawl/manifest.json',
  '/Boom-Brawl/icon-192x192.png',
  '/Boom-Brawl/icon-512x512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(c => c.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(names => Promise.all(names.filter(n => n !== CACHE_NAME).map(n => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request)
      .then(r => r || fetch(e.request)
        .then(resp => {
          if (resp && resp.status === 200 && resp.type === 'basic') {
            const clone = resp.clone();
            caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
          }
          return resp;
        })
        .catch(() => {
          if (e.request.mode === 'navigate') {
            return caches.match('/Boom-Brawl/');
          }
          return null;
        })
      )
  );
});
