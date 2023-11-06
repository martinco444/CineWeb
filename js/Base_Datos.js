var bd;

function IniciarBaseDatos()
{
    var solicitud = indexedDB.open("Base_CineWeb");

    solicitud.addEventListener("error", MostrarError);
    solicitud.addEventListener("success", Comenzar);
    solicitud.addEventListener("upgradeneeded", CrearBase);
}

function MostrarError(evento){
    alert("Tenemos un ERROR: " + evento.code + " / " + evento.message);
}


function Comenzar(evento){
    bd = evento.target.result;
    
}


function CrearBase(evento){
    var basedatos = evento.target.result;
    var almacen = basedatos.createObjectStore("Email", {KeyPath: "email"});
    almacen.createIndex("BuscarEmail", "email", {unique: false});
}


window.addEventListener("load", IniciarBaseDatos);