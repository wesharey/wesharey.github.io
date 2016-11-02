(()=>{
  let events = document.querySelectorAll('.event-card-myevents-container');
  let resHTML = "<ul>"
  events.forEach((v,k)=>{
      let linkText = v.querySelectorAll('.hide-small')[0].innerHTML;
      let linkHref = v.querySelectorAll('.text-body--faint')[3].getAttribute('href');
      let date = v.querySelectorAll('.text-body--faint')[0].outerHTML;
      resHTML += `<li><a href="https://www.eventbrite.com${linkHref}">${linkText}</a>${date}</li>`;
  });
  resHTML += "</ul>";
  if(document.getElementById('htmlOutput') !== null){
    document.getElementById('htmlOutput').outerHTML = `<textarea id="htmlOutput">${resHTML}</textarea>`;
  }else{
    let el = document.getElementsByTagName('header')[0],
    elChild = document.createElement('div');
    elChild.innerHTML = `<textarea id="htmlOutput">${resHTML}</textarea>`;
    el.insertBefore(elChild, el.firstChild);
  }
})()