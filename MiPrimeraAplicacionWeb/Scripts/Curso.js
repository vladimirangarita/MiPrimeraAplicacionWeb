listar();
function listar() {

    $.get("Curso/listarCurso", function (data) {


        //alert(data);
        crearListado(["Id Curso", "Nombre Curso"], data);

    });

}

var btnBuscar = document.getElementById("btnBuscar");

btnBuscar.onclick = function () {
    var nombre = document.getElementById("txtnombre").value;

    $.get("Curso/BuscarCursoPorNombre/?nombre=" + nombre, function (data) {
        crearListado(data);
    });
   }

var btnLimpiar = document.getElementById("btnLimpiar");
btnLimpiar.onclick = function () {

    $.get("Curso/listarCurso", function (data) {


        //alert(data);
        crearListado(data);

    });
    document.getElementById("txtnombre").value = "";
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
        contenido += "<button class='btn btn-primary' onclick='abrirModal(" + data[i][llaveId]+")' data-toggle='modal' data-target='#myModal'><i class='glyphicon glyphicon-edit'></i></button> "
        contenido += "<button class='btn btn-danger' onclick='eliminar(" + data[i][llaveId] +")'><i class='glyphicon glyphicon-trash'></i></button>"
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

function eliminar(id) {
    // alert(id);
    var frm = new FormData();
    frm.append("IIDCURSO", id);
    if (confirm("¿Desea realemente guardar?") == 1) {

        $.ajax({
            type: "POST",
            url: "Curso/EliminarCurso",
            data: frm,
            contentType: false,
            processData: false,
            success: function (data) {
                if (data != 0) {
                    listar();
                    alert("Se ejecuto correctamente");
                    document.getElementById("btnCancelar").click();
                } else {
                    alert("Ocurrio un error;");
                }
            }

        });

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
     
    }
    else

    {
        $.get("Curso/RecuperarDatos/?id=" + id, function (data) {

            document.getElementById("txtIdCurso").value = data[0].IIDCURSO;
            document.getElementById("txtNombre").value = data[0].NOMBRE;
            document.getElementById("txtDescripcion").value = data[0].DESCRIPCION;

        });
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
        var id = document.getElementById("txtIdCurso").value;
        var nombre = document.getElementById("txtNombre").value;
        var descripcion = document.getElementById("txtDescripcion").value;

        frm.append("IIDCURSO", id);
        frm.append("NOMBRE", nombre);
        frm.append("DESCRIPCION", descripcion);
        frm.append("BHABILITADO", 1);


        if (confirm("¿Desea realmente guardar?") == 1) {

        $.ajax({
            type: "POST",
            url: "Curso/GuardarDatos",
            data: frm,
            contentType: false,
            processData: false,
            success: function (data) {

                if (data==1) {
                    listar();
                    alert("Se ejecuto correctamente");
                    document.getElementById("btnCancelar").click();
                }else

                if (data == -1) {
                    //listar();
                    alert("Ya existe el curso");
                    //document.getElementById("btnCancelar").click();
                } else {
                    alert("Ocurrio un error;");
                }
            }

            });

        }
    } else {


    };

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
        else
        {
            controlesObligatorios[i].parentNode.classList.remove("error");
        }
    }
    return exito;
}

