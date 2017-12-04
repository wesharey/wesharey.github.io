(function () {
	const eventbriteToken = "6BGXJFRC4WZTG4KVWARZ";

	const getOwnedLiveEventsUrl = (token) => "https://www.eventbriteapi.com/v3/users/me/owned_events/?status=live&token=" + token;
	const getEventDetailUrl = (token, eventId) => `https://www.eventbriteapi.com/v3/events/${eventId}/attendees/?status=attending&token=` + token;

	const timeFormat = timeString => {
		return timeString.split(":").slice(0, 2).join(":");
	};

	const getEventsHtml = data => data.map(event => {
		let relativeTime = window.moment(event.start.local).calendar();
		let startDateTime = event.start.local.split("T");
		let startTime = timeFormat(startDateTime[1]);
		let endTime = timeFormat(event.end.local.split("T")[1]);
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
	}).join("");

	const getActionHtml = (actionElement, attendees) => {
		let seatsLeft = actionElement.dataset.capacity - attendees;
		if (!seatsLeft) return `<a class="event__sold-out" href="${actionElement.dataset.url}">Tutto esaurito :(</a>`;

		return `<a class="event__cta" href="${actionElement.dataset.url}">
		<span class="event__cta__book-now">Prenota il tuo posto</span>
		<span class="event__cta__available-seats">${seatsLeft} posti disponibili</span>
		</a>`;
	};

	const addActions = (eventsDataEl) => {
		let actionEls = eventsDataEl.querySelectorAll(".event__action");
		actionEls.forEach(actionElement => {
			fetch(getEventDetailUrl(eventbriteToken, actionElement.dataset.id))
				.then(data => data.json())
				.then(data => {
					actionElement.innerHTML = getActionHtml(actionElement, data.attendees.length);
				});
		});
	};

	const finishLoading = function (element, html) {
		element.classList.remove("events__data--loading");
		element.innerHTML = html;
	};

	// Pre-check
	let eventsDataElement = document.querySelector(".events__data");
	if (!eventsDataElement) return;

	//fetch("./mocks/weshare-events.now.sh.v3.json")
	fetch(getOwnedLiveEventsUrl(eventbriteToken))
		.then(data => data.json())
		.then(data => {
			finishLoading(eventsDataElement, getEventsHtml(data.events));
			addActions(eventsDataElement);
			new window.LazyLoad({ elements_selector: ".event__image" });
		})
		.catch(() => {
			finishLoading(eventsDataElement, `<div class="event event--loading--failed">Oops, sembra che il servizio
				per caricare i dati degli eventi non sia disponibile. Riprova più tardi oppure
				<a href="mailto:weshare@yoox.net">segnalacelo</a>.</div>`);
		});
}());
