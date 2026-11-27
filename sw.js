// Daily Doggo offline worker: the app and all its pictures open with no internet; new dog photos need a connection.
const CACHE = 'doggo-v2';
const PLACES = ["park-wheel.webp", "park-stand.webp", "park-car.webp", "park-b_balloon.webp", "park-b_rings.webp", "park-b_gopher.webp", "park-b_cups.webp", "park-b_prize.webp", "park-bl_red.webp", "park-bl_blue.webp", "park-bl_yellow.webp", "park-bl_green.webp", "park-bl_purple.webp", "park-storm.webp", "park-ring.webp", "park-bottle.webp", "park-gopher.webp", "park-hole.webp", "park-cup.webp", "park-teddy.webp", "park-bunny.webp", "park-unicorn.webp", "park-balloondog.webp", "park-cotton.webp", "park-lolly.webp", "park-pinwheel.webp", "park-trophy.webp", "park-h_balloon.webp", "park-h_cotton.webp", "park-h_pinwheel.webp", "park-bg.jpg", "bl-c_tower.webp", "bl-c_square.webp", "bl-c_wall.webp", "bl-c_gate.webp", "bl-c_flag.webp", "bl-c_bucket.webp", "bl-c_spade.webp", "bl-c_seaweed.webp", "bl-c_shell.webp", "bl-c_star.webp", "bl-c_moat.webp", "bl-sh_conch.webp", "bl-sh_scallop.webp", "bl-sh_mussel.webp", "bl-sh_spiral.webp", "bl-sh_seaglass.webp", "bl-sh_crab.webp", "bl-sh_bottle.webp", "bl-sh_coral.webp", "bl-sh_pearl.webp", "bl-sh_golden.webp", "bl-board.webp", "bl-wave.webp", "bl-mound.webp", "bl-hole2.webp", "bl-gull.webp", "bl-ball.webp", "bl-h_sun.webp", "bl-boat.webp", "bl-rod.webp", "bl-bobber.webp", "bl-splash.webp", "bl-f_trout.webp", "bl-f_bass.webp", "bl-f_sunfish.webp", "bl-f_catfish.webp", "bl-f_bluefish.webp", "bl-f_redfish.webp", "bl-f_golden.webp", "bl-f_frog.webp", "bl-f_turtle.webp", "bl-f_crayfish.webp", "bl-f_boot.webp", "bl-f_duck.webp", "bl-f_chest.webp", "bl-mamaduck.webp", "bl-duckling.webp", "bl-crumb.webp", "bl-lilypad.webp", "bl-ripple.webp", "bl-h_fish.webp", "bl-sh_sanddollar.webp", "bl-sh_starfish.webp", "bl-beachbg.jpg", "bl-lakebg.jpg"];
const PICS = ['hero.jpg','icon.png','snow-pup.jpg','weather-pup.jpg','world-map.jpg','tile-world.jpg','tile-today.jpg','tile-pet.jpg','tile-art.jpg','tile-album.jpg','tile-games.jpg','tile-favs.jpg','tile-bank.jpg','tile-parent.jpg',
  ...['editor','explorer','chef','reader','gamer','artist','snow','hiker','bow','cool','spring','photo','tent','fire','plane','cave','bebe','bebebig'].map(k => `world-${k}.webp`), ...PLACES].map(f => 'images/' + f);
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
