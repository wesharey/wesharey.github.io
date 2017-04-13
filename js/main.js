(function(){
    const timeFormat = timeString => {
        return timeString.split(':').slice(0, 2).join(':');
    };

    const getEventsHtml = data => data.map(event => {
        let relativeTime = moment(event.start.local).calendar();
        let startDateTime = event.start.local.split('T');
        let startTime = timeFormat(startDateTime[1]);
        let endTime = timeFormat(event.end.local.split('T')[1]);
        return `<article class="event">
            <h2 class="event__title"><a href="${event.url}">${event.name.text}</a></h2>
            <div class="event__date">${relativeTime} &dash; <span class="event__date__time">dalle ${startTime} alle ${endTime}</span></div>
            <img class="event__image" data-original="${event.logo.url}" width="200" height="100">
            <div class="event__description">${event.description.html}</div>
            <div class="event__action" data-id="${event.id}" data-url="${event.url}" data-capacity="${event.capacity}"></div>
        </article>`;
    }).join('');

    // Pre-check
    let eventsDataEls = document.getElementsByClassName('events__data');
    if (!eventsDataEls.length) return;
    let eventsDataEl = eventsDataEls[0];

    //fetch("./mocks/weshare-events.now.sh.v3.json")
    fetch("https://weshare-events.now.sh/")
        .then(data => data.json())
        .then(data => {
            eventsDataEl.innerHTML = getEventsHtml(data);

            let actionEls = eventsDataEl.querySelectorAll('.event__action');
            actionEls.forEach(el => {
                fetch("https://weshare-events.now.sh/?eventid="+el.dataset.id)
                    .then(data => data.json())
                    .then(data => {
                        console.log(data);
                        let seatsLeft = el.dataset.capacity - data.partecipants;
                        if (seatsLeft) {
                            el.innerHTML = `<a class="event__cta" href="${el.dataset.url}">
                                <span class="event__cta__book-now">Prenota il tuo posto</span>
                                <span class="event__cta__available-seats">${seatsLeft} posti disponibili</span>
                            </a>`;
                        }
                        else {
                            el.innerHTML = `<a class="event__sold-out" href="${el.dataset.url}">Tutto esaurito :(</a>`
                        }
                    });
            });




            new LazyLoad({elements_selector: ".event__image"});
        });
}());
