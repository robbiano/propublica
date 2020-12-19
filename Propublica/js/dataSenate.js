var URL_GET = 'https://api.propublica.org/congress/v1/113/senate/members.json'

//Realiza el pedido del JSON al servidor de propublica
fetch(URL_GET, {
  method: 'GET',
  headers: {
    'X-API-KEY': 'bstQMPJjcTZEeWFdAZe07vRAfmPEZUWNB9B9Dwb1'
  }
}).then(function (response) {
  if (response.ok) {
    return response.json();
  } else {
    throw new error(rsponse.status)
  }

}).then(function (data) {
  app.miembros = data.results[0].members;
})
  .catch(function (error) {
    console.log('Looks like there was a problem: \n', error);
  });

let app = new Vue({
  el: "#app",
  data: {
    miembros: [],
  },
})