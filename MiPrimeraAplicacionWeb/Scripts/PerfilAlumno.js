
window.onload = function () {
    ListarCombo();
}


function ListarCombo() {
    $.get("PerfilAlumno/ListarComboPeriodo", function (data) {



        llenarCombo(data, document.getElementById("cboPeriodo"), true);
        //crearListado(["ID", "Nombre", "Apellido Paterno", "Apellido Materno", "Telefono padre"], data);


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

    //contenido += "<td>Operaciones</td>"
    contenido += "</tr>";

    contenido += "</thead>"
    var llaves = Object.keys(data[0]);
    //alert(llaves);
    contenido += "<tbody>"

    //creare condicion
    if (data.length==0) {
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
        //var llaveId = llaves[0];
        //contenido += "<td>";
        //contenido += "<button class='btn btn-primary' onclick='abrirModal(" + data[i][llaveId] + ")' data-toggle='modal' data-target='#myModal'><i class='glyphicon glyphicon-edit'></i></button> "
        //contenido += "<button class='btn btn-danger' onclick='Eliminar(" + data[i][llaveId] + ")'><i class='glyphicon glyphicon-trash'></i></button>"
        //contenido += "</td>";

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
function listarCursosPeriodo() {

    var periodo = document.getElementById("cboPeriodo").value;
    if (periodo=="") {
        document.getElementById("tabla").innerHTML = "Seleccione un periodo";
    }
    else {
        $.get("PerfilAlumno/ListarCursosPorPeriodo/?iidPeriodo="+periodo, function (data) {



            //llenarCombo(data, document.getElementById("cboPeriodo"), true);
            ////crearListado(["ID", "Nombre", "Apellido Paterno", "Apellido Materno", "Telefono padre"], data);
            crearListado(["Id Matricula", "Nombre del curso",
                "Nota 1", "Nota 2", "Nota 3", "Nota 4", "Promedio"], data);

        });
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