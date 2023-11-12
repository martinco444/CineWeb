let bd;

function openDataBase() {
    return new Promise((resolve, reject) => {
        let request = indexedDB.open("Base_CineWeb");

        request.addEventListener("error", (event) => {
            reject(event);
        });

        request.addEventListener("success", (event) => {
            start(event);
            resolve();  
        });

        request.addEventListener("upgradeneeded", (event) => {
            createDataBase(event);
        });
    });
}

function openAndWriteDataBase() {
    return new Promise((resolve, reject) => {
        let request = indexedDB.open("Base_CineWeb");
        let registerButton = document.querySelector('#registerButton');

        registerButton.addEventListener('click', storeClient);

        request.addEventListener("error", (event) => {
            reject(event);
        });

        request.addEventListener("success", (event) => {
            start(event);
            resolve();
        });

        request.addEventListener("upgradeneeded", (event) => {
            createDataBase(event);
        });
    });
}

function start(event) {
    //Crear variable bd
    bd = event.target.result;
    //Obtener la información de la base de datos
    data()
}

function createDataBase(evento) {
    let dataBase = evento.target.result;
    let store = dataBase.createObjectStore("Email", { keyPath: "email" });
    store.createIndex("BuscarEmail", "email", { unique: false });
}

function storeClient() {
    let emailElement = document.querySelector("#email").value;
    let passwordElement = document.querySelector("#password").value;

    let transaction = bd.transaction(["Email"], "readwrite");
    let store = transaction.objectStore("Email");

    store.add({ 
        email: emailElement,
        password: passwordElement 
    }
    , emailElement);

    document.querySelector("#email").value = "";
    document.querySelector("#password").value = "";
    localStorage.setItem('nombreBaseDatos', 'Base_CineWeb');
}

function data(){
    let transaction = bd.transaction(['Email'])
    let store = transaction.objectStore('Email')
    let pointer = store.openCursor()

    pointer.addEventListener('success', writeInfo)
}

function writeInfo(event){
    let pointer = event.target.result;
    if (pointer){
        data_values[pointer.value.email] = pointer.value.password
        pointer.continue()
    }
}

function getData(){
    return data_values
}

let data_values = {}

export {openDataBase, openAndWriteDataBase, getData};
