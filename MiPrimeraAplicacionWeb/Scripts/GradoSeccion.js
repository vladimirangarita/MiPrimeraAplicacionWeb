
listar();
function listar() {

    $.get("GradoSeccion/ListarGradoSeccion", function (data) {

        crearListado(["Id Grado Seccion", "Nombre Grado", "Nombre Seccion"], data);
    })

    $.get("GradoSeccion/ListarSeccion", function (data) {
        llenarCombo(data, document.getElementById("cboSeccion"), true);
    })

    $.get("GradoSeccion/ListarGrado", function (data) {
        llenarCombo(data, document.getElementById("cboGrado"), true);
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

function Agregar() {

    if (DatosObligatorios() == true) {

        var frm = new FormData();
        var id = document.getElementById("txtIdGradoSeccion").value;
        var grado = document.getElementById("cboGrado").value;
        var seccion = document.getElementById("cboSeccion").value;
        ///*a*/lert(seccion);
        frm.append("IID", id);
        frm.append("IIDGRADO", grado);
        frm.append("IIDSECCION", seccion);
        frm.append("BHABILITADO", 1);


        if (confirm("¿Desea realmente guardar?") == 1) {

            $.ajax({
                type: "POST",
                url: "GradoSeccion/GuardarDatos",
                data: frm,
                contentType: false,
                processData: false,
                success: function (data) {
                    if (data==-1) {
                        alert("Ya existe el registro");
                    }else
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

function Eliminar(id) {
    if (confirm("Desea eliminar") == 1) {
        //Get se usa cuando la entrada en poca y la
        //Salida es mucha
        $.get("GradoSeccion/Eliminar/?id=" + id, function (data) {
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
        //alert("Se llamo desde el boton Editar")
        $.get("GradoSeccion/RecuperarInformacion/?id=" + id, function (data) {

            document.getElementById("txtIdGradoSeccion").value = data[0].IID;
            document.getElementById("cboGrado").value = data[0].IIDGRADO;
            //alert("IDGRADO " + data[0].IIDGRADO)
            document.getElementById("cboSeccion").value = data[0].IIDSECCION;
            //alert("IIDSECCION " + data[0].IIDSECCION)
        });
        //alert("Se llamo desde el boton Editar")
    }


    //alert(id);

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