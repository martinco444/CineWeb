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

function normalizeText(text) {
    // Usa el método normalize para convertir a la forma normalizada (NFC)
    return text.normalize("NFC").toLowerCase();
}

function handleMovieDetails(movies) {
    // Obtener el título de la película desde los parámetros de consulta en la URL
    const params = new URLSearchParams(window.location.search);
    const movieTitle = params.get('title');
    const cinema = params.get('cinema')

    if (movieTitle && cinema) {
        // Normalizar el texto obtenido de los parametros
        const normalizedMovieTitle = normalizeText(movieTitle)
        const normalizedCinema = normalizeText(cinema)

        // Buscar la película del cine correspondiente
        const movieData = movies.find(movie => normalizeText(movie[0]) === normalizedMovieTitle &&
            normalizeText(movie[4]) === normalizedCinema);

        if (movieData && cinema) {
            const [title, length, classification, genres, cinemaName, originalTitle,
                originCountry, director, actors, lenguage, img, synopsis] = movieData;

            // cargar imágen
            const movieFigure = document.querySelector('.movie__figure')
            const imgElement = document.querySelector('.movie__img');
            imgElement.src = img;
            movieFigure.appendChild(imgElement);

            //cargar información
            const info = document.querySelector('.movie__details')

            info.innerHTML =
                `
                <h2 class='movie__title'>
                    ${title}
                </h2>

                <div class='info__container'> 
                    <h3 class='movie__cinema'>
                        ${cinemaName}
                    </h3>
                    <h3 class='movie__length'>
                        ${length}
                    </h3>
                    <button class='movie__button-details'>Ver detalles</button>
                </div>
                <h3 class='movie__classification'>
                    Clasificación: ${classification}
                </h3>
                <h3 class='movie__genres'>
                    Géneros: ${genres}
                </h3>
                <p class='movie__synopsis'>
                    ${synopsis}
                </p>
                `;

            // abrir detalles de las películas
            const button = document.querySelector('.movie__button-details');
            const movieDetailsText = [
                director && `<h4 class='movie__details--feature'>Director: </h4> <p class='movie__details--text'>${director}</p>`,
                originalTitle && `<h4 class='movie__details--feature'>Titulo original: </h4> <p class='movie__details--text'>${originalTitle}</p>`,
                actors && `<h4 class='movie__details--feature'>Actores: </h4> <p class='movie__details--text'>${actors}</p>`,
                originCountry && `<h4 class='movie__details--feature'>País de origen: </h4> <p class='movie__details--text'>${originCountry}</p>`,
                lenguage && `<h4 class='movie__details--feature'>Idioma original: </h4> <p class='movie__details--text'>${lenguage}</p>`
            ].filter(Boolean).join('\n') || 'No hay detalles disponibles para esta película';

            button.addEventListener('click', function () {
                swal.fire({
                    title: 'Detalles Película',
                    html: movieDetailsText
                });
            });

        } else {
            console.error('Película no encontrada');
        }
    } else {
        console.error('Falta el título de la película en los parámetros de consulta de la URL');
    }

    navResponsive()
}

function handleMovieFunctions(functionsData) {
    const params = new URLSearchParams(window.location.search);
    const movieTitle = params.get('title');
    const cinema = params.get('cinema')

    if (movieTitle && cinema) {
        // Normalizar el texto obtenido de los parametros
        const normalizedMovieTitle = normalizeText(movieTitle)
        const normalizedCinema = normalizeText(cinema)

        const functionsList = document.querySelector('.functions__list');
        const groupedFunctions = {};

        functionsData.forEach(functionData => {
            const [title, cinemaName, room, format, schedule, link] = functionData;
            const normalizedTitle = normalizeText(title)
            const normalizedCinemaName = normalizeText(cinemaName)

            if (normalizedTitle === normalizedMovieTitle && normalizedCinemaName === normalizedCinema) {
                // Agrupar funciones por sala y formato
                if (!groupedFunctions[room]) {
                    groupedFunctions[room] = {};
                }
                if (!groupedFunctions[room][format]) {
                    groupedFunctions[room][format] = [];
                }

                groupedFunctions[room][format].push({ schedule, link });
            }
        });

        for (const room in groupedFunctions) {
            const roomItem = document.createElement('li');
            roomItem.classList.add('function__container');
            roomItem.innerHTML = `
                <a class='function__link'>
                    <div class='function__item''>
                        <h3 class='room__title'>
                            Sala: ${room}
                        </h3>
                        <ul class='function__room'></ul>
                    </div>
                </a>
            `;
            const linkItem = roomItem.querySelector('.function__link');
            const roomList = roomItem.querySelector('ul');

            for (const format in groupedFunctions[room]) {
                const formatItem = document.createElement('li');
                formatItem.classList.add('function__format');
                formatItem.innerHTML = `
                <h4 class='format__title'>
                    Formato: ${format}
                </h4>
                <ul class='function__schedules'></ul>
                `;
                const formatList = formatItem.querySelector('ul');

                groupedFunctions[room][format].forEach(functionData => {
                    const { schedule, link } = functionData;
                    linkItem.href = link;

                    const functionItem = document.createElement('li');
                    functionItem.classList.add('schedule__item')
                    functionItem.innerHTML = `
                    <h4 class='schedule'>
                        Horarios: ${schedule}
                    </h4>
                    `;
                    formatList.appendChild(functionItem);
                });

                roomList.appendChild(formatItem);
            }

            functionsList.appendChild(roomItem);
        }

        // Comprobar si no se encontraron funciones
        if (functionsList.childElementCount === 0) {
            const noFunctions = document.createElement('li');
            noFunctions.classList.add('noFunctions')
            noFunctions.innerHTML = `
            <h4 class='noFunctions__title'>
                No se encontraron funciones para esta película.
            </h4>
            `;
            functionsList.appendChild(noFunctions);
        }

        const linkItem = document.querySelector('.function__link');
        buttonLink = document.querySelectorAll('.function__container')
        buttonLink.forEach(button => {
            button.addEventListener('click', function (event) {
                event.preventDefault()
                Swal.fire({
                    title: '¿Seguro que deseas continuar?',
                    text: 'Serás redirigido a la página del cine seleccionado',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Aceptar',
                    cancelButtonText: 'Cancelar',
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.open(linkItem.href); // Redirigir si se confirma
                    } else if (result.dismiss === Swal.DismissReason.cancel) {}
                });                  
            })
        })
    }
}

function initialize() {
    loadMovies().then(movies => {
        handleMovieDetails(movies);
    });

    loadFunctions().then(functionsData => {
        handleMovieFunctions(functionsData);
    });
}

document.addEventListener("DOMContentLoaded", function () {
    initialize();
});
