(function (moment, LazyLoad) {
	const eventsInfoElement = document.querySelector(".events__data");
	const s3Bucket = "https://s3.eu-central-1.amazonaws.com/weshare-events-eu-central/";
	const eventsJsonFile = s3Bucket + "events.json";
	const attendeesJsonFile = s3Bucket + "attendees.json";

	// EVENTS
	// ------

	const timeFormat = timeString => {
		return timeString.split(":").slice(0, 2).join(":");
	};

	const getEventsHtml = data => data.map(event => {
		let relativeTime = moment(event.start.local).calendar();
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

	const eventsLoadHandler = function (eventsInfoElement, html) {
		eventsInfoElement.classList.remove("events__data--loading");
		eventsInfoElement.innerHTML = html;
	};

	const renderEvents = eventsData => {
		eventsLoadHandler(eventsInfoElement, getEventsHtml(eventsData));
		new LazyLoad({ elements_selector: ".event__image" });
		getAttendees(attendeesJsonFile);
	};

	const renderError = () => {
		eventsLoadHandler(eventsInfoElement, `<div class="event event--loading--failed">Oops, sembra che
			il servizio per caricare i dati degli eventi non sia disponibile. Riprova più tardi,
			oppure <a href="mailto:weshare@yoox.net">segnalacelo</a>.</div>`);
	};

	const getEvents = (jsonFile) => {
		fetch(jsonFile)
			.then(data => data.json())
			.then(renderEvents)
			.catch(renderError);
	};

	// ATTENDEES
	// ---------

	const getActionHtml = (actionElement, attendeesData) => {
		let attendeesCount = attendeesData[actionElement.dataset.id] || 0;
		let eventCapacity = parseInt(actionElement.dataset.capacity, 10);
		let seatsLeft = eventCapacity - attendeesCount;
		if (!seatsLeft) return `<a class="event__sold-out" href="${actionElement.dataset.url}">Tutto esaurito :(</a>`;

		return `<a class="event__cta" href="${actionElement.dataset.url}">
			<span class="event__cta__book-now">Prenota il tuo posto</span>
			<span class="event__cta__available-seats">${seatsLeft} posti disponibili</span>
		</a>`;
	};

	const updateCallToActionButtons = (eventsDataEl, attendeesData) => {
		let callToActionButtons = eventsDataEl.querySelectorAll(".event__action");
		callToActionButtons.forEach(actionElement => {
			actionElement.innerHTML = getActionHtml(actionElement, attendeesData);
		});
	};

	const getAttendees = (jsonFile) => {
		fetch(jsonFile)
			.then(data => data.json())
			.then(attendeesData => updateCallToActionButtons(eventsInfoElement, attendeesData));
	};

	// INIT
	// ----

	getEvents(eventsJsonFile);

}(window.moment, window.LazyLoad));