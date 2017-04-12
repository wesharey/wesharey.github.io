(function(){
    const dateFormat = dateString => {
        return dateString.split('-').reverse().join('/');
    };
    const timeFormat = timeString => {
        return timeString.split(':').slice(0, 2).join(':');
    };
    fetch("https://weshare-events.now.sh/")
        .then(data => data.json())
        .then(data => {
            let output = document.getElementsByClassName('events__data')[0];
            if (output) {
                output.innerHTML = data.map(event => {
                    let relativeTime = moment(event.start.local).calendar();
                    let startDateTime = event.start.local.split('T');
                    let startDate = dateFormat(startDateTime[0]);
                    let startTime = timeFormat(startDateTime[1]);
                    let endTime = timeFormat(event.end.local.split('T')[1]);
                    return `<article class="event">
                        <h2 class="event__title"><a href="${event.url}">${event.name.text}</a></h2>
                        <div class="event__date">${relativeTime} &dash; <span class="event__date__time">dalle ${startTime} alle ${endTime}</span></div>
                        <div class="event__image"><img src="${event.logo.url}" width="200" height="100"></div>
                        <div class="event__description">${event.description.html}</div>
                    </article>`;
                }).join('');
            }
        });
}());