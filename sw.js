const CACHE_VERSION = "juankalcula-v2";
const APP_CACHE = `app-cache-${CACHE_VERSION}`;

const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./manifest.json",
    "./css/styles.css",
    "./js/main.js",
    "./js/calculator.js",
    "./modules/resistorDecoder.js",
    "./modules/capacitorDecoder.js",
    "./modules/E96Decoder.js",
    "./modules/smdIdentifier.js",
    "./modules/semiconductorDatasheet.js",

    "./images/calculadora.png",
    "./images/resistencia.png",
    "./images/capacitor.png",
    "./images/smd.png",
    "./images/e96.png",
    "./images/transistor.png",
    "./images/icon-192.png",
    "./images/icon-512.png"
];

// Instala y guarda archivos estáticos
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(APP_CACHE).then(cache => cache.addAll(FILES_TO_CACHE))
    );
    self.skipWaiting();
});

// Activa y elimina caches viejos
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== APP_CACHE) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Estrategia: cache primero, red después
self.addEventListener("fetch", event => {
    if (event.request.method !== "GET") return;

    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            if (cachedResponse) {
                return cachedResponse;
            }

            return fetch(event.request)
                .then(networkResponse => {
                    return networkResponse;
                })
                .catch(() => {
                    return caches.match("./index.html");
                });
        })
    );
});