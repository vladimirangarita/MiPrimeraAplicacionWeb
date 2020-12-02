
listar();

function listar() {

    $.get("Usuario/ListarUsuarios", function (data) {

        crearListado(["Id Usuario","Nombre Usuario","Nombre completo persona","Rol","Tipo"],data);


    })

    $.get("Usuario/ListarRol", function (data) {

        llenarCombo(data, document.getElementById("cboRol"),true);


    })

    $.get("Usuario/ListarPersonas", function (data) {

        llenarCombo(data, document.getElementById("cboPersona"),true);


    })
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


function Agregar() {

    if (DatosObligatorios() == true) {

        var frm = new FormData();
     
        var IIDUSUARIO = document.getElementById("txtIdUsuario").value;
    
        var nombreUsuario = document.getElementById("txtNombreUsuario").value;
       
        var contra = document.getElementById("txtContra").value;
        var persona = document.getElementById("cboPersona").value;
    
        var rol = document.getElementById("cboRol").value;
      
        var nombrePersona = document.getElementById("cboPersona").options[document.getElementById("cboPersona").selectedIndex].text;
        frm.append("IIDUSUARIO", IIDUSUARIO);
        frm.append("NOMBREUSUARIO", nombreUsuario);
        frm.append("CONTRA", contra);
        frm.append("IID", persona);
        frm.append("IIDROL", rol);
        frm.append("nombreCompleto", nombrePersona);
        frm.append("BHABILITADO", 1);
        alert(nombrePersona);


        if (confirm("¿Desea realmente guardar?") == 1) {

            $.ajax({
                type: "POST",
                url: "Usuario/GuardarDatos",
                data: frm,
                contentType: false,
                processData: false,
                success: function (data) {
                    if (data==1) {
                        alert("Se guardo");
                        document.getElementById("btnCancelar").click();
                        listar();
                    } else {
                        alert("error");
                    }



                }

            });

        }
    } ;

}
function abrirModal(id) {

    var controlesObligatorios = document.getElementsByClassName("obligatorio");
    var ncontroles = controlesObligatorios.length;

    for (var i = 0; i < ncontroles; i++) {

        controlesObligatorios[i].parentNode.classList.remove("error");


    }


    if (id == 0) {

        document.getElementById("lblContra").style.display = "block";
        document.getElementById("txtContra").style.display = "block";

        document.getElementById("lblPersona").style.display = "block";
        document.getElementById("cboPersona").style.display = "block";
        BorrarDatos();

    }
    else {
        document.getElementById("txtContra").value = "1";
        document.getElementById("cboPersona").value = "2";
        document.getElementById("lblContra").style.display = "none";
        document.getElementById("txtContra").style.display = "none";
        document.getElementById("lblPersona").style.display = "none";
        document.getElementById("cboPersona").style.display = "none";


        $.get("Usuario/RecuperarInformacion/?idUsuario="+id, function (data) {

            document.getElementById("txtIdUsuario").value = data.IIDUSUARIO;
            document.getElementById("txtNombreUsuario").value = data.NOMBREUSUARIO;
            document.getElementById("cboRol").value = data.IIDROL;
        })
       
    }


    //alert(id);

}

function BorrarDatos() {

    var controles = document.getElementsByClassName("borrar");
    //console.log(controles);
    var ncontroles = controles.length;
    for (var i = 0; i < ncontroles; i++) {
        controles[i].value = "";
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
