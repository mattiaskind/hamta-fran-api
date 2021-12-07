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
const filmsListContainer = document.querySelector('.films-list-container');
const filmsUl = document.querySelector('.films-list');

let firstReq = true;

filmsUl.addEventListener('click', (e) => {
  e.preventDefault();
  if (e.target.tagName !== 'A') return;
  const filmId = e.target.pathname.substring(1);

  const req = new XMLHttpRequest();
  req.open('GET', `https://ghibliapi.herokuapp.com/films/${filmId}`);
  req.onload = function () {
    const res = JSON.parse(this.response);
    filmsListContainer.classList.add('hidden');
    renderFilm(res);
  };
  req.send();
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (!firstReq) {
    wrapper.classList.add('hidden');
  }
  firstReq = false;

  const req = new XMLHttpRequest();
  req.open('GET', `https://ghibliapi.herokuapp.com/films?title=${input.value}`);
  req.onload = function () {
    const res = JSON.parse(this.response);

    // Om man inte får några resultat visas en klickbar lista med filmer
    if (res.length === 0) {
      req.open('GET', `https://ghibliapi.herokuapp.com/films`);
      req.onload = function () {
        html = '';
        filmsUl.innerHTML = '';
        const res = JSON.parse(this.response);
        res.forEach((film) => {
          html += `<li><a href="${film.id}">${film.title}</a></li>`;
        });
        filmsListContainer.classList.remove('hidden');
        filmsUl.insertAdjacentHTML('afterbegin', html);
      };
      req.send();
    } else {
      if (!filmsListContainer.classList.contains('hidden')) {
        filmsListContainer.classList.add('hidden');
      }

      renderFilm(res[0]);
    }
  };
  req.send();
});

function renderFilm(res) {
  title.innerText = res.title;
  director.innerText = res.director;
  producer.innerText = res.producer;
  releaseDate.innerText = res.release_date;
  runningTime.innerText = res.running_time + ' min';
  description.innerText = res.description;
  image.innerHTML = `<img src="${res.image}">`;

  if (wrapper.classList.contains('hidden')) wrapper.classList.remove('hidden');
  input.value = '';
  input.focus();
}
