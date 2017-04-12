(function(){
    const dateFormat = dateString => {
        return dateString.split('-').reverse().join('/');
    };
    const timeFormat = timeString => {
        return timeString.split(':').slice(0, 2).join(':');
    };
    fetch("./mocks/weshare-events.now.sh.json")
        .then(data => data.json())
        .then(data => {
            let output = document.getElementsByClassName('events__data')[0];
            if (output) {
                output.innerHTML = data.map(event => {
                    let startDateTime = event.start.local.split('T');
                    let startDate = dateFormat(startDateTime[0]);
                    let startTime = timeFormat(startDateTime[1]);
                    let endTime = timeFormat(event.end.local.split('T')[1]);
                    return `<article class="event">
                        <h2 class="event__title"><a href="${event.url}">${event.name.text}</a></h2>
                        <div class="event__time">${startDate} <time>${startTime}</time> &rarr; <time>${endTime}</time></div>
                        <div class="event__image"><img src="${event.logo.url}" width="200" height="100"></div>
                        <div class="event__description">${event.description.html}</div>
                    </article>`;
                }).join('');
            }
        });
}());