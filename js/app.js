const menu = document.querySelector('.nav__menu');
const menuList = document.querySelector('.nav__list')
const links = document.querySelectorAll('.nav__link')

menu.addEventListener('click', function () {
    menuList.classList.toggle('nav__list--show')
});

links.forEach(function (link) {
    link.addEventListener('click', function () {
        menuList.classList.remove('nav__list--show')
    })
});

//Desplazamiento del nav
const navLinks = document.querySelectorAll('.nav__link');

navLinks.forEach(link => {
    link.addEventListener('click', function (event) {
        event.preventDefault();

        const targetClass = this.getAttribute('href').substring(1);

        const targetElement = document.querySelector(`.${targetClass}`);

        if (targetElement) {
            const headerHeight = 110;

            const scrollToPosition = targetElement.offsetTop - headerHeight;

            window.scrollTo({
                top: scrollToPosition,
                behavior: 'smooth'
            });
        }
    });
});

//Cargar peliculas
function loadMovies() {
    return fetch('/peliculas_data/peliculas.txt')
        .then(response => response.text())
        .then(data => {
            const movieList = data.split('\n');
            const movies = movieList.map(movieData => movieData.split('|'));
            return movies;
        })
        .catch(error => {
            console.error('Error loading movies:', error);
        });
}

//Cargar funciones
function loadFunctions() {
    return fetch('/peliculas_data/funciones.txt') // Devolver la promesa resultante
        .then(response => response.text())
        .then(data => {
            const movieList = data.split('\n');
            const movies = movieList.map(movieData => movieData.split('|'));
            return movies;
        })
        .catch(error => {
            console.error('Error loading movies:', error);
        });
}

function normalizeTitle(title) {
    // Usa el método normalize para convertir a la forma normalizada (NFC)
    return title.normalize("NFC").toLowerCase();
}

// Función para crear elementos de película y agregar eventos de clic
function createMovieElements(movieData) {
    const [title, length, classification, genres, cinemaName, originalTitle,
         originCountry, director, actors, lenguage, img, synopsis] = movieData;

    const movieItem = document.createElement('li');
    movieItem.classList.add('movie__items');
    movieItem.innerHTML = `
        <figure class='movie__figure'>
            <img class='movie__img' src='${img}' data-title='${title}' data-cinema='${cinemaName}'></img>
        </figure>
        <div class='movie__texts'>
            <h3 class='movie__title'>${title}</h3>
            <h4 class='movie__cinema'>${cinemaName}</p>
        </div>`;

    // Agregar evento de clic a la imagen
    movieItem.querySelector('.movie__img').addEventListener('click', (event) => {
        // Encuentra el título de la película a partir de la clase "movie__title"
        const titleElement = event.currentTarget.closest('.movie__items').querySelector('.movie__title');
        const title = titleElement.textContent;

        if(title && cinemaName){
            // Redirige a la página de detalles con el título de la película
            window.location.href = `/html/movie-details.html?title=${encodeURIComponent(title)}`;
        }
    });    

    return movieItem;
}

// Función para mostrar películas para un cine específico
function showMoviesForCinema(movies, cinemaName, containerSelector) {
    const cinemaContainer = document.querySelector(containerSelector);
    const movieListElement = cinemaContainer.querySelector('.movie__list');

    movies.forEach(movieData => {
        if (movieData[4] === cinemaName) { // Obtener el nombre del cine desde movieData
            const movieItem = createMovieElements(movieData);
            movieListElement.appendChild(movieItem);
        }
    });
}

function initialize() {
    loadMovies()
        .then(movies => {
            showMoviesForCinema(movies, 'CineColombia', '.movies__cinecolombia');
            showMoviesForCinema(movies, 'Cinepolis', '.movies__cinepolis');
            showMoviesForCinema(movies, 'Cinemark', '.movies__cinemark');
            showMoviesForCinema(movies, 'Izimovie', '.movies__izimovie');
            showMoviesForCinema(movies, 'Royalfilms', '.movies__royalfilms');
        });
}

window.onload = initialize;
