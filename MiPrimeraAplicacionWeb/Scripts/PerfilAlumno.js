
function ListarCombo() {
    $.get("PerfilAlumno/ListarComboPeriodo", function (data) {



        llenarCombo(data, document.getElementById("cboPeriodo"), true);
        //crearListado(["ID", "Nombre", "Apellido Paterno", "Apellido Materno", "Telefono padre"], data);


    });
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