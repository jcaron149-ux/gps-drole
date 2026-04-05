// GPS DRÔLE — Service Worker v1
// Caches: app shell + map tiles (offline support)
const CACHE_NAME = 'gps-drole-v15';
const TILE_CACHE = 'gps-drole-tiles-v1';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Exo+2:ital,wght@0,300;0,400;0,600;0,700;1,400&display=swap'
];

// Install: cache app shell
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(APP_SHELL);
    }).then(function() { self.skipWaiting(); })
  );
});

// Activate: clean old caches
self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE_NAME && k !== TILE_CACHE; })
            .map(function(k) { return caches.delete(k); })
      );
    }).then(function() { self.clients.claim(); })
  );
});

// Notification click: focus or open app
self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({type: 'window'}).then(function(cls) {
      if (cls.length) cls[0].focus();
      else clients.openWindow('/gps-drole/');
    })
  );
});

// Fetch: network-first for API, cache-first for tiles, stale-while-revalidate for app
self.addEventListener('fetch', function(e) {
  var url = e.request.url;

  // Map tiles: cache-first (offline maps!)
  if (url.indexOf('tile.openstreetmap.org') >= 0) {
    e.respondWith(
      caches.open(TILE_CACHE).then(function(cache) {
        return cache.match(e.request).then(function(cached) {
          if (cached) return cached;
          return fetch(e.request).then(function(resp) {
            if (resp.ok) cache.put(e.request, resp.clone());
            return resp;
          }).catch(function() {
            // Offline: return empty transparent tile
            return new Response('', { status: 200, headers: { 'Content-Type': 'image/png' } });
          });
        });
      })
    );
    return;
  }

  // Pages secondaires (logo, test, etc.) — toujours réseau direct, jamais le cache
  if (url.indexOf('logo-') >= 0 || url.indexOf('test-') >= 0 || url.indexOf('.svg') >= 0) {
    e.respondWith(fetch(e.request));
    return;
  }

  // OSRM/Nominatim/Photon API: network only (no cache)
  if (url.indexOf('router.project-osrm.org') >= 0 ||
      url.indexOf('nominatim.openstreetmap.org') >= 0 ||
      url.indexOf('photon.komoot.io') >= 0) {
    e.respondWith(fetch(e.request));
    return;
  }

  // App shell: network-first (get latest version, fallback to cache if offline)
  e.respondWith(
    fetch(e.request).then(function(resp) {
      if (resp.ok) {
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(e.request, resp.clone());
        });
      }
      return resp;
    }).catch(function() {
      return caches.match(e.request);
    })
  );
});
