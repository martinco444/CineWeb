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
const navLinks = document.querySelectorAll('.cinema__link');

navLinks.forEach(link => {
    link.addEventListener('click', function (event) {
        event.preventDefault();

        const targetClass = this.getAttribute('href').substring(1); 

        const targetElement = document.querySelector(`.${targetClass}`);

        if (targetElement) {
            const headerHeight = 110; 

            const scrollToPosition = targetElement.offsetTop - headerHeight ;

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

//peliculas
function showMovies(movies) {
    const movieListElement = document.getElementsByClassName('movie__list')[0];

    movies.forEach(movieData => {
        const [title, length, classification, genres, cinemaName, originalTitle,
        originCountry, director, actors, lenguage, img, synopsis] = movieData;

        const movieItem = document.createElement('li');
        movieItem.classList.add('movie__items');
        movieItem.innerHTML = 
        `
        <figure class='movie__figure'>
            <a href='#' class='movie__link'></a>
            <img class= 'movie__img' src= '${img}'> 
            </img>
        </figure>

        <div class='movie__texts'>
            <strong>${title}</strong>
            <p>${cinemaName}</p>
        </div>
        `;
        movieListElement.appendChild(movieItem);
    });
}

//Peliculas Cinecolombia
function showCinecolombiaMovies(movies){
    const cinemaContainer = document.querySelector('.movies__cinecolombia');
    const movieListElement = cinemaContainer.querySelector('.movie__list');

    movies.forEach(movieData => {
        const [title, length, classification, genres, cinemaName, originalTitle,
        originCountry, director, actors, lenguage, img, synopsis] = movieData;
        
        if (cinemaName === "CineColombia") {
            const movieItem = document.createElement('li');
            movieItem.classList.add('movie__items');
            movieItem.innerHTML = `
                <figure class='movie__figure'>
                    <a href='${title}' class='movie__link'>
                        <img class= 'movie__img' src= '${img}'> 
                        </img>
                    </a>
                </figure>
                <div class='movie__texts'>
                    <strong>${title}</strong>
                    <p>${cinemaName}</p>
                </div>`;
            movieListElement.appendChild(movieItem);
        }
    });
}

//Peliculas Cinepolis
function showCinepolisMovies(movies){
    const cinemaContainer = document.querySelector('.movies__cinepolis');
    const movieListElement = cinemaContainer.querySelector('.movie__list');

    movies.forEach(movieData => {
        const [title, length, classification, genres, cinemaName, originalTitle,
        originCountry, director, actors, lenguage, img, synopsis] = movieData;
        
        if (cinemaName === "Cinepolis") {
            const movieItem = document.createElement('li');
            movieItem.classList.add('movie__items');
            movieItem.innerHTML = `
                <figure class='movie__figure'>
                    <img class= 'movie__img' src= '${img}'> 
                    </img>
                </figure>
                <div class='movie__texts'>
                    <strong>${title}</strong>
                    <p>${cinemaName}</p>
                </div>`;
            movieListElement.appendChild(movieItem);
        }
    });
}

//Peliculas Cinemark
function showCinemarkMovies(movies){
    const cinemaContainer = document.querySelector('.movies__cinemark');
    const movieListElement = cinemaContainer.querySelector('.movie__list');

    movies.forEach(movieData => {
        const [title, length, classification, genres, cinemaName, originalTitle,
        originCountry, director, actors, lenguage, img, synopsis] = movieData;
        
        if (cinemaName === "Cinemark") {
            const movieItem = document.createElement('li');
            movieItem.classList.add('movie__items');
            movieItem.innerHTML = `
                <figure class='movie__figure'>
                    <img class= 'movie__img' src= '${img}'> 
                    </img>
                </figure>
                <div class='movie__texts'>
                    <strong>${title}</strong>
                    <p>${cinemaName}</p>
                </div>`;
            movieListElement.appendChild(movieItem);
        }
    });
}

//Peliculas Izimovie
function showIziMovies(movies){
    const cinemaContainer = document.querySelector('.movies__izimovie');
    const movieListElement = cinemaContainer.querySelector('.movie__list');

    movies.forEach(movieData => {
        const [title, length, classification, genres, cinemaName, originalTitle,
        originCountry, director, actors, lenguage, img, synopsis] = movieData;
        
        if (cinemaName === "Izimovie") {
            const movieItem = document.createElement('li');
            movieItem.classList.add('movie__items');
            movieItem.innerHTML = `
                <figure class='movie__figure'>
                    <img class= 'movie__img' src= '${img}'> 
                    </img>
                </figure>
                <div class='movie__texts'>
                    <strong>${title}</strong>
                    <p>${cinemaName}</p>
                </div>`;
            movieListElement.appendChild(movieItem);
        }
    });
}

//Peliculas Izimovie
function showRoyalfilmMovies(movies){
    const cinemaContainer = document.querySelector('.movies__royalfilms');
    const movieListElement = cinemaContainer.querySelector('.movie__list');

    movies.forEach(movieData => {
        const [title, length, classification, genres, cinemaName, originalTitle,
        originCountry, director, actors, lenguage, img, synopsis] = movieData;
        
        if (cinemaName === "Royalfilms") {
            const movieItem = document.createElement('li');
            movieItem.classList.add('movie__items');
            movieItem.innerHTML = `
                <figure class='movie__figure'>
                    <img class= 'movie__img' src= '${img}'> 
                    </img>
                </figure>
                <div class='movie__texts'>
                    <strong>${title}</strong>
                    <p>${cinemaName}</p>
                </div>`;
            movieListElement.appendChild(movieItem);
        }
    });
}

function initialize() {
    loadMovies()
        .then(movies => {
            // showMovies(movies);
            showCinecolombiaMovies(movies)
            showCinepolisMovies(movies)
            showCinemarkMovies(movies)
            showIziMovies(movies)
            showRoyalfilmMovies(movies)
        });
}

window.onload = initialize;


//Funcionalidad del menu de seleccion
document.getElementById("genre-select").addEventListener("change", function() {
    var selectedGenero = this.value;
  
    var peliculas = document.querySelectorAll("../peliculas_data/peliculas.txt");
    peliculas.forEach(function(peliculas_data) {
      if (selectedGenero === "todos" || pelicula.classList.contains(selectedGenero)) {
        pelicula.style.display = "block";
      } else {
        pelicula.style.display = "none";
      }
    });
  });
