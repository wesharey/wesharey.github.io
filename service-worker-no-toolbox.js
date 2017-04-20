const assetsCacheKey = "assets";
const appShellCacheKey = "shell";

const localCacheFiles = [
    /*"",
    "/offline.html",*/
    "/img/weshare.svg",
    "/css/main.css",
    "/js/main.js"
];
const remoteCacheFiles = [
    "https://cdnjs.cloudflare.com/ajax/libs/fetch/2.0.3/fetch.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/locale/it.js",
    "https://cdnjs.cloudflare.com/ajax/libs/vanilla-lazyload/7.2.0/lazyload.transpiled.min.js"
];

const isNavigateRequest = request => {
    return request.mode === "navigate" ||
        (request.method === "GET" &&
        request.headers.get("Accept").includes("text/html"));
};

const addToCache = (request, response) => {
    if (response.ok) {
        const copy = response.clone();
        caches.open(assetsCacheKey).then(cache => {
            cache.put(request, copy);
        });
    }
    return response; // For Promise chain
};

const fetchFromCache = request => {
    return caches.match(request).then(response => {
        if (!response) {
            throw Error(`The url ${request.url} was not found in cache`);
        }
        return response;
    });
};

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(appShellCacheKey).then(cache => {
            return cache.addAll(localCacheFiles);
        }).then(() => self.skipWaiting())
    );
});

self.addEventListener("fetch", event => {
    let request = event.request;
    let urlObj = new URL(request.url);
    if (isNavigateRequest(request)) {
        // Content - network first, then cache, then offline page
        console.log("Content request");
        event.respondWith(
            fetch(request)
                .then((response) => addToCache(request, response))
                .catch(() => fetchFromCache(request))
                .catch(() => offlinePage())
        );
    }
    else if ((remoteCacheFiles.indexOf(request.url) !== -1) ||
        (localCacheFiles.indexOf(urlObj.pathname) !== -1)) {
        console.log("Respond with file for " + request.url);
        event.respondWith(
            fetchFromCache(request)
                .catch(() => fetch(request))
        );
    }
    else {
        console.log("Failed to respond from cache", request.url);
    }
});
