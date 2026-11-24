// 수업 타이머 오프라인 작동 파일 — 수정본을 올릴 때 VERSION 숫자를 올리세요.
const VERSION = 'v15';
const CACHE = 'class-timer-' + VERSION;
const FILES = ['./', './index.html', './manifest.webmanifest', './fonts/jua.css', './icon-192.png', './icon-512.png', './icon-maskable-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES.map(u => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('class-timer-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
// 글꼴 파일 등은 처음 쓸 때 저장해 두었다가 오프라인에서도 사용
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(r => r || fetch(e.request).then(res => {
    if (res && res.ok && new URL(e.request.url).origin === location.origin) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
    return res;
  })));
});
