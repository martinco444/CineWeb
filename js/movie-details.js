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

function initialize() {
    loadMovies().then(movies => {
        // Obtener el título de la película desde los parámetros de consulta en la URL
        const params = new URLSearchParams(window.location.search);
        const movieTitle = params.get('title');

        if (movieTitle) {
            const normalizedTitle = normalizeTitle(movieTitle);
            // Busca la película con el título normalizado
            const movieData = movies.find(movie => normalizeTitle(movie[0]) === normalizedTitle);

            if (movieData) {
                const [title, length, classification, genres, cinemaName, originalTitle,
                    originCountry, director, actors, lenguage, img, synopsis] = movieData;

                // cargar imágen
                const movieFigure = document.querySelector('.movie__figure')
                const imgElement = document.querySelector('.movie__img');
                imgElement.src = img;
                movieFigure.appendChild(imgElement);

                //cargar información
                const info = document.querySelector('.movie__details')
                //verificar contenido

                info.innerHTML =
                    `
                <div class="movie__details-card">

                    <div class="movie__close-button">X</div>
                    <h3 class='movie__director'> 
                        Director: ${director}
                    </h3>
                    <h3 class='movie__actors'>
                        Actores: ${actors}
                    </h3>
                    <h3 class='movie__originalTitle'>
                        Titulo original: ${originalTitle}
                    </h3>
                    <h3 class='movie__originCountry'>
                        País de origen: ${originCountry}
                    </h3>
                    <h3 class='movie__lenguage'>
                        Idioma original: ${lenguage}
                    </h3>
                </div>
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

                // abrir card de detalles
                const button = document.querySelector('.movie__button-details');
                const card = document.querySelector('.movie__details-card');

                button.addEventListener('click', function () {
                    card.style.display = 'flex';
                });

                //cerrar card de detalles
                const closeButton = document.querySelector('.movie__close-button');

                closeButton.addEventListener('click', () => {
                    card.style.display = 'none';
                    // Aquí puedes agregar lógica adicional si es necesario al cerrar la tarjeta.
                });
            } else {
                console.error('Película no encontrada');
            }
        } else {
            console.error('Falta el título de la película en los parámetros de consulta de la URL');
        }
    });

    loadFunctions().then(functionsData => {
        const params = new URLSearchParams(window.location.search);
        const movieTitle = params.get('title');

        const functionsList = document.querySelector('.functions__list');
        const groupedFunctions = {};

        functionsData.forEach(functionData => {
            const [title, room, format, schedule, link] = functionData;

            if (title === movieTitle) {
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
                    const {schedule, link} = functionData;
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
    });
}

window.onload = initialize;