// Aumentamos a versão para v4 para forçar a troca
const CACHE_NAME = 'cronometro-v4'; 
const assets = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './icon-192.jpg',
  './icon-512.jpg'
];

// Instala e FORÇA o Service Worker a assumir o controle na mesma hora
self.addEventListener('install', event => {
  self.skipWaiting(); // <--- Essa é a linha mágica que resolve o seu problema
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(assets);
    })
  );
});

// Quando ativado, DELETA os caches das versões antigas (v1, v2, v3)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys
        .filter(key => key !== CACHE_NAME)
        .map(key => caches.delete(key)) // <--- Apaga a versão velha
      );
    })
  );
  self.clients.claim();
});

// Intercepta as requisições para funcionar offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});