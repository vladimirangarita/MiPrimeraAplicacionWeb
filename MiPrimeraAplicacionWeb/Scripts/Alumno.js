Listar();
$("#dtFechaNacimiento").datepicker(

    {


        dateFormat: "dd/mm/yy",
        changeMonth: true,
        changeYear: true

    }

);


function Listar() {


$.get("Alumno/ListarAlumnos", function (data) {


    crearListado(["ID","Nombre","Apellido Paterno","Apellido Materno","Telefono padre"],data);


})
}

$.get("Alumno/ListarSexo", function (data) {



    llenarCombo(data,document.getElementById("cboSexo"),true)

    //llenarCombo(data, document.getElementById("cboSexoPopup"), true)
    

})

var btnBuscar = document.getElementById("btnBuscar");
btnBuscar.onclick = function () {

    var iidsexo = document.getElementById("cboSexo").value;


    if (iidsexo == "") {

        Listar();

    }
    else


    $.get("Alumno/FiltrarAlumnoPorSexo/?iidsexo=" + iidsexo, function (data) {

        crearListado(["ID", "Nombre", "Apellido Paterno", "Apellido Materno", "Telefono padre"], data);

    });
}


var btnLimpiar = document.getElementById("btnLimpiar");
btnLimpiar.onclick = function () {

    Listar();
}

function llenarCombo(data, control,primerElemento) {

    var contenido = "";
    if (primerElemento==true) {

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

    if (confirm("Desea eliminar") == 1) {

        $.get("Alumno/Eliminar/?id=" + id, function (data) {

            if (data == 0) {
                alert("Ocurrio un error");
            } else {
                alert("Se elimino correctamente");
                Listar();
            }

        })
    }

}
function BorrarDatos() {

    var controles = document.getElementsByClassName("borrar");
    //console.log(controles);
    var ncontroles = controles.length;
    for (var i = 0; i < ncontroles; i++) {
        controles[i].value = "";
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
        $.get("Alumno/RecuperarInformacion/?id=" + id, function (data) {

            document.getElementById("txtIdAlumno").value = data[0].IIDALUMNO;
            document.getElementById("txtnombre").value = data[0].NOMBRE;
            document.getElementById("txtapPaterno").value = data[0].APPATERNO;
            document.getElementById("txtapMaterno").value = data[0].APMATERNO;
            //document.getElementById("cboSexoPopup").value = data[0].IIDSEXO;

            if (data[0].IIDSEXO==1) 
                document.getElementById("rbMasculino").checked = true;
                else
                document.getElementById("rbFemenino").checked = true;
            

            document.getElementById("dtFechaNacimiento").value = data[0].FECHANAC;

            document.getElementById("txtTelefonoPadre").value = data[0].TELEFONOPADRE;
            document.getElementById("txtTelefonoMadre").value = data[0].TELEFONOMADRE;
            document.getElementById("txtNumeroHermanos").value = data[0].NUMEROHERMANOS;
        });
        //alert("Se llamo desde el boton Editar")
    }


    //alert(id);

}
BorrarDatos();
function Agregar() {

    if (DatosObligatorios() == true) {

        var frm = new FormData();
        var idAlumno = document.getElementById("txtIdAlumno").value;
        var nombre = document.getElementById("txtnombre").value;
        var apPaterno = document.getElementById("txtapPaterno").value;
        var apMaterno = document.getElementById("txtapMaterno").value;


        var FechaNac = document.getElementById("dtFechaNacimiento").value;
        //var IdSexo = document.getElementById("cboSexoPopup").value;

        var idSexo;
        if (document.getElementById("rbMasculino").checked == true) {
            idSexo = 1;
        }
        else {
            idSexo = 2;
        }

        var TelefonoPadre = document.getElementById("txtTelefonoPadre").value;

        var TelefonoMadre = document.getElementById("txtTelefonoMadre").value;
        var NumeroHermanos = document.getElementById("txtNumeroHermanos").value;
       
        frm.append("IIDALUMNO", idAlumno);
        frm.append("NOMBRE", nombre);
        frm.append("APPATERNO", apPaterno);
        frm.append("APMATERNO", apMaterno);
        frm.append("FECHANACIMIENTO", FechaNac);
        frm.append("IIDSEXO", idSexo);
        frm.append("TELEFONOPADRE", TelefonoPadre);
        frm.append("TELEFONOMADRE", TelefonoMadre);
        frm.append("NUMEROHERMANOS", NumeroHermanos);

        frm.append("BHABILITADO", 1);

        if (confirm("Desea guardar cambios?") == 1) {

            $.ajax({
                type: "POST",
                url: "Alumno/GuardarDatos",
                data: frm,
                contentType: false,
                processData: false,
                success: function (data) {
                    if (data == -1) {

                        alert("Ya existe el alumno");
                    } else if (data ==0) {
                        alert("Ocurrio un error");
                    }

                    else {

                        alert("Se ejecuto exitosamente");
                        Listar();
                        document.getElementById("btnCancelar").click();
                    }

                }



            })

        }


    }

}

//function crearListado(data) {
//    var contenido = "";
//    contenido += "<table id='tabla-Alumno'class='table'>"
//    contenido += "<thead>"

//    contenido += "<tr>"
//    contenido += "<td>Id Alumno</td>"
//    contenido += "<td>Nombre</td>"
//    contenido += "<td>Apellido Paterno</td>"
//    contenido += "<td>Apellido Materno</td>"
//    contenido += "<td>Tlefono Padre</td>"
//    contenido += "</tr>"

//    contenido += "</thead>"

//    contenido += "<tbody>"
//    for (var i = 0; i < data.length; i++) {

//        contenido += "<tr>"
//        contenido += "<td>" + data[i].IIDALUMNO + "</td>"
//        contenido += "<td>" + data[i].NOMBRE + "</td>"
//        contenido += "<td>" + data[i].APPATERNO + "</td>"
//        contenido += "<td>" + data[i].APMATERNO + "</td>"
//        contenido += "<td>" + data[i].TELEFONOPADRE + "</td>"
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