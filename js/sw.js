// ===== SERVICE WORKER - CACHE E PERFORMANCE =====

const CACHE_NAME = 'doce-encanto-v1.0.0';
const STATIC_CACHE = 'static-v1.0.0';
const DYNAMIC_CACHE = 'dynamic-v1.0.0';

// Files to cache immediately
const STATIC_FILES = [
    '/',
    '/index.html',
    '/sobre.html',
    '/contato.html',
    '/produtos/',
    '/css/style.css',
    '/css/animations.css',
    '/css/performance.css',
    '/js/main.js',
    '/js/performance.js',
    '/img/logo.png',
    '/manifest.json'
];

// Install event
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('Caching static files');
                return cache.addAll(STATIC_FILES);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => self.clients.claim())
    );
});

// Fetch event with cache strategies
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Cache first strategy for static assets
    if (STATIC_FILES.includes(url.pathname) || 
        request.destination === 'style' || 
        request.destination === 'script') {
        
        event.respondWith(
            caches.match(request)
                .then(cachedResponse => {
                    return cachedResponse || fetch(request)
                        .then(networkResponse => {
                            return caches.open(STATIC_CACHE)
                                .then(cache => {
                                    cache.put(request, networkResponse.clone());
                                    return networkResponse;
                                });
                        });
                })
        );
        return;
    }

    // Network first strategy for API calls and dynamic content
    if (url.pathname.includes('/api/') || 
        request.method === 'POST') {
        
        event.respondWith(
            fetch(request)
                .then(networkResponse => {
                    // Cache successful GET requests
                    if (request.method === 'GET' && networkResponse.ok) {
                        const responseClone = networkResponse.clone();
                        caches.open(DYNAMIC_CACHE)
                            .then(cache => cache.put(request, responseClone));
                    }
                    return networkResponse;
                })
                .catch(() => {
                    // Fallback to cache
                    return caches.match(request);
                })
        );
        return;
    }

    // Stale while revalidate for images
    if (request.destination === 'image') {
        event.respondWith(
            caches.open(DYNAMIC_CACHE)
                .then(cache => {
                    return cache.match(request)
                        .then(cachedResponse => {
                            const fetchPromise = fetch(request)
                                .then(networkResponse => {
                                    cache.put(request, networkResponse.clone());
                                    return networkResponse;
                                });
                            
                            return cachedResponse || fetchPromise;
                        });
                })
        );
        return;
    }

    // Default: cache first for everything else
    event.respondWith(
        caches.match(request)
            .then(cachedResponse => {
                return cachedResponse || fetch(request);
            })
    );
});

// Background sync for offline form submissions
self.addEventListener('sync', event => {
    if (event.tag === 'background-sync-contact') {
        event.waitUntil(sendOfflineFormData());
    }
});

async function sendOfflineFormData() {
    const db = await openDB();
    const tx = db.transaction(['offline-forms'], 'readonly');
    const store = tx.objectStore('offline-forms');
    const forms = await store.getAll();

    for (const form of forms) {
        try {
            await fetch('/api/contact', {
                method: 'POST',
                body: JSON.stringify(form.data),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            // Remove from offline storage
            const deleteTx = db.transaction(['offline-forms'], 'readwrite');
            await deleteTx.objectStore('offline-forms').delete(form.id);
        } catch (error) {
            console.error('Failed to sync form data:', error);
        }
    }
}

// Push notifications
self.addEventListener('push', event => {
    const options = {
        body: event.data ? event.data.text() : 'Nova promoção da Doce Encanto!',
        icon: '/img/icon-192.png',
        badge: '/img/badge-72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Ver Ofertas',
                icon: '/img/checkmark.png'
            },
            {
                action: 'close',
                title: 'Fechar',
                icon: '/img/xmark.png'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification('Doce Encanto', options)
    );
});

// Notification click handling
self.addEventListener('notificationclick', event => {
    event.notification.close();

    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/produtos/')
        );
    }
});