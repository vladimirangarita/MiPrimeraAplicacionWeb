﻿Listar();

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
var idRol;
function abrirModal(id) {
    idRol = id;
    var controlesObligatorios = document.getElementsByClassName("obligatorio");
    var ncontroles = controlesObligatorios.length;

    for (var i = 0; i < ncontroles; i++) {

        controlesObligatorios[i].parentNode.classList.remove("error");


    }
    
    $.get("RolPagina/ListarPaginas", function (data) {
     
        var contenido = "<tbody>";
        for (var i = 0; i < data.length; i++) {
            contenido += "<tr>";
            contenido += "<td>";
            contenido += "<input class='checkbox' type='checkbox' id='" + data[i].IIDPAGINA +"'/>";
            contenido += "</td>";
            contenido += "<td>";
            contenido += data[i].MENSAJE;
            contenido += "</td>";
            contenido += "</tr>";
        }
    
        contenido += "</tbody>";
        document.getElementById("tblPagina").innerHTML=contenido;

        if (id > 0) {

            ObtenerPaginasRol();
        }

    })

    if (id == 0) {

        BorrarDatos();

    }
  

    function ObtenerPaginasRol() {


        $.get("RolPagina/ListarRolPagina/?idRol=" + idRol, function myfunction(data) {
            var nregistros = data.length;
            for (var i = 0; i < nregistros; i++) {
                if (data[i].BHABILITADO==1) {
                    document.getElementById(data[i].IIDPAGINA).checked = true;

                }


            }

        })


        $.get("RolPagina/ObtenerRol/?idRol=" + idRol, function (data) {

            document.getElementById("txtIdRol").value = data.IIDROL;
            document.getElementById("txtNombreRol").value = data.NOMBRE;
            document.getElementById("txtDescripcion").value = data.DESCRIPCION;
        })
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

function Agregar() {
    if (DatosObligatorios() == true) {

       
        var frm = new FormData();


       

        var idrol = document.getElementById("txtIdRol").value;
        var nombre = document.getElementById("txtNombreRol").value;
        var descripcion = document.getElementById("txtDescripcion").value;
        frm.append("IIDROL", idrol);
        frm.append("NOMBRE", nombre);
        frm.append("DESCRIPCION", descripcion);
        frm.append("BHABILITADO", 1);
       
        var checkbox = document.getElementsByClassName("checkbox");
        var ncheckbox = checkbox.length;
        var dataEnviar = "";
        for (var i = 0; i < ncheckbox; i++) {

            if (checkbox[i].checked==true) {
                dataEnviar += checkbox[i].id;
                dataEnviar += "$";
            }

        }
        dataEnviar = dataEnviar.substring(0, dataEnviar.length - 1);
        frm.append("dataEnviar", dataEnviar);

        $.ajax({
            type: "POST",
            url: "RolPagina/GuardarDatos",
            data: frm,
            contentType: false,
            processData: false,
            success: function (data) {

                if (data == 0) {
                    alert("Ocurrio un error");
                } else {
                    alert("Se guardo correctamente");
                    document.getElementById("btnCancelar").click();
                    Listar();
                }
            }

        });
    }
}