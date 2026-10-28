// Bump VERSION whenever any cached file changes so phones pick up the new copy
const VERSION = 'miyeea-v25';
const FILES = ['./', 'data/media.js', 'whisper-worker.js', 'voice.js', 'fonts/Amiri-400.woff2', 'fonts/Amiri-700.woff2', 'fonts/NotoKufiArabic-400.woff2', 'fonts/NotoKufiArabic-500_800.woff2', 'srs.js', 'ui.js', 'ui.css', 'home.html', 'home.js', 'index.html', 'munajat.html', 'shatibiyya.html', 'jazariyya.html', 'data/jazariyya.js', 'qudouri.html', 'prose.css', 'prose-engine.js', 'data/riyad.js', 'data/shatibiyya.js', 'data/qudouri.js', 'app.css', 'engine.js', 'data/miyeea.js', 'data/munajat.js', 'data/munajat-expl.js', 'riyad.html', 'riyad91-sharh.js', 'fonts.css', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// Network first for the page (so updates arrive when online), cache first for the rest
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  if (req.mode === 'navigate') {
    // each page is cached under its own URL; the site root falls back to index.html
    e.respondWith(fetch(req)
      .then(res => { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); return res; })
      .catch(() => caches.match(req, { ignoreSearch: true }).then(hit => hit || caches.match('index.html'))));
    return;
  }
  e.respondWith(caches.match(req).then(hit => hit || fetch(req)));
});
