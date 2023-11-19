//Activar el nav en pantallas pequeñas
function navResponsive() {
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
            hideNav()
        }
    });

    searchButton.addEventListener("click", function () {
        performSearch();
        hideNav()
    });

    clearSearchButton.addEventListener("click", function () {
        clearSearch();
    });

    function hideNav() {
        const menuList = document.querySelector('.nav__list')

        menuList.classList.toggle('nav__list--show')
    }

    function performSearch() {
        const searchText = searchInput.value.toLowerCase();
        //Buscador de películas en los generos favoritos
        const movieGenresList = document.querySelector('.movie__genres--list')

        if (movieGenresList.children.length > 1) {

            const movieCards = movieGenresList.querySelectorAll(".movie__items");

            // Colocar todas las películas para la búsqueda dentro de cada contenedor
            Array.from(movieCards).forEach(function (movieCard) {
                movieCard.style.display = "flex";
            });

            // De todas las películas, buscar las que no coincidan dentro de cada contenedor
            Array.from(movieCards).forEach(function (movieCard) {
                const movieTitle = movieCard.querySelector(".movie__title");
                // Las películas que no coincidan con el título, se dejan de ver
                if (movieTitle && !movieTitle.textContent.toLowerCase().includes(searchText)) {
                    movieCard.style.display = "none";
                }
            });
        }


        //Buscador de películas en todos los cines
        const movieContainers = document.querySelectorAll('.movies__container');

        movieContainers.forEach(function (container) {
            const movieCards = container.querySelectorAll(".movie__items");

            // Colocar todas las películas para la búsqueda dentro de cada contenedor
            Array.from(movieCards).forEach(function (movieCard) {
                movieCard.style.display = "flex";
            });

            // De todas las películas, buscar las que no coincidan dentro de cada contenedor
            Array.from(movieCards).forEach(function (movieCard) {
                const movieTitle = movieCard.querySelector(".movie__title");
                // Las películas que no coincidan con el título, se dejan de ver
                if (movieTitle && !movieTitle.textContent.toLowerCase().includes(searchText)) {
                    movieCard.style.display = "none";
                }
            });
        });

        // Actualizar mensaje por si no hay películas
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
function navScroll() {
    const navLinks = document.querySelectorAll('.nav__scroll');

    //Darle función de desplazamiento a cada link
    navLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();

            const targetClass = this.getAttribute('href').substring(1);
            const targetElement = document.querySelector(`.${targetClass}`);

            if (targetElement) {
                const menuList = document.querySelector('.nav__list')
                const links = document.querySelectorAll('.nav__link')

                menuList.classList.toggle('nav__list--show')

                links.forEach(function () {
                    menuList.classList.remove('nav__list--show')
                });

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

function normalizeText(text) {
    //método normalize para convertir a la forma normalizada (NFC)
    return text.normalize("NFC").toLowerCase();
}

function movieScroll() {
    const movieList = document.querySelector('.movie__genres--list');
    const leftArrow = document.querySelector('.arrow.left');
    const rightArrow = document.querySelector('.arrow.right');
    let scrollAmount = 0;   // Cantidad de desplazamiento en píxeles

    function setScrollAmount() {
        if (window.innerWidth > 850) {
            scrollAmount = 600;
        } else {
            scrollAmount = 200;
        }
    }

    // Llama a setScrollAmount cuando se carga la página
    setScrollAmount();

    // Agrega un listener para el evento resize que ajusta el scrollAmount
    window.addEventListener('resize', setScrollAmount);

    leftArrow.addEventListener('click', function () {
        movieList.scrollLeft -= scrollAmount;
    });

    rightArrow.addEventListener('click', function () {
        movieList.scrollLeft += scrollAmount;
    })
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
            window.location.href = `/html/movie-details.html?&title=${normalizeText(title)}&cinema=${normalizeText(cinemaName)}`;
        }
    });

    return movieItem;
}

function addMovieElement(movieData) {
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
            window.location.href = `/html/movie-details.html?&title=${normalizeText(title)}&cinema=${normalizeText(cinemaName)}`;
        }
    });

    return movieItem;
}

async function showMoviesForGenre(movies, containerSelector) {
    const user = getUser()

    const cinemaContainer = document.querySelector(containerSelector);
    const movieListElement = cinemaContainer.querySelector('.movie__genres--list');

    console.log(user)

    if (user && user.genre !== '') {
        movies.forEach(movieData => {
            const genreUser = user.genre.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            const genrePelicula = movieData[3].toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

            if (genrePelicula.includes(genreUser)) {
                const movieItem = createMovieElements(movieData);
                movieListElement.appendChild(movieItem);
            }
        });
    }

    else {
        cinemaContainer.style.display = 'none';
    }
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

function addMoviesForCinema(movie, containerSelector) {
    const cinemaContainer = document.querySelector(containerSelector);
    const movieListElement = cinemaContainer.querySelector('.movie__list');

    console.log(movie)
    // console.log(img)

    const movieItem = addMovieElement(movie);
    movieListElement.appendChild(movieItem);

}

//Gestion de mensaje en caso de no haber películas disponibles
function notMoviesMessage() {
    const movieGenresList = document.querySelectorAll('.movie__genres--list')

    movieGenresList.forEach(function (movieList) {
        const movieItems = Array.from(movieList.querySelectorAll(".movie__items"));

        const allItemsHidden = movieItems.every(function (item) {
            return item.style.display === 'none';
        });

        const movieMessage = movieList.querySelector('.noMovies__message--item');
        //si movie__list solo tiene el mensaje y no películas o los elementos están escondidos, no hay películas
        if (movieList.children.length === 1 || allItemsHidden) {
            movieList.style.display = 'flex';
            movieList.style.alignItems = 'center';
            movieList.style.justifyContent = 'center';

            movieMessage.style.display = 'flex';
        }

        //Si hay películas, reestablecer el formato de movieList y esconder el mensaje
        else {
            movieList.style.display = 'flex';
            movieList.style.alignItems = 'center';
            movieList.style.justifyContent = 'left';
            movieMessage.style.display = 'none';
        }
    });

    const moviesList = document.querySelectorAll(".movie__list");

    moviesList.forEach(function (movieList) {
        const movieItems = Array.from(movieList.querySelectorAll(".movie__items"));

        const allItemsHidden = movieItems.every(function (item) {
            return item.style.display === 'none';
        });

        const movieMessage = movieList.querySelector('.noMovies__message--item');
        //si movie__list solo tiene el mensaje y no películas o los elementos están escondidos, no hay películas
        if (movieList.children.length === 1 || allItemsHidden) {
            movieList.style.display = 'flex';
            movieList.style.alignItems = 'center';
            movieList.style.justifyContent = 'center';

            movieMessage.style.display = 'flex';
        }

        //Si hay películas, reestablecer el formato de movieList y esconder el mensaje
        else {
            movieList.style.display = 'grid';
            movieList.style.justifyContent = 'center';
            movieList.style.alignItems = 'center';
            movieMessage.style.display = 'none';
        }
    });
}

function adminActions() {
    const adminItem = document.querySelector('#adminItem');
    adminItem.addEventListener('click', function () {
        Swal.fire({
            title: 'Agregar película',
            html:
                '<input id="title" class="swal2-input" placeholder="Título">' +
                '<input id="length" class="swal2-input" placeholder="Duración">' +
                '<input id="clasification" class="swal2-input" placeholder="Clasificación">' +
                '<input id="genres" class="swal2-input" placeholder="Géneros">' +
                '<input id="img" class="swal2-input" placeholder="Link imágen">' +
                '<select id="cinemaName" class="swal2-select">' +
                '<option value="CineColombia">CineColombia</option>' +
                '<option value="Cinepolis">Cinepolis</option>' +
                '<option value="Cinemark">Cinemark</option>' +
                '<option value="Izimovie">Izimovie</option>' +
                '<option value="Royalfilms">Royalfilms</option>' +
                '</select>',
            focusConfirm: false,
            showCancelButton: true,

            preConfirm: () => {
                const title = Swal.getPopup().querySelector('#title').value;
                const length = Swal.getPopup().querySelector('#length').value
                const clasification = Swal.getPopup().querySelector('#clasification').value
                const genre = Swal.getPopup().querySelector('#genres').value;
                const img = Swal.getPopup().querySelector('#img').value;
                const cinemaName = Swal.getPopup().querySelector('#cinemaName').value;
                const cinemaContainers = {
                    'CineColombia': '.movies__cinecolombia',
                    'Cinepolis': '.movies__cinepolis',
                    'Cinemark': '.movies__cinemark',
                    'Izimovie': '.movies__izimovie',
                    'Royalfilms': '.movies__royalfilms'
                };

                // Verificar si el cinemaName existe en el objeto y asignar el valor correspondiente a cinemaContainer
                let cinemaContainer = cinemaContainers[cinemaName]

                const movie = [
                    title,
                    length,
                    clasification,
                    genre,
                    cinemaName,
                    '',
                    '',
                    '',
                    '',
                    '',
                    img,
                    ''
                ];

                addMoviesForCinema(movie, cinemaContainer)
            }
        })
    })
}

function getUser() {
    // Obtener el usuario que ha ingresado
    return JSON.parse(localStorage.getItem('usuarioIngresado'));
}

function isAdmin() {
    const user = getUser()
    if (user.isAdmin == true) {
        const navAdmin = document.querySelector('.admin__item')
        navAdmin.style.display = 'flex'
    }
}

//Función que inicializa todas las funcionalidades de la página 
async function initialize() {
    loadMovies()
        .then(movies => {
            const promises = [
                showMoviesForGenre(movies, '.movies__genres'),
                showMoviesForCinema(movies, 'CineColombia', '.movies__cinecolombia'),
                showMoviesForCinema(movies, 'Cinepolis', '.movies__cinepolis'),
                showMoviesForCinema(movies, 'Cinemark', '.movies__cinemark'),
                showMoviesForCinema(movies, 'Izimovie', '.movies__izimovie'),
                showMoviesForCinema(movies, 'Royalfilms', '.movies__royalfilms')
            ];

            return Promise.all(promises);
        })
        .then(() => {
            movieScroll();
            navResponsive();
            navScroll();
            searchMovies();
            notMoviesMessage();
            isAdmin()
            adminActions()
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


document.addEventListener("DOMContentLoaded", function () {
    initialize();
});
