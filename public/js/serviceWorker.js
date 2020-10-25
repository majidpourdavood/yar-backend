if ("serviceWorker" in navigator) {
    navigator.serviceWorker
        .register("/js/serviceWorker.js")
        .then(reg => {
            console.log("Service worker registred successfully", reg);
        })
        .catch(err => {
            console.log("service worker not registred !!", err);
        });
}

const staticCacheName = "site-static-v1";
const cacheAssets = [
    "/",
    "/index.html",
];

self.addEventListener("install", evt => {
    evt.waitUntil(
        caches
            .open(staticCacheName)
            .then(cache => {
                console.log("caching assets...");
                cache.addAll(cacheAssets);
            })
            .catch(err => {})
    );
});

self.addEventListener("fetch", evt => {
    evt.respondWith(
        caches
            .match(evt.request)
            .then(res => {
                return res || fetch(evt.request);
            })
            .catch(err => {
                if (evt.request.url.indexOf(".html") > -1) {
                    return caches.match("./pages/fallback.html");
                }
            })
    );
});