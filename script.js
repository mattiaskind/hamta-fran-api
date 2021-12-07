const form = document.querySelector('form');
const input = document.querySelector('#input');

const wrapper = document.querySelector('.wrapper');
const title = document.querySelector('.title-big');
const director = document.querySelector('.director');
const producer = document.querySelector('.producer');
const releaseDate = document.querySelector('.release-date');
const runningTime = document.querySelector('.running-time');
const description = document.querySelector('.description');
const image = document.querySelector('.image');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const req = new XMLHttpRequest();
  req.open('GET', `https://ghibliapi.herokuapp.com/films?title=${input.value}`);
  req.onload = function () {
    const res = JSON.parse(this.response);
    console.log(res);
    if (res.length === 0) return console.log('TOMT FÄLT');

    title.innerText = res[0].title;
    director.innerText = res[0].director;
    producer.innerText = res[0].producer;
    releaseDate.innerText = res[0].release_date;
    runningTime.innerText = res[0].running_time;
    description.innerText = res[0].description;
    image.innerHTML = `<img src="${res[0].image}">`;
    if (wrapper.classList.contains('hidden')) wrapper.classList.remove('hidden');
  };

  req.send();
});

//https://ghibliapi.herokuapp.com/films
