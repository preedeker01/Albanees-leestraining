const CACHE_PREFIX='albanese-leestraining-';
const CACHE_NAME='albanese-leestraining-v12-hoofdletters-cachefix-20260918';

const CORE=[
  './',
  './index.html',
  './manifest.webmanifest',
  './SpeechOn.wav',
  './SpeechOff.wav'
];

self.addEventListener('install',event=>{
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      Promise.all(CORE.map(url => cache.add(url).catch(()=>null)))
    )
  );
});

self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys
        .filter(k=>k.startsWith(CACHE_PREFIX) && k!==CACHE_NAME)
        .map(k=>caches.delete(k)))
    ).then(()=>self.clients.claim())
  );
});

self.addEventListener('message',event=>{
  if(event.data && event.data.type==='SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET') return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin) return;

  // Deze bestanden moeten altijd eerst van GitHub worden gehaald.
  // Daardoor kan een oude PWA-cache geen oude index/audio-map blijven tonen.
  const networkFirst =
    url.pathname.endsWith('/index.html') ||
    url.pathname.endsWith('/audio-map.json') ||
    url.pathname.endsWith('/word-data-750.json') ||
    url.pathname.endsWith('/service-worker.js') ||
    url.pathname.endsWith('/');

  if(networkFirst){
    event.respondWith(
      fetch(event.request,{cache:'no-store'}).then(response=>{
        if(response && response.ok){
          const copy=response.clone();
          caches.open(CACHE_NAME).then(cache=>cache.put(event.request,copy));
        }
        return response;
      }).catch(()=>caches.match(event.request))
    );
    return;
  }

  // MP3's, iconen en geluiden: cache-first voor snel/offline gebruik.
  event.respondWith(
    caches.match(event.request).then(cached=>{
      if(cached) return cached;
      return fetch(event.request).then(response=>{
        if(response && response.ok){
          const copy=response.clone();
          caches.open(CACHE_NAME).then(cache=>cache.put(event.request,copy));
        }
        return response;
      });
    })
  );
});
