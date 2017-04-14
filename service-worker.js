const isGettingHtml = event => {
    let request = event.request;
    return request.mode === "navigate" ||
        (request.method === "GET" &&
        request.headers.get("accept").includes("text/html"));
};

self.addEventListener("fetch", event => {
    if (isGettingHtml(event)) {
        event.respondWith(
            fetch(event.request).catch(() => {
                let offlineHtml = "<h1>You're offline.</h1>" +
                    "<p>This page is all you get when you're offline.</p>" +
                    "<p>Sorry about that...</p>";
                return new Response(offlineHtml,
                    {headers: {"Content-type": "text/html"}});
            })
        );
    }
});
