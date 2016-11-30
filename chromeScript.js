(()=>{
  let events = document.querySelectorAll('.event-card-myevents-container');
  let resHTML = "<div>"
  events.forEach((v,k)=>{
      let linkText = v.querySelectorAll('.hide-small')[0].innerHTML;
      let linkHref = v.querySelectorAll('.text-body--faint')[3].getAttribute('href');
      let date = v.querySelectorAll('.text-body--faint')[0].outerHTML;
      let totalTicket = v.querySelectorAll('.text-body--faint')[4].innerHTML;
      let soldTicket = v.querySelectorAll('.text-color--green')[0].innerHTML;
      resHTML += `<a href="https://www.eventbrite.com${linkHref}">${linkText}</a><br>${date}<br>Biglietti venduti: ${soldTicket}${totalTicket}<br><br>`;
  });
  resHTML += "</div>";
 
  let layoutHTML = `<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd"><html lang="en"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="format-detection" content="telephone=no"><title>Single Column</title><style type="text/css">body{margin:0;padding:0;-ms-text-size-adjust:100%;-webkit-text-size-adjust:100%}table{border-spacing:0}table td{border-collapse:collapse}.ExternalClass{width:100%}.ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div{line-height:100%}.ReadMsgBody{width:100%;background-color:#ebebeb}table{mso-table-lspace:0pt;mso-table-rspace:0pt}img{-ms-interpolation-mode:bicubic}.yshortcuts a{border-bottom:none !important}@media screen and (max-width: 599px){.force-row,.container{width:100% !important;max-width:100% !important}}@media screen and (max-width: 400px){.container-padding{padding-left:12px !important;padding-right:12px !important}}.ios-footer a{color:#aaa !important;text-decoration:underline}</style></head><body style="margin:0; padding:0;" bgcolor="#F0F0F0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"><table border="0" width="100%" height="100%" cellpadding="0" cellspacing="0" bgcolor="#F0F0F0"><tbody><tr><td align="center" valign="top" bgcolor="#F0F0F0" style="background-color: #F0F0F0;"><br><table border="0" width="600" cellpadding="0" cellspacing="0" class="container" style="width:600px;max-width:600px"><tbody><tr><td class="container-padding content" align="left" style="padding-left:24px;padding-right:24px;padding-top:12px;padding-bottom:12px;background-color:#ffffff"> <br><div class="title" style="font-family:Helvetica, Arial, sans-serif;font-size:18px;font-weight:600;color:#374550;text-align: center;"><img src="http://cdn2.yoox.biz/weshare.jpg"></div> <br><div class="body-text" style="font-family:Helvetica, Arial, sans-serif;font-size:14px;line-height:20px;text-align:left;color:#333333"> Buongiorno a tutti,<br> ecco il calendario appuntamenti WeShare della prossima settimana: <br><br> ${resHTML} <br> <br>→ <a href="https://wesharey.github.io/weshare/"><b>Consulta il calendario corsi ed iscriviti</b></a><br><br>Hai un’idea per un nuovo incontro? <a href="https://goo.gl/forms/x1HjkEVLPaRxkGtV2">Compila il form</a> o <a href="mailto:WeShare@yoox.com">contattaci</a> via mail. <br><br><div style="text-align:right;"> Ci vediamo presto! <br> WeShare™ team.</div></div></td></tr><tr><td class="container-padding footer-text" align="left" style="font-family:Helvetica, Arial, sans-serif;font-size:12px;line-height:16px;color:#aaaaaa;padding-left:24px;padding-right:24px; text-align:right;"> <br><a href="https://wesharey.github.io/weshare/">Calendario</a> ~ <a href="https://goo.gl/forms/x1HjkEVLPaRxkGtV2">Proponi evento</a> ~ <a href="mailto:WeShare@yoox.com">Contattaci</a> ~ WeShare™ <br><br></td></tr></tbody></table></td></tr></tbody></table></body></html>`;

  document.write(layoutHTML);

  
  var link = "mailto:OFS_Teams <OFS_Teams@yoox.com>; F31Support <F31Support@yoox.com>; Experience <experience@yoox.com>"
  + "?subject=" + escape("[WeShare] Appuntamenti della prossima settimana")
  + "&body="
  ;

  window.location.href = link;

})()