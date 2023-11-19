import {initDataBase, storeAdmin, db} from './Base_Datos.js';

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
        storeAdmin()
    } catch (error) {
        console.error("Error al inicializar la base de datos", error);
    }
}

function verifyForm(){
    let form = document.querySelector('.login--form');
    form.addEventListener('submit', function (event) {
        // Validar el formulario
        if (form.checkValidity()) {
            verifyCredentials();
            event.preventDefault(); // Cancelar la presentación del formulario
        } else {
            event.preventDefault(); // Cancelar la presentación del formulario
        }
    })
}

function verifyCredentials() {
        // Obtener el valor de email y contraseña
        let emailElement = document.querySelector("#email").value;
        let passwordElement = document.querySelector("#password").value;

        // Obtener los valores de la base de datos
        let transaction = db.transaction(["User"], "readonly");
        let objectStore = transaction.objectStore("User");
        let request = objectStore.getAll();

        request.onsuccess = function (event) {
            let datos = event.target.result;

            // Verificar credenciales
            let validCredentials = false;
            let authenticatedUser = null;

            for (let i = 0; i < datos.length; i++) {
                let credencial = datos[i];
                if (credencial.email === emailElement && credencial.password === passwordElement) {
                    validCredentials = true;
                    authenticatedUser = credencial;
                    break;
                }
            }

            if (validCredentials) {
                swal.fire({
                    title: '!Ingreso correcto!',
                    text: 'redirigiendo a la paigna de CineWeb',
                    icon: 'success',
                }); 
                  
                setTimeout(function() {
                    try{
                        localStorage.removeItem('usuarioIngresado');
                    }
                    catch{}

                    const user = { 
                        email: authenticatedUser.email,
                        password: authenticatedUser.password, 
                        genre: authenticatedUser.genre, 
                        isAdmin: authenticatedUser.isAdmin
                    };

                    localStorage.setItem('usuarioIngresado', JSON.stringify(user));
                    // Redirigir a la página principal
                    window.location.href = '/html/CineWeb.html';
                }, 700);
            }            
             
            else {
                // Las credenciales no coinciden
                swal.fire({
                    title: 'Inicio de sesión fallido',
                    text: 'Verifica tus credenciales de acceso',
                    icon: 'error',
                });
            }
        };

        request.onerror = function (event) {
            console.error("Error al obtener los datos", event.target.error);
        };
    }

function initialize() {
    startDataBase()
    verifyForm()
    setTimeout(inputMovement, 100);
}

document.addEventListener("DOMContentLoaded", function () {
    initialize();
});
