// Only caching needs to be implemented, no other ServiceWorker features.


// this doesn't seem to be working ..
self.addEventListener('GET', function(event) {
  console.log(event.request);
});

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('staticCache').then(function(cache) {
      return cache.addAll([
        '/',
        '/data/restaurants.json',
        '/css/styles.css',
        '/img/1.jpg',
        '/img/2.jpg',
        '/img/3.jpg',
        '/img/4.jpg',
        '/img/5.jpg',
        '/img/6.jpg',
        '/img/7.jpg',
        '/img/8.jpg',
        '/img/9.jpg',
        '/img/10.jpg',
        'main.js',
        'dbhelper.js',
        'restaurant_info.js']);
      })
  );
});

self.addEventListener(fetch, function(event) {
  event.respondWith(
    cache.match(event.request));
});
