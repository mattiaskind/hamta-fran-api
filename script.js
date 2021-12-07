const form = document.querySelector('form');
const input = document.querySelector('#input');

const responseDiv = document.querySelector('#response');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const req = new XMLHttpRequest();
  req.open('GET', `https://ghibliapi.herokuapp.com/films?title=${input.value}`);
  req.onload = function () {
    const res = JSON.parse(this.response);
    if (res.length === 0) return console.log('TOMT FÄLT');
    responseDiv.innerHTML = `
    <div>Title: ${res[0].title}</div>
    <div>Producent: ${res[0].producer}</div>
    <div>Beskrivning: ${res[0].description}</div>
    <div><img src="${res[0].image}"></div>
    `;
  };

  req.send();
});

//https://ghibliapi.herokuapp.com/films
