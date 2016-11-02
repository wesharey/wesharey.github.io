(()=>{
  let events = document.querySelectorAll('.event-card-myevents-container');
  let resHTML = "<ul>"
  events.forEach((v,k)=>{
      let link = v.querySelectorAll('.hide-small')[0].outerHTML;
      let date = v.querySelectorAll('.text-body--faint')[0].outerHTML;
      resHTML += `<li>${link}${date}</li>`;
  });
  resHTML += "</ul>";
  if(document.getElementById('htmlOutput') !== null){
    document.getElementById('htmlOutput').outerHTML = `<textarea id="htmlOutput">${resHTML}</textarea>`;
  }else{
    let el = document.querySelectorAll('header')[0],
    elChild = document.createElement('div');
    elChild.innerHTML = `<textarea id="htmlOutput">${resHTML}</textarea>`;
    el.insertBefore(elChild, el.firstChild);
  }
})()