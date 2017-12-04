(function (moment, LazyLoad) {
	const s3Bucket = "https://s3.eu-central-1.amazonaws.com/weshare-events-eu-central/";
	const s3EventsFile = s3Bucket + "events.json";
	const s3AttendeesFile = s3Bucket + "attendees.json";

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
		let actionEls = eventsDataEl.querySelectorAll(".event__action");
		actionEls.forEach(actionElement => {
			actionElement.innerHTML = getActionHtml(actionElement, attendeesData);
		});
	};

	const eventsLoadHandler = function (element, html) {
		element.classList.remove("events__data--loading");
		element.innerHTML = html;
	};

	// Pre-check
	let eventsDataElement = document.querySelector(".events__data");
	if (!eventsDataElement) return;

	const renderEventsAvailability = () => {
		fetch(s3AttendeesFile)
			.then(data => data.json())
			.then(attendeesData => updateCallToActionButtons(eventsDataElement, attendeesData));
	};

	fetch(s3EventsFile)
		.then(data => data.json())
		.then(eventsData => {
			eventsLoadHandler(eventsDataElement, getEventsHtml(eventsData));
			new LazyLoad({ elements_selector: ".event__image" });
			renderEventsAvailability();
		})
		.catch(() => {
			eventsLoadHandler(eventsDataElement, `<div class="event event--loading--failed">Oops, sembra che
				il servizio per caricare i dati degli eventi non sia disponibile. Riprova più tardi,
				oppure <a href="mailto:weshare@yoox.net">segnalacelo</a>.</div>`);
		});
}(window.moment, window.LazyLoad));
