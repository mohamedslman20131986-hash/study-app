self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("library-cache").then(cache => {
      return cache.addAll(["/", "/index.html", "/style.css", "/main.js", "/add.js", "/db.js", "/offline.html"]);
    })
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request).then(r => r || caches.match("/offline.html")))
  );
});