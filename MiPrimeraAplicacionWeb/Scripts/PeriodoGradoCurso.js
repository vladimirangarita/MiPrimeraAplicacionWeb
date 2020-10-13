

Listar();

function Listar() {



    $.get("PeriodoGradoCurso/ListarPeriodoGradoCurso", function (data) {


        crearListado(["Id", "Periodo", "Grado", "Curso"], data);

    })
    $.get("PeriodoGradoCurso/ListarPeriodos", function (data) {
        llenarCombo(data, document.getElementById("cboPeriodo"), true);
    });
    $.get("PeriodoGradoCurso/ListarGrados", function (data) {
        llenarCombo(data, document.getElementById("cboGrado"), true);
    });
    $.get("PeriodoGradoCurso/ListarCursos", function (data) {
        llenarCombo(data, document.getElementById("cboCurso"), true);
    });
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
        //alert("Se llamo desde el boton Editar")
        $.get("PeriodoGradoCurso/RecuperarInformacion/?id=" + id, function (data) {

            document.getElementById("txtId").value = data[0].IID;
            document.getElementById("cboPeriodo").value = data[0].IIDPERIODO;
            document.getElementById("cboGrado").value = data[0].IIDGRADO;
            document.getElementById("cboCurso").value = data[0].IIDCURSO;
            //alert("IIDSECCION " + data[0].IIDSECCION)
        });
        //alert("Se llamo desde el boton Editar")
    }


    //alert(id);

}

function Agregar() {

    if (DatosObligatorios() == true) {

        var frm = new FormData();
        var id = document.getElementById("txtId").value;
        var periodo = document.getElementById("cboPeriodo").value;
        var grado = document.getElementById("cboGrado").value;
        var curso = document.getElementById("cboCurso").value;
        //alert(periodo);
        frm.append("IID", id);
        frm.append("IIDPERIODO", periodo);
        frm.append("IIDGRADO", grado);
        frm.append("IIDCURSO", curso);
        frm.append("BHABILITADO", 1);


        if (confirm("¿Desea realmente guardar?") == 1) {

            $.ajax({
                type: "POST",
                url: "PeriodoGradoCurso/GuardarDatos",
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
function Eliminar(id) {
    if (confirm("Desea eliminar") == 1) {
        //Get se usa cuando la entrada en poca y la
        //Salida es mucha
        $.get("PeriodoGradoCurso/Eliminar/?id=" + id, function (data) {
            //El data es la respuesta  que vota el controlador

            if (data == 0) {
                alert("Ocurrio un error");
            } else {
                alert("Se elimino");
                Listar();
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