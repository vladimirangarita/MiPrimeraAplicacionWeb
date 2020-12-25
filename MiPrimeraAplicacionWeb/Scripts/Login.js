//alert("Ingresar");

function voz(mensaje) {

    var vozHablar = new SpeechSynthesisUtterance(mensaje);
    window.speechSynthesis.speak(vozHablar);

}


var btnIngresar = document.getElementById("btnIngresar");

btnIngresar.onclick = function () {
    var usuario = document.getElementById("txtusuario").value;
    var contra = document.getElementById("txtcontra").value;

    $.get("Login/ValidarUsuario/?usuario="+ usuario + "&contra="  + contra, function (data){

        if (usuario == "") {
            alert("Ingrese un usuario");
            return;
        }
        if (contra == "") {
            alert("Ingrese clave");
            return;
        }
        if (data == 1) {
            //document.location.href='@Url.Action("Index","PaginaPrincipal")';
            document.location.href = "PaginaPrincipal";
            $.get("PaginaPrincipal/obtenerNombreCompleto", function myfunction() {
                voz("Bienvenido" + data + "al curso de asp.net MVC");
            })
        } else {
            //document.location.href = "PaginaPrincipal/Index";
            alert("Error");
        }

    })
}