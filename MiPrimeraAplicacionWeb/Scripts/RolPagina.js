Listar();

function Listar() {
    $.get("RolPagina/ListarRol", function (data) {
        crearListado(["Id Rol", "Nombre", "Descripcion"], data);
    })
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

    var controlesObligatorios = document.getElementsByClassName("obligatorio");
    var ncontroles = controlesObligatorios.length;

    for (var i = 0; i < ncontroles; i++) {

        controlesObligatorios[i].parentNode.classList.remove("error");


    }


    if (id == 0) {

        BorrarDatos();

    }
    else {
       
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