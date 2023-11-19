// Importar las funciones para iniciar la base de datos y agregar usuarios
import {storeClient} from "./Base_Datos.js";

function inputMovement(){
    const inputs = document.getElementsByClassName('input');

    for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i];
        const label = input.nextElementSibling;

        input.addEventListener('focus', function () {
            label.style.top = '-5px';
        });

        input.addEventListener('blur', function () {
            if (input.value.trim() === '' && input.autocomplete === '') {
                label.style.top = '50%';
            }
        });
    }
}

function verifyForm(){
    let form = document.querySelector('.register--form');
    form.addEventListener('submit', function (event) {
        // Validar el formulario
        if (form.checkValidity()) {
            storeClient()
            event.preventDefault(); // Cancelar la presentación del formulario
        } else {
            event.preventDefault(); // Cancelar la presentación del formulario
        }
    })
}

function initialize() {
    inputMovement();
    verifyForm();
}

document.addEventListener("DOMContentLoaded", function () {
    initialize();
});
