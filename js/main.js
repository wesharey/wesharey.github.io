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
            <div class="event__action" data-id="${event.id}" data-url="${event.url}" data-capacity="${event.capacity}">
                <a class="event__cta" href="${event.url}">
                    <span class="event__cta__book-now">Prenota il tuo posto</span>
                </a>
            </div>
        </article>`;
    }).join('');

    const getActionHtml = (actionElement, partecipants) => {
        let seatsLeft = actionElement.dataset.capacity - partecipants;
        if (!seatsLeft) return `<a class="event__sold-out" href="${actionElement.dataset.url}">Tutto esaurito :(</a>`;

        return `<a class="event__cta" href="${actionElement.dataset.url}">
            <span class="event__cta__book-now">Prenota il tuo posto</span>
            <span class="event__cta__available-seats">${seatsLeft} posti disponibili</span>
        </a>`;
    };

    const addActions = (eventsDataEl) => {
        let actionEls = eventsDataEl.querySelectorAll('.event__action');
        actionEls.forEach(actionElement => {
            fetch("https://weshare-events.now.sh/?eventid="+actionElement.dataset.id)
                .then(data => data.json())
                .then(data => {
                    actionElement.innerHTML = getActionHtml(actionElement, data.partecipants);
                })
                .catch(error => {
                    console.error(error);
                });
        });
    };

    // Pre-check
    let eventsDataEls = document.getElementsByClassName('events__data');
    if (!eventsDataEls.length) return;
    let eventsDataElement = eventsDataEls[0];

    //fetch("./mocks/weshare-events.now.sh.v3.json")
    fetch("https://weshare-events.now.sh/")
        .then(data => data.json())
        .then(data => {
            eventsDataElement.innerHTML = getEventsHtml(data);
            addActions(eventsDataElement);
            new LazyLoad({elements_selector: ".event__image"});
        })
        .catch(error => {
            eventsDataElement.innerHTML = '<div class="event event--loading--failed">Oops, questo è imbarazzante. Si è verificato un errore durante il caricamento dei dati. <a href="mailto:weshare@yoox.net">Segnalacelo</a>.</div>';
            console.error(error);
        });
}());
