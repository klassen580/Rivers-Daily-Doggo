// Daily Doggo offline worker: the app and all its pictures open with no internet; new dog photos need a connection.
const CACHE = 'doggo-v1';
const PICS = ['hero.jpg','icon.png','snow-pup.jpg','weather-pup.jpg','world-map.jpg','tile-world.jpg','tile-today.jpg','tile-pet.jpg','tile-art.jpg','tile-album.jpg','tile-games.jpg','tile-favs.jpg','tile-bank.jpg','tile-parent.jpg',
  ...['editor','explorer','chef','reader','gamer','artist','snow','hiker','bow','cool','spring','photo','tent','fire','plane','cave','bebe','bebebig'].map(k => `world-${k}.webp`)].map(f => 'images/' + f);
const SHELL = ['./', 'index.html', 'money-monsters.html', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-180.png', ...PICS];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
const fresh = async req => {
  try { const r = await fetch(req); if (r && r.ok) { const c = await caches.open(CACHE); c.put(req, r.clone()); } return r; }
  catch (e) { const hit = await caches.match(req, {ignoreSearch: true}); if (hit) return hit; if (req.mode === 'navigate') return caches.match('index.html'); throw e; }
};
const saved = async req => { const hit = await caches.match(req); if (hit) return hit; const r = await fetch(req); if (r && (r.ok || r.type === 'opaque')) { const c = await caches.open(CACHE); c.put(req, r.clone()); } return r; };
self.addEventListener('fetch', e => {
  const req = e.request; if (req.method !== 'GET') return;
  const u = new URL(req.url);
  if (u.origin === location.origin) { e.respondWith(/\/images\/|\/icons\//.test(u.pathname) ? saved(req) : fresh(req)); return; }
  if (/fonts\.(googleapis|gstatic)\.com/.test(u.hostname)) { e.respondWith(saved(req)); return; }
});
