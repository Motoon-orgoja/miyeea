// Bump VERSION whenever any cached file changes so phones pick up the new copy
const VERSION = 'v53';
const FILES = ['./', 'usul.html', 'data/usul.js', 'zubad.html', 'data/zubad.js', 'i18n.js', 'i18n/en.js', 'i18n/fus.js', 'sync.js', 'circles.js', 'ajurrumiyya.html', 'data/ajurrumiyya.js', 'nawawi.html', 'data/nawawi.js', 'bayquniyya.html', 'data/bayquniyya.js', 'tuhfa.html', 'data/tuhfa.js', 'data/media.js', 'voice.js', 'annot.js', 'fonts/Amiri-400.woff2', 'fonts/Amiri-700.woff2', 'fonts/NotoKufiArabic-400.woff2', 'fonts/NotoKufiArabic-500_800.woff2', 'srs.js', 'ui.js', 'ui.css', 'home.html', 'home.js', 'index.html', 'munajat.html', 'shatibiyya.html', 'jazariyya.html', 'data/jazariyya.js', 'qudouri.html', 'prose.css', 'prose-engine.js', 'data/riyad.js', 'data/shatibiyya.js', 'data/qudouri.js', 'app.css', 'engine.js', 'data/miyeea.js', 'data/munajat.js', 'data/munajat-expl.js', 'riyad.html', 'fonts.css', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// a cheer from a friend in «حلقاتي», pushed by the sync-worker: {t: title, b: text, u: page to open}
self.addEventListener('push', e => {
  let m = {}; try { m = e.data.json(); } catch (x) {}
  e.waitUntil(self.registration.showNotification(m.t || 'حفظ المتون', { body: m.b || '', icon: 'icons/icon-192.png', badge: 'icons/icon-192.png', lang: 'ar', dir: 'rtl', data: m.u || 'home.html' }));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = new URL(e.notification.data || 'home.html', self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(ws => {
    const w = ws.find(w => w.url.startsWith(self.registration.scope));
    return w ? w.focus().then(w => w.navigate(url)).catch(() => self.clients.openWindow(url)) : self.clients.openWindow(url);
  }));
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
  // the commentary is too big to pre-cache: each chapter's file is kept once it has been opened
  const keep = /\/data\/([a-z]+-sharh|sharh)\//.test(req.url);
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => { if (keep && res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); } return res; })));
});
