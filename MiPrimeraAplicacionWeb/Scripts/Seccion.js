listar();

function listar() {

    $.get("Seccion/ListarSeccion", function (data) {

        crearListado(["Id Seccion", "Nombre Seccion"], data);

    });


}


var btnBuscar = document.getElementById("btnBuscar");

btnBuscar.onclick = function () {
    var nombre = document.getElementById("txtnombre").value;

    $.get("Seccion/Inicio/BuscarSeccionPorNombre/?nombre=" + nombre, function (data) {
        crearListado(data);
    });
}

var btnLimpiar = document.getElementById("btnLimpiar");
btnLimpiar.onclick = function () {

    $.get("Seccion/Inicio/ListarSeccion", function (data) {

        crearListado(data);

    });
    document.getElementById("txtnombre").value = "";
}


function crearListado(arrayColumnas, data) {
    var contenido = "";
    contenido += "<table id='tabla-Seccion'class='table'>"
    contenido += "<thead>"

    contenido += "<tr>"

    for (var i = 0; i < arrayColumnas.length; i++) {
        contenido += "<td>"
        contenido += arrayColumnas[i];
    }

    contenido += "<td>Operaciones</td>"
    contenido += "</tr>";

    contenido += "</thead>"
    var llaves = Object.keys(data[0]);
    contenido += "<tbody>"
    for (var i = 0; i < data.length; i++) {

        contenido += "<tr>"

        for (var j = 0; j < llaves.length; j++) {
            var valorLLaves = llaves[j];
            contenido += "<td>";
            contenido += data[i][valorLLaves];
            contenido += "</td>";
        }

        contenido += "<td>";
        contenido += "<button class='btn btn-primary'data-toggle='modal' data-target='#myModal'><i class='glyphicon glyphicon-edit'></i></button> "
        contenido += "<button class='btn btn-danger'><i class='glyphicon glyphicon-trash'></i></button>"
        contenido += "</td>";

        contenido += "</tr>";

    }

    contenido += "</tbody>"

    contenido += "</table>"


    document.getElementById("tabla").innerHTML = contenido;

    $("#tablas").DataTable(

        {

            searching: false

        }

    );


}
