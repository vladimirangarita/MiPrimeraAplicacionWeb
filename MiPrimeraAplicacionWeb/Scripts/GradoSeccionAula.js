


Listar();

var periodo = document.getElementById("cboPeriodo");
var gradoseccion = document.getElementById("cboGradoSeccion");

periodo.onchange = function () {
    //alert("Le di a Periodo");
    if (perido.value!="" && gradoseccion.value!="") {

           $.get("GradoSeccionAula/ListarCursos/?IIDPERIODO=" + periodo.value + "&IIDGRADOSECCION=" + gradoseccion.value, function (data) {
            
            llenarCombo(data, document.getElementById("cboCurso"), true);

            
        })
    }

}

gradoseccion.onchange = function () {
    //alert("Le di a gradoseccion");
    if (periodo.value!="" && gradoseccion.value!="") {
        //alert("No estan vacios peiodo y grado seccion, Valores periodo: " + periodo.value);
        $.get("GradoSeccionAula/ListarCursos/?IIDPERIODO=" + periodo.value + "&IIDGRADOSECCION=" + gradoseccion.value, function (data) {

            llenarCombo(data, document.getElementById("cboCurso"), true);


        })
    }

}

function Listar() {
    $.get("GradoSeccionAula/Listar", function (data) {

        crearListado(["Id", "Periodo", "Grado", "Curso", "Docente"], data);
    })
    $.get("GradoSeccionAula/ListarPeriodos", function (data) {


           llenarCombo(data, document.getElementById("cboPeriodo"), true);

    })
    $.get("GradoSeccionAula/ListarGradoSeccion", function (data) {
        llenarCombo(data, document.getElementById("cboGradoSeccion"), true);
    })

    $.get("GradoSeccionAula/ListarAulas", function (data) {
        llenarCombo(data, document.getElementById("cboAula"), true);
    })

    $.get("GradoSeccionAula/ListarDocentes", function (data) {
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
function BorrarDatos() {

    var controles = document.getElementsByClassName("borrar");
    //console.log(controles);
    var ncontroles = controles.length;
    for (var i = 0; i < ncontroles; i++) {
        controles[i].value = "";
    }
}

function abrirModal(id) {
    //alert("Se llamo desde el boton Agregar")
    var controlesObligatorios = document.getElementsByClassName("obligatorio");
    var ncontroles = controlesObligatorios.length;

    for (var i = 0; i < ncontroles; i++) {

        controlesObligatorios[i].parentNode.classList.remove("error");


    }
    if (id == 0) {

        BorrarDatos();

    }
    else {
        //alert("Se llamo desde el boton Editar gradoseccionaula");
        $.get("GradoSeccionAula/RecuperarInformacion/?id=" + id, function (data) {

            document.getElementById("txtId").value = data[0].IID;
            document.getElementById("cboPeriodo").value = data[0].IIDPERIODO;
            document.getElementById("cboGradoSeccion").value = data[0].IIDGRADOSECCION;
            document.getElementById("cboCurso").value = data[0].IIDCURSO;
            document.getElementById("cboDocente").value = data[0].IIDDOCENTE;
            //alert("IIDSECCION " + data[0].IIDSECCION)
        });
        //alert("Se llamo desde el boton Editar")
    }


    //alert(id);

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
