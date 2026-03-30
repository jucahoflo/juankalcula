const CACHE_NAME = 'juankalcula-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './css/styles.css',
  './js/main.js',
  './js/calculator.js',
  './modules/resistorDecoder.js',
  './modules/capacitorDecoder.js',
  './modules/E96Decoder.js',
  './modules/smdIdentifier.js',
  './manifest.json',
  './images/calculadora.png',
  './images/resistencia.png',
  './images/capacitor.png',
  './images/smd.png',
  './images/e96.png',
  './images/transistor.png'
];

// Instalación: Guarda los archivos en el dispositivo
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Estrategia: Primero buscar en caché, si no hay, ir a la red
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});