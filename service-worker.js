const offlineCacheKey = "offline";
const offlineURL = "offline.html";
const assetsCacheKey = "assets";

const isNavigateRequest = request => {
    return request.mode === "navigate" ||
        (request.method === "GET" &&
        request.headers.get("Accept").includes("text/html"));
};

const isImageRequest = request => {
    return request.headers.get("Accept").includes("image");
};

const isCSSRequest = request => {
    return request.headers.get("Accept").includes("text/css");
};

const serveFakeCSS = request => {
    return new Response("", {headers: {"Content-Type": "text/css"}});
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
        fetch(new Request(offlineURL)).then(response => {
            return caches.open(assetsCacheKey).then(cache => {
                return cache.put(offlineURL, response);
            });
        })
    );
});

const offlinePage = () => {
    return caches.open(offlineCacheKey).then(cache => {
        return cache.match(offlineURL);
    });
};

self.addEventListener("fetch", event => {
    let request = event.request;
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
    else if (isImageRequest(request)) {
        // Images - cache first, then network (and add to cache), then ...
        console.log("Image request");
        event.respondWith(
            fetchFromCache(request) // Cache first
                .catch(() => fetch(request) // But if not in cache, fetch
                .then(response => addToCache(request, response))) // If fetch was successful, add to cache for later
                .catch(() => console.log("Oops. Unable to respond to image request")) // If fetch failed... (lame solution - figure out what to do with it)
        );
    }
    else if (isCSSRequest(request)) {
        // CSS - network first, then cache, then fake CSS
        event.respondWith(
            fetch(request)
                .then((response) => addToCache(request, response))
                .catch(() => fetchFromCache(request))
                .catch(() => serveFakeCSS())
        );
    }
    else {
        console.log("Other request", {
            accept: request.headers.get("Accept"),
            mode: request.mode,
            method: request.method,
            requestObj: request
        });
    }
});
