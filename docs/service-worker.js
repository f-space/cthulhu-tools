const VERSION = 2;

const CACHE_NAME = `ver.${VERSION}`;

const FILE_URLS = [
	".",
	"manifest.json",
	"index.css",
	"index.js",
	"audio/dice.wav",
	"data/attributes.json",
	"data/profiles.json",
	"data/skills.json",
	"font/Neko_no_Mezame.ttf",
	"image/dice.json",
	"image/dice.png",
	"icon/favicon.png",
	"icon/icon_192x192.png",
	"icon/icon_512x512.png",
];

self.addEventListener('install', function (event) {
	event.waitUntil(
		caches.open(CACHE_NAME).then(cache => cache.addAll(FILE_URLS))
	);
});

self.addEventListener('activate', function (event) {
	event.waitUntil(
		caches.keys().then(names =>
			Promise.all(names
				.filter(name => name !== CACHE_NAME)
				.map(name => caches.delete(name))))
	);
})

self.addEventListener('fetch', function (event) {
	event.respondWith(
		caches.open(CACHE_NAME).then(cache =>
			cache.match(event.request, { ignoreSearch: true }).then(response =>
				response || fetch(event.request)
			)
		)
	);
});