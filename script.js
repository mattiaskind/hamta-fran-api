const form = document.querySelector('form');
const input = document.querySelector('#input');

const overlay = document.querySelector('.overlay');
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
  pathName = e.target.href;
  const filmId = pathName.substring(pathName.indexOf('#') + 1);
  // const filmId = e.target.pathname.substring(e.target);

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

  // Det går bara att sökta på bokstäver och mellanslag. Minst två tecken krävs
  // Det ska även gå att klicka på sök utan att skriva något, då vsas en lista
  if (input.value && !/^[a-ö, ]{2,}$/i.test(input.value)) return;

  // Anpassa söksträngen så att det inte spelar någon roll om sökningen görs
  // med versaler/gemener så länge orden är de rätta.
  const words = ['in', 'the', 'of', 'from', 'on'];
  let searchFor = '';
  if (input.value) {
    searchFor = input.value
      .toLowerCase()
      .split(' ')
      .map((word, index) => {
        if (index === 0) {
          return word[0].toUpperCase() + word.substring(1);
        } else if (words.includes(word.toLowerCase())) {
          return word.toLowerCase();
        } else {
          return word[0].toUpperCase() + word.substring(1);
        }
      })
      .join(' ');
  }

  const req = new XMLHttpRequest();
  req.open('GET', `https://ghibliapi.herokuapp.com/films?title=${searchFor}`);
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
          html += `<li><a href="#${film.id}">${film.title}</a></li>`;
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
