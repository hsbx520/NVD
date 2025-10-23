const CACHE = 'ncn-assets-v1';
const ASSETS = ['/game.jpeg'];
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS))));
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (ASSETS.includes(url.pathname)) {
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(resp => {
      const copy = resp.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return resp;
    })));
  }
});

