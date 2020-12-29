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

        $.get("ProfesorNotas/ListarCursos/?iidPeriodo=" + idPeriodo + "&iidGrado=" + idGrado, function (data) {

            llenarCombo(data, document.getElementById("cboCurso"),true);

        })
    }


}

function BuscarAlumnos() {
    var idPeriodo = document.getElementById("cboPeriodo").value;
    var idGrado = document.getElementById("cboGrado").value;
    var idCurso = document.getElementById("cboCurso").value;

    if (idPeriodo != "" && idGrado != "" && idCurso !="") {
        $.get("ProfesorNotas/ListarAlumnos/?iidPeriodo=" + idPeriodo + "&iidGrado=" + idGrado + "&iidCurso=" + idCurso, function (data) {

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
    contenido += "<td>Operaciones";
    contenido += "</td>";
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
            var llaveId = llaves[0];
            var idAlumno = data[i][llaveId];
            contenido += "<td>";
            contenido += "<button class='btn btn-primary' id='btnEditar" + idAlumno + "' onclick='HabilitarEdicion(this," + idAlumno +")'>Editar</button>";
            contenido += "<button class='btn btn-success' style='display:none' id='btnGuardar" + idAlumno + "'>Guardar</button>";
            contenido += "<button class='btn btn-danger' style='display:none' id='btnCancelar" + idAlumno +"' onclick='Cancelar(this,"+idAlumno+")'>Cancelar</button>";
            contenido += "</td>";

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

function Cancelar(button, idAlumno) {
    document.getElementById("btnEditar" + idAlumno).style.display = "inline-block";
    document.getElementById("btnGuardar" + idAlumno).style.display = "none";
    document.getElementById("btnCancelar" + idAlumno).style.display = "none";

    var celda = button.parentNode;
    var fila = celda.parentNode;

    var nota1 = fila.cells[2].childNodes[0].getAttribute("data-val");
    var nota2 = fila.cells[3].childNodes[0].getAttribute("data-val");
    var nota3 = fila.cells[4].childNodes[0].getAttribute("data-val");
    var nota4 = fila.cells[5].childNodes[0].getAttribute("data-val");

    fila.cells[2].innerHTML = nota1;
    fila.cells[3].innerHTML = nota2;
    fila.cells[4].innerHTML = nota3;
    fila.cells[5].innerHTML = nota4;



}

function HabilitarEdicion(button, idAlumno) {

    document.getElementById("btnEditar" + idAlumno).style.display = "none";
    document.getElementById("btnGuardar" + idAlumno).style.display = "inline-block";
    document.getElementById("btnCancelar" + idAlumno).style.display = "inline-block";

    var celda = button.parentNode;
    var fila = celda.parentNode;

    var nota1 = fila.cells[2].innerHTML;
    var nota2 = fila.cells[3].innerHTML;
    var nota3 = fila.cells[4].innerHTML;
    var nota4 = fila.cells[5].innerHTML;

    fila.cells[2].innerHTML="<input data-val='"+nota1+"' type='number' value='"+nota1+"' min='0' max='20'/>"
    fila.cells[3].innerHTML = "<input data-val='" + nota2 +"' type='number' value='" + nota2 + "' min='0' max='20'/>"
    fila.cells[4].innerHTML = "<input data-val='" + nota3 +"' type='number' value='" + nota3 + "' min='0' max='20'/>"
    fila.cells[5].innerHTML = "<input data-val='" + nota4 +"' type='number' value='" + nota4 + "' min='0' max='20'/>"


}