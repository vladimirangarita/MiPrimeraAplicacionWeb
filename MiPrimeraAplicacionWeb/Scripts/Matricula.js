

Listar();

function Listar() {

    //alert("listar");

    $.get("Matricula/Listar", function (data) {

        crearListado(["Id","Periodo","Grado","Seccion","Alumno"],data)

    });


    $.get("Matricula/ListarPeriodos", function (data) {
        llenarCombo(data, document.getElementById("cboPeriodo"), true);

    })

    $.get("Matricula/ListarGradoSeccion", function (data) {
        llenarCombo(data, document.getElementById("cboGradoSeccion"), true);

    })

    $.get("Matricula/ListarAlumnos", function (data) {
            llenarCombo(data, document.getElementById("cboAlumno"), true);

        })

} 

function Recuperar(idPeriodo, idGradoSeccion) {
   
 
    $.get("Matricula/ListarCursosPorPeriodoYGrado/?iidPeriodo=" + idPeriodo + "&iidGradoSeccion=" + idGradoSeccion, function (data) {
        //alert("Recuperar" + " " + idPeriodo + " " + idGradoSeccion);
        var contenido = "<tbody>";
        for (var i = 0; i < data.length; i++) {
            contenido += "<tr>";

            contenido += "<td>";
            //if (data[i].bhabilitado == 1)
            //alert("curso" + data[i].IDCURSO);
                contenido += "<input class='checkbox' id=" + data[i].IDCURSO + " type='checkbox' checked='true' />";
            //else
            //    contenido += "<input class='checkbox'  id=" + data[i].IIDCURSO + " type='checkbox'  />";
            contenido += "</td>";

            contenido += "<td>";
            contenido += data[i].NOMBRE;
            contenido += "</td>";



            contenido += "</tr>";
        }
        contenido += "</tbody>";
        document.getElementById("tablaCurso").innerHTML = contenido;

    })
}


var cboPeriodo = document.getElementById("cboPeriodo");
var cboGradoSeccion = document.getElementById("cboGradoSeccion");

cboPeriodo.onchange = function () {


    if (cboGradoSeccion.value!="" && cboPeriodo.value!="") {

        Recuperar(cboPeriodo.value, cboGradoSeccion.value);
    }


}
cboGradoSeccion.onchange = function () {
    if (cboGradoSeccion.value != "" && cboPeriodo.value != "") {
        Recuperar(cboPeriodo.value, cboGradoSeccion.value);
    }
}
function Agregar() {

   

    if (DatosObligatorios() == true) {
      
        //Validaresmos si hay cursos o no
        //Contar checkboxes





        var checkBoxes = document.getElementsByClassName('checkbox');
        
        if (checkBoxes.length==0) {
            alert("Noy hay cursos asignados a ese grado y periodo");
            return;
        }
        //Vamos a ver cuantos estan seleccionados
        var c = 0;
        for (var i = 0; i < checkBoxes.length; i++) {

            //alert("recorriendo");

            if (checkBoxes[i].checked==true) {
                c++;
            }

        }

        if (c == 0) {

            alert("No ha seleccionado ningun curso");
            return;
        }

        var frm = new FormData();
        var id = document.getElementById("txtId").value;
        var periodo = document.getElementById("cboPeriodo").value;
        var gradoseccion = document.getElementById("cboGradoSeccion").value;
        var alumno = document.getElementById("cboAlumno").value;
      
        frm.append("IIDMATRICULA", id);
        frm.append("IIDPERIODO", periodo);
        frm.append("IIDGRADOSECCION", gradoseccion);
        frm.append("IIDALUMNO", alumno);

  
        //Los campos habilitados
        var valorAEnviar="";
        var checkbox = document.getElementsByClassName("checkbox");

        //alert(valorAEnviar);

        var ncheckbox = checkbox.length;

        

        for (var i = 0; i < ncheckbox; i++) {
           
            if (checkbox[i].checked == true)
            {
                //alert(checkbox[i].id);
                valorAEnviar = valorAEnviar + checkbox[i].id;
     
                valorAEnviar += "$";
        
            }

        }
        if (valorAEnviar!="") {
            valorAEnviar = valorAEnviar.substring(0, valorAEnviar.length - 1);
        }

        //alert(valorAEnviar)
        frm.append("valorAEnviar", valorAEnviar);
    
         //son los Id de los check seleccionados 5$2$6
        frm.append("BHABILITADO", 1);
        if (confirm("¿Desea realmente guardar?") == 1) {

            $.ajax({
                type: "POST",
                url: "Matricula/GuardarDatos",
                data: frm,
                contentType: false,
                processData: false,
                success: function (data) {
                    if (data ==-1 ) {
                        alert("Existe el registro");
                    }else
                    if (data == 1) {
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


function abrirModal(idMatricula) {
    BorrarDatos();
    document.getElementById("tablaCurso").innerHTML = "";
    document.getElementById("spnContenido").style.display = "none";
    if (idMatricula != 0) {
        $.get("Matricula/ObtenerMatricula/?idmatricula=" + idMatricula, function (data) {

            document.getElementById("cboAlumno").style.display = "none";
            document.getElementById("txtId").value = data.IIDMATRICULA;
            document.getElementById("cboPeriodo").value = data.IIDPERIODO;
            document.getElementById("cboGradoSeccion").value = data.IIDSECCION;
            document.getElementById("cboAlumno").value = data.IIDALUMNO;
        })
    } else {
        document.getElementById("cboAlumno").style.display = "block";
        document.getElementById("spnContenido").style.display = "block";
    }
   

    $.get("Matricula/Cursos/?idmatricula=" + idMatricula, function (data) {
        //alert("Matricula/Cursos/?idmatricula=" + idMatricula);
        var contenido = "<tbody>";
        for (var i = 0; i < data.length; i++) {
            //alert(data[i].IDCURSO);
            contenido += "<tr>";
       
            contenido += "<td>";
            if (data[i].bhabilitado==1)
                contenido += "<input class='checkbox' id=" + data[i].IIDCURSO + " type='checkbox' checked='true' />";
            else
                contenido += "<input type='checkbox'  id=" + data[i].IIDCURSO + "  class='checkbox'   />";
            contenido += "</td>";

            contenido += "<td>";
            contenido += data[i].NOMBRE;
            contenido += "</td>";



            contenido += "</tr>";
        }
        contenido += "</tbody>";
        document.getElementById("tablaCurso").innerHTML = contenido;

    })
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

function Eliminar(idMatricula) {

    if (confirm("Desea eliminar?")) {

        $.get("Matricula/Eliminar/?idMatricula=" + idMatricula, function (data) {


            if (data = 1) {

                alert("Se Elimino");
                Listar();
            } else {

                alert("Ocurrio Error");
            }

        })
    } 
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
