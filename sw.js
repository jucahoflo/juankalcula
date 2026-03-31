const CACHE_NAME = 'juankalcula-v1';
const ASSETS = [
  '/',
  'index.html',
  'css/styles.css',
  'js/main.js',
  'js/calculator.js',
  'modules/resistorDecoder.js',
  'modules/capacitorDecoder.js',
  'modules/E96Decoder.js',
  'images/calculadora.png',
  'images/resistencia.png'
];

// Instalar y guardar archivos en caché
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// Responder desde la caché si no hay internet
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});