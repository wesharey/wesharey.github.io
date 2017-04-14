const fetchingHtml = event => {
    let request = event.request;
    return request.mode === "navigate" ||
        (request.method === "GET" &&
        request.headers.get("accept").includes("text/html"));
};

const offlineCacheKey = "offline";
const offlineURL = "offline.html";

self.addEventListener("install", event => {
    event.waitUntil(
        fetch(new Request(offlineURL)).then(response => {
            return caches.open(offlineCacheKey).then(cache => {
                return cache.put(offlineURL, response);
            });
        })
    );
});

self.addEventListener("fetch", event => {
    if (fetchingHtml(event)) {
        event.respondWith(
            fetch(event.request).catch(() => {
                return caches.open(offlineCacheKey).then(cache => {
                    return cache.match(offlineURL);
                });
            })
        );
    }
});
