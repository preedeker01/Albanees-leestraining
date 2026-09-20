'use strict';
// Increase VERSION whenever an app file, word list or recording is deployed.
// Keep this worker and all other files in the same GitHub commit.
const VERSION = '2026-09-20-1';
const SCOPE = self.registration.scope;
const PREFIX = 'albanese-leestraining:' + encodeURIComponent(SCOPE) + ':';
const CORE_CACHE = PREFIX + VERSION + ':core';
const AUDIO_CACHE = PREFIX + VERSION + ':audio';
const CORE = [
  './index.html', './styles.css', './app.js',
  './word-data-750.json', './audio-map.json', './manifest.webmanifest',
  './icon.svg', './icon-180.png', './icon-192.png', './icon-512.png',
  './SpeechOn.wav', './SpeechOff.wav'
];
const CORE_URLS = new Set(CORE.map(path => new URL(path, SCOPE).href));
const INDEX_URL = new URL('./index.html', SCOPE).href;

self.addEventListener('install', event => {
  // A failed core download rejects installation; the existing version stays active.
  // Never skipWaiting here: the page offers an explicit update button.
  event.waitUntil((async () => {
    const cache = await caches.open(CORE_CACHE);
    await cache.addAll(CORE.map(path => new Request(new URL(path, SCOPE), { cache:'reload' })));
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter(name => name.startsWith(PREFIX) && name !== CORE_CACHE && name !== AUDIO_CACHE).map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});
self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') event.waitUntil(self.skipWaiting());
});
function unavailable() {
  return new Response('Dit bestand is offline niet beschikbaar.', { status:503, headers:{ 'Content-Type':'text/plain; charset=utf-8' } });
}
async function coreResponse(url) {
  const cache = await caches.open(CORE_CACHE);
  const cached = await cache.match(url);
  if (cached) return cached;
  // This is only needed after external cache eviction.
  try { return await fetch(new Request(url, { cache:'reload' })); }
  catch (_) { return unavailable(); }
}
async function rangeResponse(response, range) {
  if (!range || response.status !== 200) return response;
  const match = /^bytes=(\d*)-(\d*)$/.exec(range);
  if (!match || (!match[1] && !match[2])) return response;
  const bytes = await response.arrayBuffer();
  const length = bytes.byteLength;
  const start = match[1] ? Number(match[1]) : Math.max(0, length - Number(match[2]));
  const end = match[1] && match[2] ? Math.min(Number(match[2]), length - 1) : length - 1;
  if (start > end || start >= length) return new Response(null, { status:416, headers:{ 'Content-Range':'bytes */' + length } });
  const headers = new Headers(response.headers);
  headers.delete('Content-Encoding');
  headers.set('Content-Range', 'bytes ' + start + '-' + end + '/' + length);
  headers.set('Content-Length', String(end - start + 1));
  headers.set('Accept-Ranges', 'bytes');
  return new Response(bytes.slice(start, end + 1), { status:206, headers });
}
async function audioResponse(request, url) {
  const cache = await caches.open(AUDIO_CACHE);
  let response = await cache.match(url);
  if (!response) {
    try {
      // Cache complete recordings, never a partial 206 response.
      const headers = new Headers(request.headers);
      headers.delete('Range');
      response = await fetch(new Request(request, { headers, cache:'reload' }));
      if (response.status === 200) {
        try { await cache.put(url, response.clone()); } catch (_) { /* Playback can continue if storage is full. */ }
      }
    } catch (_) { return unavailable(); }
  }
  return rangeResponse(response, request.headers.get('Range'));
}
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || !request.url.startsWith(SCOPE)) return;
  const url = new URL(request.url);
  const canonical = url.origin + url.pathname;
  if (request.mode === 'navigate' && (canonical === SCOPE || canonical === INDEX_URL)) {
    event.respondWith(coreResponse(INDEX_URL));
  } else if (CORE_URLS.has(canonical)) {
    event.respondWith(coreResponse(canonical));
  } else if (canonical.startsWith(new URL('./audio/', SCOPE).href) && canonical.endsWith('.mp3')) {
    event.respondWith(audioResponse(request, canonical));
  }
});
