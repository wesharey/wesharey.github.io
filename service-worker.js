'use strict';

// Load the sw-tookbox library.
importScripts('/js/sw-toolbox/sw-toolbox.js');

// Turn on debug logging, visible in the Developer Tools' console.
// toolbox.options.debug = true;

// HTTP GET requests to eventbrite images are cached for 30 days, but max 10 images
toolbox.router.get(/^https:\/\/img\.evbuc\.com\//, toolbox.cacheFirst, {
    cache: {
        name: 'eventbrite-images',
        maxEntries: 10,
        maxAgeSeconds: 2592000 //30 days * 24 * 60 * 60 seconds
    }
});

// HTTP GET requests to eventbrite data are cached 1 day and refreshed after every call
toolbox.router.get(/^https:\/\/weshare\-events\.now\.sh\/$/, toolbox.fastest, {
    cache: {
        name: 'eventbrite-data',
        maxAgeSeconds: 86400 //1 day * 24 * 60 * 60 seconds
    }
});

// HTTP GET requests to CDNJS are cached like forever :)
toolbox.router.get(/^https:\/\/cdnjs\.cloudflare\.com\//, toolbox.cacheFirst, {
    cache: {
        name: 'cdnjs-data'
    }
});

// All other requests are served network-first - so they're cached for offline
toolbox.router.default = toolbox.networkFirst;