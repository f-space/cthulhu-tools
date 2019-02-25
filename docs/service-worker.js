self.addEventListener('activate', function (event) {
	event.waitUntil(
		caches.keys().then(names => Promise.all(names.map(name => caches.delete(name))))
	);
});

self.addEventListener('fetch', function (event) {
	event.respondWith(fetch(event.request));
});