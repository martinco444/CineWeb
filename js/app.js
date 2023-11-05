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
    const clearSearchButton = document.getElementById('clearSearchButton')

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

        //Colocar todas las películas para la búsqueda
        Array.from(originalMovieCards).forEach(function (originalCard) {
            originalCard.style.display = "flex";
        });

        //De todas las películas, buscar las que no coincidan
        Array.from(movieCards).forEach(function (movieCard) {
            const movieTitle = movieCard.querySelector(".movie__title");
            //Las películas que no coincidan con el titulo, se dejan de ver
            if (movieTitle && !movieTitle.textContent.toLowerCase().includes(searchText)) {
                movieCard.style.display = "none";
            }
        });

        //actualizar mensaje por si no hay películas
        notMoviesMessage();
    }

    function clearSearch() {
        //borrar el contenido de la barra de búsqueda
        searchInput.value = ''; 
        
        //mostrar todas las películas 
        Array.from(originalMovieCards).forEach(function (originalCard) {
            originalCard.style.display = "flex";
        });

        //actualizar mensaje por si no hay películas
        notMoviesMessage();
    }
}

//Desplazamiento del nav
function navScroll(){
    const navLinks = document.querySelectorAll('.nav__link');

    //Darle función de desplazamiento a cada link
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
            //Separar cada película mediante un salto de línea
            const movieList = data.split('\n');
            //Separar cada característica de la película mediante '|'
            const movies = movieList.map(movieData => movieData.split('|'));
            return movies;
        })
        .catch(error => {
            console.error('Error loading movies:', error);
        });
}

//Cargar funciones
function loadFunctions() {
    return fetch('/peliculas_data/funciones.txt') 
        .then(response => response.text())
        .then(data => {
            //Separar cada función de película mediante un salto de línea
            const movieList = data.split('\n');
             //Separar cada característica de la función de película mediante '|'
            const movies = movieList.map(movieData => movieData.split('|'));
            return movies;
        })
        .catch(error => {
            console.error('Error loading movies:', error);
        });
}

function normalizeTitle(title) {
    //método normalize para convertir a la forma normalizada (NFC)
    return title.normalize("NFC").toLowerCase();
}

// Función para crear elementos de película y agregar eventos de clic
function createMovieElements(movieData) {
    const [title, length, classification, genres, cinemaName, originalTitle,
         originCountry, director, actors, lenguage, img, synopsis] = movieData;

    //Crear elementos que muestran las películas
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
        // Encontrar el título de la película
        const titleElement = event.currentTarget.closest('.movie__items').querySelector('.movie__title');
        const title = titleElement.textContent;

        if (title && cinemaName) {
            // Redirige a la página de detalles con el título y el nombre del cine como parámetros
            window.location.href = `/html/movie-details.html?title=${encodeURIComponent(title)}&cinema=${encodeURIComponent(cinemaName)}`;
        }        
    });    

    return movieItem;
}

//mostar las peliculas por cine
function showMoviesForCinema(movies, cinemaName, containerSelector) {
    const cinemaContainer = document.querySelector(containerSelector);
    const movieListElement = cinemaContainer.querySelector('.movie__list');

    movies.forEach(movieData => {
        //Mostar las películas en base al cine
        if (movieData[4] === cinemaName) { 
            const movieItem = createMovieElements(movieData);
            movieListElement.appendChild(movieItem);
        }
    });
}

//Gestion de mensaje en caso de no haber películas disponibles
function notMoviesMessage() {
    const cinemaSections = document.querySelectorAll(".movies__container");

    cinemaSections.forEach(function (section) {
        const movieList = section.querySelector(".movie__list");
        const movieItems = Array.from(movieList.querySelectorAll(".movie__items"));
        const movieMessage = section.querySelector('.noMovies__message--item');

        const allItemsHidden = movieItems.every(function (item) {
            return item.style.display === 'none';
        });

        //si movie__list solo tiene el mensaje y no películas o los elementos están escondidos, no hay películas
        if (movieList.children.length === 1 || allItemsHidden) {
            movieList.style.display = 'flex';
            movieList.style.alignItems = 'center';
            movieList.style.justifyContent = 'center';

            movieMessage.style.display = 'flex';
        }

        //Si hay películas, reestablecer el formato de movieList y esconder el mensaje
        else{
            movieList.style.display = 'grid';
            movieList.style.justifyContent = 'center';
            movieList.style.alignItems = 'center';
            movieMessage.style.display = 'none';
        }
    });
}

//Función que inicializa todas las funcionalidades de la página 
function initialize() {
    loadMovies()
        .then(movies => {
            showMoviesForCinema(movies, 'CineColombia', '.movies__cinecolombia');
            showMoviesForCinema(movies, 'Cinepolis', '.movies__cinepolis');
            showMoviesForCinema(movies, 'Cinemark', '.movies__cinemark');
            showMoviesForCinema(movies, 'Izimovie', '.movies__izimovie');
            showMoviesForCinema(movies, 'Royalfilms', '.movies__royalfilms');

            //otras funciones de la página
            navResponsive()
            navScroll()
            searchMovies()
            notMoviesMessage()
        });
}

window.onload = initialize;
