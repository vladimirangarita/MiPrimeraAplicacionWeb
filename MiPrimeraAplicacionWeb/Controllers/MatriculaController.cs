using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Transactions;
namespace MiPrimeraAplicacionWeb.Controllers
{
    public class MatriculaController : Controller
    {
        // GET: Matricula
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult Listar()
        {
            PruebaDataContext bd = new PruebaDataContext();
            var lista = from matricula in bd.Matricula
                        join periodo in bd.Periodo
                        on matricula.IIDPERIODO equals periodo.IIDPERIODO
                        join grado in bd.Grado
                        on matricula.IIDGRADO equals grado.IIDGRADO
                        join seccion in bd.Seccion
                        on matricula.IIDSECCION equals seccion.IIDSECCION
                        join alumno in bd.Alumno
                        on matricula.IIDALUMNO equals alumno.IIDALUMNO
                        where matricula.BHABILITADO==1
                        select new
                        {
                          IID =  matricula.IIDMATRICULA,
                          NOMBREPERIODO =  periodo.NOMBRE,
                          NOMBREGRADO =  grado.NOMBRE,
                          NOMBRESECCION = seccion.NOMBRE,
                          NOMBREALUMNO =  alumno.NOMBRE +" "+ alumno.APPATERNO
                        };

            return Json(lista, JsonRequestBehavior.AllowGet);
        }

        public int Eliminar(int idMatricula)
        {
            int rpta = 0;
            PruebaDataContext bd = new PruebaDataContext();
            try
            {
                using (var transaccion = new TransactionScope())
                {
                    Matricula oMatricula = bd.Matricula.Where(p => p.IIDMATRICULA == idMatricula).First();
                    oMatricula.BHABILITADO = 0;
                    var ListaDetalleMatricula = bd.DetalleMatricula.Where(p => p.IIDMATRICULA == idMatricula);

                    foreach (DetalleMatricula oDetalleMatricula in ListaDetalleMatricula)
                    {
                        oDetalleMatricula.bhabilitado = 0;
                    }

                    bd.SubmitChanges();
                    transaccion.Complete();
                    rpta = 1;

                } 
            }
            catch (Exception ex)
            {

                rpta = 0;
            }

            return rpta;
        }

        public JsonResult ListarGradoSeccion()
        {
            PruebaDataContext bd = new PruebaDataContext();

            var lista = from gs in bd.GradoSeccion
                        join grado in bd.Grado
                        on gs.IIDGRADO equals grado.IIDGRADO
                        join seccion in bd.Seccion
                        on gs.IIDSECCION equals seccion.IIDSECCION
                        select new
                        {
                            gs.IID,
                            NOMBRE = grado.NOMBRE + " - " + seccion.NOMBRE
                        };
            return Json(lista, JsonRequestBehavior.AllowGet);
        }
        public JsonResult ListarPeriodos()
        {
            PruebaDataContext bd = new PruebaDataContext();

            var lista = bd.Periodo.Where(p => p.BHABILITADO.Equals(1))
                .Select(p => new
                {
                    IID = p.IIDPERIODO,
                    p.NOMBRE


                });
            return Json(lista, JsonRequestBehavior.AllowGet);
        }


        public JsonResult ListarAlumnos()
        {
            PruebaDataContext bd = new PruebaDataContext();

            var lista = bd.Alumno.Where(p => p.BHABILITADO.Equals(1))
                .Select(p => new
                {
                    IID = p.IIDALUMNO,
                    NOMBRE = p.NOMBRE + " " + p.APMATERNO + " " + p.APPATERNO


                });
            return Json(lista, JsonRequestBehavior.AllowGet);
        }


        public int GuardarDatos(Matricula oMatricula, int IIDGRADOSECCION,string valorAEnviar)
        {
            int nregistrosAfectados = 0;
         PruebaDataContext bd = new PruebaDataContext();
            int iidmatricula = oMatricula.IIDMATRICULA;
         GradoSeccion oGradoSeccion =   bd.GradoSeccion.Where(p => p.IID.Equals(IIDGRADOSECCION)).First();
            int iidgrado = (int)oGradoSeccion.IIDGRADO;
            int iidseccion = (int)oGradoSeccion.IIDSECCION;

            oMatricula.IIDGRADO = iidgrado;
            oMatricula.IIDSECCION = iidseccion;
            oMatricula.FECHA = DateTime.Now;
            try
            {

                using (var transaccion= new TransactionScope())
                {
                    if(oMatricula.IIDMATRICULA.Equals(0))
                    {
                        bd.Matricula.InsertOnSubmit(oMatricula);


                        bd.SubmitChanges();

                        int idMatriculaGenerada = oMatricula.IIDMATRICULA;

                      var lista =  bd.PeriodoGradoCurso.Where(p => p.IIDPERIODO.Equals(oMatricula.IIDPERIODO)
                        && p.IIDGRADO.Equals(iidgrado) && p.BHABILITADO.Equals(1)).Select(p => p.IIDCURSO);

                        foreach (var item in lista)
                        {
                            DetalleMatricula dm = new  DetalleMatricula();
                            dm.IIDMATRICULA = idMatriculaGenerada;
                            dm.IIDCURSO = (int)item;
                            dm.NOTA1 = 0;
                            dm.NOTA2 = 0;
                            dm.NOTA3 = 0;
                            dm.NOTA4 = 0;
                            dm.PROMEDIO = 0;
                            dm.bhabilitado=1;
                            bd.DetalleMatricula.InsertOnSubmit(dm);
                        }
                        bd.SubmitChanges();
                        transaccion.Complete();
                        nregistrosAfectados = 1;

                    }else
                    {
                        //editar
                        Matricula oMatriculaObjeto = bd.Matricula.Where(p => p.IIDMATRICULA == oMatricula.IIDMATRICULA).First();
                        oMatriculaObjeto.IIDPERIODO = oMatricula.IIDPERIODO;
                        oMatriculaObjeto.IIDGRADO = iidgrado;
                        oMatriculaObjeto.IIDSECCION = iidseccion;
                        oMatriculaObjeto.IIDALUMNO = oMatricula.IIDALUMNO;
                        //detalle
                        var lista=bd.DetalleMatricula.Where(p =>p.IIDMATRICULA==oMatricula.IIDMATRICULA);

                        foreach (DetalleMatricula odetalle in lista)
                        {
                            odetalle.bhabilitado = 0;
                        }
                        string[] valores = valorAEnviar.Split('$');

                        for (int i = 0; i < valores.Length; i++)
                        {
                        DetalleMatricula odet =    bd.DetalleMatricula.Where(p => p.IIDMATRICULA == oMatricula.IIDMATRICULA
                            && p.IIDCURSO==int.Parse(valores[i])).First();
                            odet.bhabilitado = 1;
                        }
                        bd.SubmitChanges();
                        transaccion.Complete();
                        nregistrosAfectados = 1;

                    }

                }


            }
            catch (Exception ex)
            {

                nregistrosAfectados = 0;
            }

            return nregistrosAfectados;
        }

        public  JsonResult Cursos(int idmatricula)
        {
            using (var bd=new PruebaDataContext())
            {
                var listaCurso = (from detalle in bd.DetalleMatricula
                                  join curso in bd.Curso
                                  on detalle.IIDCURSO equals curso.IIDCURSO
                                  where detalle.IIDMATRICULA==idmatricula
                                  select new
                                  {
                                      detalle.IIDMATRICULA,
                                      curso.IIDCURSO,
                                      curso.NOMBRE,
                                      detalle.bhabilitado

                                  }).ToList();
                return Json(listaCurso, JsonRequestBehavior.AllowGet);
            }


        }



        public JsonResult ObtenerMatricula(int idmatricula)
        {

            //try
            //{

           
            using (PruebaDataContext bd = new PruebaDataContext())
            {
                var oMatricula = bd.Matricula.Where(p => p.IIDMATRICULA == idmatricula).
                    Select(p => new
                    {
                        IIDMATRICULA = (int)p.IIDMATRICULA,
                        IIDPERIODO = (int) p.IIDPERIODO,
                        IIDSECCION = (int) p.IIDSECCION,
                        IIDALUMNO = (int) p.IIDALUMNO
                    }).First();

                return Json(oMatricula, JsonRequestBehavior.AllowGet);
            //}

            //}
            //catch (Exception)
            //{
            //    return Json("", JsonRequestBehavior.AllowGet);
            //    //throw;
            //}


        }



    }
    }
}