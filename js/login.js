import { openDataBase, getData } from './Base_Datos.js';

async function verifyCredentials() {
    let registerButton = document.querySelector('#loginButton');
    await openDataBase();
    let data = getData();

    registerButton.addEventListener('click', async () => {
        let emailElement = document.querySelector("#email").value;
        let passwordElement = document.querySelector("#password").value;

        for (let key in data) {
            if (key === emailElement && data[key] === passwordElement) {
                // Almacenar información del usuario en localStorage
                localStorage.setItem('usuarioAutenticado', JSON.stringify({ email: key }));
                // Usuario autenticado, redirige a la página CineWeb.html
                window.location.href = "CineWeb.html";
                return;
            }
        }

        // Las credenciales no coinciden
        alert("Credenciales incorrectas");
    });
}

function initialize() {
    verifyCredentials()
}

document.addEventListener("DOMContentLoaded", function () {
    initialize();
});
