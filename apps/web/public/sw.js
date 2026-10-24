// public/sw.js
const CACHE_NAME = "saasflow-v1";
const urlsToCache = ["/", "/dashboard", "/login", "/manifest.json"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request);
    })
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Web Push Notification Event Listener
self.addEventListener("push", (event) => {
  let payload = { title: "New Notification", body: "You have received an update.", url: "/dashboard" };
  try {
    if (event.data) {
      payload = event.data.json();
    }
  } catch {
    payload.body = event.data ? event.data.text() : payload.body;
  }

  const options = {
    body: payload.body,
    icon: payload.icon || "/icon-192.png",
    badge: "/icon-192.png",
    vibrate: [100, 50, 100],
    data: {
      url: payload.url || "/dashboard",
      dateOfArrival: Date.now(),
    },
  };

  event.waitUntil(self.registration.showNotification(payload.title, options));
});

// Notification Click Behavior
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || "/dashboard";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === targetUrl && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
