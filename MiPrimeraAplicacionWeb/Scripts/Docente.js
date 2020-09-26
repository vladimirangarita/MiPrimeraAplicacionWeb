$("#dtFechaContrato").datepicker(

    {
        dateFormat: "dd/mm/yy",
        changeMonth: true,
        changeYear: true


    }

);


listar();
ListarComboModalidad();
$.get("Alumno/ListarSexo", function (data) {



    llenarCombo(data, document.getElementById("cbosexoPopup"), true)




});
function ListarComboModalidad() {


    $.get("Docente/ListarModalidadContrato", function (data) {

        llenarCombo(data, document.getElementById("cboTipoModalidad"), true);
        llenarCombo(data, document.getElementById("cboModalidadContratoPopup"), true);
    });
}

var cboTipoModalidad = document.getElementById("cboTipoModalidad");
cboTipoModalidad.onchange = function () {
    var iidmodalidad = document.getElementById("cboTipoModalidad").value;
    if (iidmodalidad == "") {
        listar();
    } else {
    $.get("Docente/FiltrarDocentePorModalidad/?iidmodalidad="+iidmodalidad, function (data) {

        crearListado(["Id Docente", "Nombre", "Apellido Paterno", "Apellido Materno", "Email"], data);
    });
    }
    //alert("Hola");
}

function listar() {
    $.get("Docente/ListarDocente", function (data) {

        crearListado(["Id Docente", "Nombre", "Apellido Paterno", "Apellido Materno", "Email"], data);
    });
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

function Eliminar(id) {
    if (confirm("Desea eliminar") == 1)
    {
        //Get se usa cuando la entrada en poca y la
        //Salida es mucha
        $.get("Docente/Eliminar/?id=" + id, function (data) {
            //El data es la respuesta  que vota el controlador

            if (data == 0) {
                alert("Ocurrio un error");
            } else {
                alert("Se elimino");
                listar();
            }

        });
    }
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
//function crearListado(arrayColumnas, data) {
//    var contenido = "";
//    contenido += "<table id='tabla-Alumno'class='table'>"
//    contenido += "<thead>"

//    contenido += "<tr>"

//    for (var i = 0; i < arrayColumnas.length; i++) {
//        contenido += "<td>"
//        contenido += arrayColumnas[i];
//    }

//    contenido += "</tr>"

//    contenido += "</thead>"
//    var llaves = Object.keys(data[0]);
//    contenido += "<tbody>"
//    for (var i = 0; i < data.length; i++) {

//        contenido += "<tr>"

//        for (var j = 0; j < llaves.length; j++) {
//            var valorLLaves = llaves[j];
//            contenido += "<td>";
//            contenido += data[i][valorLLaves];
//            contenido += "</td>"
//        }


//        contenido += "</tr>"

//    }

//    contenido += "</tbody>"

//    contenido += "</table>"


//    document.getElementById("tabla").innerHTML = contenido;

//    $("#tabla-Alumno").DataTable(

//        {

//            searching: false

//        }

//    );


//}
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
}