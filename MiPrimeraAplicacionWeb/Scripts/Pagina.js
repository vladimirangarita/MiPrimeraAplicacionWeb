
listar();
function listar() {

    $.get("Pagina/ListarPaginas", function (data) {


        //alert(data);
        crearListado(["Id Pagina", "Mensaje","Controlador","Accion"], data);

    });

}

function Agregar() {

    if (DatosObligatorios() == true) {

        var frm = new FormData();
        var id = document.getElementById("txtIdPagina").value;
        var mensaje = document.getElementById("txtMensaje").value;
        var controlador = document.getElementById("txtControlador").value;
        var accion = document.getElementById("txtAccion").value;

        frm.append("IIDPAGINA", id);
        frm.append("MENSAJE", mensaje);
        frm.append("CONTROLADOR", controlador);
        frm.append("ACCION", accion);

        frm.append("BHABILITADO", 1);


        if (confirm("¿Desea realmente guardar?") == 1) {

            $.ajax({
                type: "POST",
                url: "Pagina/GuardarDatos",
                data: frm,
                contentType: false,
                processData: false,
                success: function (data) {

                    if (data == 1) {
                        listar();
                        alert("Se ejecuto correctamente");
                        document.getElementById("btnCancelar").click();
                    } else

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
        $.get("Pagina/RecuperarDatos/?id=" + id, function (data) {

            document.getElementById("txtIdPagina").value = data.IIDPAGINA;
            document.getElementById("txtMensaje").value = data.MENSAJE;
            document.getElementById("txtControlador").value = data.CONTROLADOR;
            document.getElementById("txtAccion").value = data.ACCION;

        });
        //alert("Se llamo desde el boton Editar")
    }


    //alert(id);

}