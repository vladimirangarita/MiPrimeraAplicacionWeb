window.onload = function () {
    $.get("ProfesorNotas/ListarPeriodos", function (data) {

        llenarCombo(data, document.getElementById("cboPeriodo"), true);


    })
}

function BuscarGrado() {
    var idPeriodo = document.getElementById("cboPeriodo").value;
    if (idPeriodo!="") {

        $.get("ProfesorNotas/ListarGrados/?iidPeriodo=" + idPeriodo, function (data) {

            llenarCombo(data, document.getElementById("cboGrado"), true);


        })

    }
}

function BuscarCurso() {
    var idPeriodo = document.getElementById("cboPeriodo").value;
    var idGrado = document.getElementById("cboGrado").value;

    if (idPeriodo != "" && idGrado != "") {
        $.get("ProfesorNotas/ListarCursos/?iidPeriodo=" + idPeriodo + "&iidGrado" + idGrado, function (data) {

            llenarCombo(data, document.getElementById("cboCurso"),true);

        })
    }


}

function BuscarAlumnos() {
    var idPeriodo = document.getElementById("cboPeriodo").value;
    var idGrado = document.getElementById("cboGrado").value;
    var idCurso = document.getElementById("cbocurso").value;

    if (idPeriodo != "" && idGrado != "" && idCurso !="") {
        $.get("ProfesorNotas/ListarAlumnos/?iidPeriodo=" + idPeriodo + "&iidGrado" + idGrado + "&iidCurso" + idCurso, function (data) {

            //llenarCombo(data, document.getElementById("cboCurso"), true);
            crearListado(["Id Alumno", "Nombre", "Nota I", "Nota II", "Nota III", "Nota IV", "Promedio"], data);

        })
    } else {
        document.getElementById("tabla").innerHTML = "";
        alert("debe seleccionar todos lo campos para la busqueda.");
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

function crearListado(arrayColumnas, data) {
    var contenido = "";
    contenido += "<table id='tablas'class='table'>"
    contenido += "<thead>"

    contenido += "<tr>"

    for (var i = 0; i < arrayColumnas.length; i++) {
        contenido += "<td>"
        contenido += arrayColumnas[i];
    }

    //contenido += "<td>Operaciones</td>"
    contenido += "</tr>";

    contenido += "</thead>"
    var llaves = Object.keys(data[0]);
    //alert(llaves);
    contenido += "<tbody>"

    //creare condicion
    if (data.length == 0) {
        contenido += "";
    } else {


        for (var i = 0; i < data.length; i++) {

            contenido += "<tr>"

            for (var j = 0; j < llaves.length; j++) {
                var valorLLaves = llaves[j];
                contenido += "<td>";
                contenido += data[i][valorLLaves];
                contenido += "</td>";
            }
            
            contenido += "</tr>";

        }
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