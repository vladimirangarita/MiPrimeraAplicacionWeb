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


        public int GuardarDatos(Matricula oMatricula, int IIDGRADOSECCION)
        {
            int nregistrosAfectados = 0;
         PruebaDataContext bd = new PruebaDataContext();
            int iidmatricula = oMatricula.IIDMATRICULA;
         GradoSeccion oGradoSeccion =   bd.GradoSeccion.Where(p => p.IID.Equals(IIDGRADOSECCION)).First();
            int iidgrado = (int)oGradoSeccion.IIDGRADO;
            int iidseccion = (int)oGradoSeccion.IIDSECCION;

            oMatricula.IIDGRADO = iidgrado;
            oMatricula.IIDSECCION = iidseccion;

            try
            {

                using (var transaccion= new TransactionScope())
                {
                    if(oMatricula.IIDMATRICULA.Equals(iidmatricula))
                    {
                        bd.Matricula.InsertOnSubmit(oMatricula);


                        bd.SubmitChanges();

                        int idMatriculaGenerada = oMatricula.IIDMATRICULA;

                      var lista =  bd.PeriodoGradoCurso.Where(p => p.IIDPERIODO.Equals(oMatricula.IIDPERIODO)
                        && p.IIDGRADO.Equals(iidgrado)).Select(p => p.IIDCURSO);

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
                            bd.DetalleMatricula.InsertOnSubmit(dm);
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


    }
}