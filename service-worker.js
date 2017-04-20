(g => {
    'use strict';

    // Load the sw-tookbox library.
    importScripts('/js/sw-toolbox/sw-toolbox.js');

    // Network first get index.html
    toolbox.router.get('/index.html', toolbox.networkFirst);

    // Turn on debug logging, visible in the Developer Tools' console.
    // g.toolbox.options.debug = true;

    // Set up a handler for HTTP GET requests to eventbrite images
    g.toolbox.router.get(/^https:\/\/img\.evbuc\.com\//, g.toolbox.cacheFirst, {
        cache: {
            name: 'eventbrite-images',
            maxEntries: 10,
            maxAgeSeconds: 2592000 //30 days * 24 * 60 * 60 seconds
        }
    });

    // Set up a handler for HTTP GET requests to eventbrite data
    g.toolbox.router.get(/^https:\/\/weshare\-events\.now\.sh\//, g.toolbox.fastest, {
        cache: {
            name: 'eventbrite-data',
            maxAgeSeconds: 86400 //1 day * 24 * 60 * 60 seconds
        }
    });
    
    // Set up a handler for HTTP GET requests to CDNJS
    g.toolbox.router.get(/^https:\/\/cdnjs\.cloudflare\.com\//, g.toolbox.cacheFirst, {
        cache: {
            name: 'cdnjs-data',
            maxEntries: 4
        }
    });

    g.toolbox.router.default = g.toolbox.networkFirst;

})(self);