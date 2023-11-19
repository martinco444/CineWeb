import { initDataBase, db } from './Base_Datos.js';

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

function inputMovement(){
    const inputs = document.querySelectorAll('.input');

    inputs.forEach(function(input){
        const label = input.nextElementSibling;

        if (input.value.trim() !== '') {
            label.style.top = '-5px';
        }

        input.addEventListener('focus', function () {
            label.style.top = '-5px';
        });

        input.addEventListener('blur', function () {
            if (input.value.trim() === '' && input.autocomplete === '') {
                label.style.top = '50%';
            }
        });
    })
}

async function startDataBase() {
    try {
        await initDataBase();

    } catch (error) {
        console.error("Error al inicializar la base de datos", error);
    }
}

function verifyForm(){
    let form = document.querySelector('.modify--form');
    form.addEventListener('submit', function (event) {
        // Validar el formulario
        if (form.checkValidity()) {
            changeCredentials();
            event.preventDefault(); // Cancelar la presentación del formulario
        } else {
            event.preventDefault(); // Cancelar la presentación del formulario
        }
    })
}

function changeCredentials(){
    const newEmail = document.querySelector('#email').value
    const newPassword = document.querySelector('#password').value
    const newFavGenre = document.querySelector('#genres--selector').value

    const authenticatedUser = getUser();

    // Actualizar los campos que se desean cambiar

    if (newEmail !== ''){
        authenticatedUser.email = newEmail;
    }

    if(newPassword !== ''){
        authenticatedUser.password = newPassword;
    }
    
    authenticatedUser.genre = newFavGenre;
    authenticatedUser.isAdmin = false

    // Abrir una transacción para modificar los datos del usuario en el objectStore 'User'
    const transaction = db.transaction(['User'], 'readwrite');
    const objectStore = transaction.objectStore('User');

    // Actualizar los datos del usuario en el objectStore
    const request = objectStore.put(authenticatedUser);

    // Manejar el éxito o el error de la operación de actualización
    request.onsuccess = function () {
        // Guardar en el local storage el usuario que ha ingresado
        localStorage.setItem('usuarioIngresado', JSON.stringify(authenticatedUser))

        swal({
            title: '!Credenciales actualizadas con éxito!',
            text: 'Los cambios han sido guardados en el sistema',
            icon: 'success',
        })
        .then((willRedirect) => {
            if (willRedirect) {
                window.location.href = "/html/CineWeb.html";
            }
        });
    };

    request.onerror = function () {
        swal({
            title: '!Error al actualizar los credenciales!',
            text: 'Por favor, intente nuevamente',
            icon: 'error',
        });
    };

}

function getUser(){
    return JSON.parse(localStorage.getItem('usuarioIngresado'));
}

async function initialize() {
    await startDataBase()
    navResponsive()
    inputMovement()
    verifyForm()
}

document.addEventListener("DOMContentLoaded", function () {
    initialize();
});
