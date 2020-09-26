$("#datepickerInicio").datepicker(

    {
        dateFormat: "dd/mm/yy",
        changeMonth: true,
        changeYear: true
      

    }

);
Listar()
function Listar() {
    $.get("Periodo/ListarPeriodo", function (data) {
        crearListado(["Id Periodo", "Periodo", "Fecha inicio", "Fecha fin"], data);

    })
}
$("#datepickerFin").datepicker(

    {
        dateFormat: "dd/mm/yy",
        changeMonth: true,
        changeYear: true
      
    }
);



var nombrePeriodo = document.getElementById("txtnombre");
nombrePeriodo.onkeyup = function () {

    //alert("Hola");
    var nombre = document.getElementById("txtnombre").value;
    $.get("Periodo/BuscarPeriodoPorNombre/?NombrePeriodo=" + nombre, function (data) {
        
        crearListado(data);
    });


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

    $("#tabla-Alumno").DataTable(

        {

            searching: false

        }

    );


}


function Eliminar(id) {

    if (confirm("Desea eliminar el registro") == 1) {
        var frm = new FormData();
        frm.append("IIDPERIODO", id);

        $.ajax(
            {
                type: "POST",
                url: "Periodo/Eliminar",
                data: frm,
                contentType: false,
                processData: false,
                success: function (data) {

                    if (data == 0) {
                        alert("Ocurrio un error");
                    } else {

                        alert("Se elimino correctamente");
                        Listar();
                    }

                }
            }

        );
    }

}

function abrirModal(id) {

    var controlesObligatorios = document.getElementsByClassName("obligatorio");
    var ncontroles = controlesObligatorios.length;

    for (var i = 0; i < ncontroles; i++) {

        controlesObligatorios[i].parentNode.classList.remove("error");


    }


    if (id == 0) {

        BorrarDatos();
        //alert("Se llamo desde el boton agregar")
        //document.getElementById("txtIdCurso").value = "";
        //document.getElementById("txtNombre").value = "";
        //document.getElementById("txtDescripcion").value = "";



    }
    else {

        $.get("Periodo/RecuperarInformacion/?id=" + id, function (data) {

            document.getElementById("txtIdPeriodo").value = data[0].IIDPERIODO;
            document.getElementById("txtnombrePopup").value = data[0].NOMBRE;

            document.getElementById("datepickerInicio").value = data[0].FECHAINICIOCADENA;
            document.getElementById("datepickerFin").value = data[0].FECHAFINCADENA;
            //alert(JSON.stringify(data));
        })


        //$.get("Curso/RecuperarDatos/?id=" + id, function (data) {

        //    document.getElementById("txtIdCurso").value = data[0].IIDCURSO;
        //    document.getElementById("txtNombre").value = data[0].NOMBRE;
        //    document.getElementById("txtDescripcion").value = data[0].DESCRIPCION;

        //});
        //alert("Se llamo desde el boton Editar")
    }


    //alert(id);

}
BorrarDatos();

function BorrarDatos() {

    var controles = document.getElementsByClassName("borrar");
    //console.log(controles);
    var ncontroles = controles.length;
    for (var i = 0; i < ncontroles; i++) {
        controles[i].value = "";
    }
}

function Agregar() {

    if (DatosObligatorios() == true) {

        var frm = new FormData();
        var idPeriodo = document.getElementById("txtIdPeriodo").value;
        var nombre = document.getElementById("txtnombrePopup").value;
        var fechainicio = document.getElementById("datepickerInicio").value;
        var fechafin = document.getElementById("datepickerFin").value;



        frm.append("IIDPERIODO", idPeriodo);
        frm.append("NOMBRE", nombre);
        frm.append("FECHAINICIO", fechainicio);
        frm.append("FECHAFIN", fechafin);
        frm.append("BHABILITADO", 1);

        if (confirm("Desea realizar operacion?") == 1) {

            $.ajax({
                type: "POST",
                url: "Periodo/GuardarDatos",
                data: frm,
                contentType: false,
                processData: false,
                success: function (data) {
                    if (data != 0) {
                        Listar();
                        alert("Se ejecuto correctamente");
                        document.getElementById("btnCancelar").click();
                    } else {
                        alert("Ocurrio un error;");
                    }
                }

            });

        }
    } else {


    };
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
//    //Añadimos una columna
//    contenido += "<td>Operaciones</td >";
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
//        contenido += "<td>";
//        contenido += "<button class='btn btn-primary' data-toggle='modal' data-target='#myModal'><i class='glyphicon glyphicon-edit'></i></button> "
//        contenido += "<button class='btn btn-danger'><i class='glyphicon glyphicon-trash'></i></button>"
//        contenido += "</td>";

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

//function crearListado(data) {

//    var contenido = "";

//    contenido += "<table id = 'tabla-periodo'class='table'>";
//    contenido += "<thead>";
//    contenido += "<tr>";

//    contenido += "<td>Id Periodo</td>";
//    contenido += "<td>Nombre</td>";
//    contenido += "<td>Fecha inicio</td>";
//    contenido += "<td>Fecha fin</td>";

//    contenido += "</tr>";

//    for (var i = 0; i < data.length; i++) {

//        contenido += "<tr>";
//        contenido += "<td>" + data[i].IIDPERIODO + "</td>";
//        contenido += "<td>" + data[i].NOMBRE + "</td>";
//        contenido += "<td>" + data[i].FECHAINICIO + "</td>";
//        contenido += "<td>" + data[i].FECHAFIN + "</td>";

//        contenido += "</tr>"
//    }

//    contenido += "</tr>";
//    contenido += "</thead>";
//    contenido += "</table>";

//    document.getElementById("tabla").innerHTML = contenido;
//    $("#tabla-periodo").DataTable(

//        {

//            searching:false

//        }


//    );
//}
