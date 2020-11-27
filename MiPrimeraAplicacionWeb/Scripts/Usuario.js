
listar();

function listar() {
    $.get("Usuario/ListarRol", function (data) {

        llenarCombo(data, document.getElementById("cboRol"),true);


    })

    $.get("Usuario/ListarPersonas", function (data) {

        llenarCombo(data, document.getElementById("cboPersona"),true);


    })
}

function abrirModal(id) {

    var controlesObligatorios = document.getElementsByClassName("obligatorio");
    var ncontroles = controlesObligatorios.length;

    for (var i = 0; i < ncontroles; i++) {

        controlesObligatorios[i].parentNode.classList.remove("error");


    }


    if (id == 0) {

        BorrarDatos();

    }
    else {
        $.get("Curso/RecuperarDatos/?id=" + id, function (data) {

            document.getElementById("txtIdCurso").value = data[0].IIDCURSO;
            document.getElementById("txtNombre").value = data[0].NOMBRE;
            document.getElementById("txtDescripcion").value = data[0].DESCRIPCION;

        });
        //alert("Se llamo desde el boton Editar")
    }


    //alert(id);

}

function BorrarDatos() {

    var controles = document.getElementsByClassName("borrar");
    //console.log(controles);
    var ncontroles = controles.length;
    for (var i = 0; i < ncontroles; i++) {
        controles[i].value = "";
    }
}

function llenarCombo(data, control, primerElemento) {

    var contenido = "";
    if (primerElemento == true) {

        contenido += "<option value=''>--Seleccione--</option>"

    }
    for (var i = 0; i < data.length; i++) {


        contenido += "<option value='" + data[i].IID + "'>";


        contenido += data[i].NOMBRE;

        contenido += "</option>";


    }


    control.innerHTML = contenido;
}
