﻿


Listar();

var perido = document.getElementById("cboPeriodo");
var gradoseccion = document.getElementById("cboGradoSeccion");

perido.onchange = function () {

    if (perido.value !="" && gradoseccion.value !="") {

        $.get("GradoSeccionAula/ListarCursos/?IIDPERIODO=" + perido.value + "&IIDGRADOSECCION" + gradoseccion.value, function (data) {
            
            llenarCombo(data, document.getElementById("cboCurso"), true);

            
        })
    }

}

gradoseccion.onchange = function () {

    if (perido.value != "" && gradoseccion.value != "") {
        $.get("GradoSeccionAula/ListarCursos/?IIDPERIODO=" + perido.value + "&IIDGRADOSECCION" + gradoseccion.value, function (data) {

            llenarCombo(data, document.getElementById("cboCurso"), true);


        })
    }

}

function Listar() {
    alert("Se llamo Listar");
    $.get("GradoSeccionAula/Listar", function (data) {

        crearListado(["Id", "Periodo", "GradoSeccion", "Aula", "Docente", "Curso"], data);
    })
    $.get("GradoSeccionAula/ListarPeriodos", function (data) {


           llenarCombo(data, document.getElementById("cboPeriodo"), true);

    })
    $.get("GradoSeccion/ListarGradoSeccion", function (data) {
        llenarCombo(data, document.getElementById("cboGradoSeccion"), true);
    })

    $.get("GradoSeccion/ListarAulas", function (data) {
        llenarCombo(data, document.getElementById("cboAula"), true);
    })

    $.get("GradoSeccion/ListarDocentes", function (data) {
        llenarCombo(data, document.getElementById("cboDocente"), true);
    })
} 

function DatosObligatorios() {

    var exito = true;
    var controlesObligatorios = document.getElementsByClassName("obligatorio");
    var ncontroles = controlesObligatorios.length;
    for (var i = 0; i < ncontroles; i++) {
        if (controlesObligatorios[i].value == "") {

            exito = false;
            controlesObligatorios[i].parentNode.classList.add("error");

        }
        else {
            controlesObligatorios[i].parentNode.classList.remove("error");
        }
    }
    return exito;
}


function BorrarDatos() {

    var controles = document.getElementsByClassName("borrar");
    //console.log(controles);
    var ncontroles = controles.length;
    for (var i = 0; i < ncontroles; i++) {
        controles[i].value = "";
    }
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

    contenido += "<td>Operaciones</td>"
    contenido += "</tr>";

    contenido += "</thead>"
    var llaves = Object.keys(data[0]);
    //alert(llaves);
    contenido += "<tbody>"
    for (var i = 0; i < data.length; i++) {

        contenido += "<tr>"

        for (var j = 0; j < llaves.length; j++) {
            var valorLLaves = llaves[j];
            contenido += "<td>";
            contenido += data[i][valorLLaves];
            contenido += "</td>";
        }
        var llaveId = llaves[0];
        contenido += "<td>";
        contenido += "<button class='btn btn-primary' onclick='abrirModal(" + data[i][llaveId] + ")' data-toggle='modal' data-target='#myModal'><i class='glyphicon glyphicon-edit'></i></button> "
        contenido += "<button class='btn btn-danger' onclick='Eliminar(" + data[i][llaveId] + ")'><i class='glyphicon glyphicon-trash'></i></button>"
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
