//Activar el nav en pantallas pequeñas
function navResponsive(){
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
}

//busqueda de películas
const originalMovieCards = document.getElementsByClassName("movie__items");

function searchMovies() {
    const searchInput = document.getElementById("searchInput");
    const searchButton = document.getElementById("searchButton");

    searchInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            performSearch();
        }
    });

    searchButton.addEventListener("click", function () {
        performSearch();
    });

    clearSearchButton.addEventListener("click", function () {
        clearSearch();
    });

    function performSearch() {
        const searchText = searchInput.value.toLowerCase();
        const movieCards = document.getElementsByClassName("movie__items");

        Array.from(originalMovieCards).forEach(function (originalCard) {
            originalCard.style.display = "flex";
        });

        // Realiza la búsqueda
        Array.from(movieCards).forEach(function (movieCard) {
            const movieTitle = movieCard.querySelector(".movie__title");
            if (movieTitle && !movieTitle.textContent.toLowerCase().includes(searchText)) {
                movieCard.style.display = "none";
            }
        });

        notMoviesMessage();
    }

    function clearSearch() {
        searchInput.value = ''; 
        
        Array.from(originalMovieCards).forEach(function (originalCard) {
            originalCard.style.display = "flex";
        });

        notMoviesMessage();
    }
}

//Desplazamiento del nav
function navScroll(){
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
}

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
            <p class='movie__cinema'>${cinemaName}</p>
        </div>`;

    // Agregar evento de clic a la imagen
    movieItem.querySelector('.movie__img').addEventListener('click', (event) => {
        // Encuentra el título de la película a partir de la clase "movie__title"
        const titleElement = event.currentTarget.closest('.movie__items').querySelector('.movie__title');
        const title = titleElement.textContent;

        if (title && cinemaName) {
            // Redirige a la página de detalles con el título y el nombre del cine como parámetros
            window.location.href = `/html/movie-details.html?title=${encodeURIComponent(title)}&cinema=${encodeURIComponent(cinemaName)}`;
        }        
    });    

    return movieItem;
}

function showMoviesForCinema(movies, cinemaName, containerSelector) {
    const cinemaContainer = document.querySelector(containerSelector);
    const movieListElement = cinemaContainer.querySelector('.movie__list');

    movies.forEach(movieData => {
        if (movieData[4] === cinemaName) { 
            const movieItem = createMovieElements(movieData);
            movieListElement.appendChild(movieItem);
        }
    });
}

function notMoviesMessage() {
    const cinemaSections = document.querySelectorAll(".movies__container");

    cinemaSections.forEach(function (section) {
        const movieList = section.querySelector(".movie__list");
        const movieItems = Array.from(movieList.querySelectorAll(".movie__items"));
        const movieMessage = section.querySelector('.noMovies__message--item');
        // Verifica si todos los elementos <li> de clase "movie__items" tienen display: none
        const allItemsHidden = movieItems.every(function (item) {
            return item.style.display === 'none';
        });

        // Si todos los elementos están ocultos, muestra el mensaje
        if (movieList.children.length === 1 || allItemsHidden) {
            movieList.style.display = 'flex';
            movieList.style.alignItems = 'center';
            movieList.style.justifyContent = 'center';

            movieMessage.style.display = 'flex';
        }

        else{
            movieList.style.display = 'grid';
            movieMessage.style.display = 'none';
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
            //otras funciones
            navResponsive()
            navScroll()
            searchMovies()
            notMoviesMessage()
        });
}

window.onload = initialize;
