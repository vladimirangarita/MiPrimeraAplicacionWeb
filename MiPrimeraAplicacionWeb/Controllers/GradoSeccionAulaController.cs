using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MiPrimeraAplicacionWeb.Controllers
{
    public class GradoSeccionAulaController : Controller
    {
        // GET: GradoSeccionAula
        public ActionResult Index()
        {
            return View();
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
                            NOMBREPERIODO = grado.NOMBRE + " - " + seccion.NOMBRE
                        };
            return Json(lista, JsonRequestBehavior.AllowGet);
        }


        public JsonResult Listar()
        {
            PruebaDataContext bd = new PruebaDataContext();

            var lista = from gsa in bd.GradoSeccionAula
                        join gradoSeccion in bd.GradoSeccion
                        on gsa.IIDGRADOSECCION equals gradoSeccion.IID
                        join periodo in bd.Periodo
                        on gsa.IIDPERIODO equals periodo.IIDPERIODO
                       join aula in bd.Aula
                       on gsa.IIDAULA equals aula.IIDAULA
                       join docente in bd.Docente
                       on gsa.IIDDOCENTE equals docente.IIDDOCENTE
                       join curso in bd.Curso
                       on gsa.IIDCURSO equals curso.IIDCURSO
                      
                        select new
                        {
                            gsa.IID,
                            NOMBREPERIODO = periodo.NOMBRE, 
                            NOMBREGRADOSECCION = gradoSeccion.IIDGRADO + " - " + gradoSeccion.IIDSECCION,
                            NOMBREAULA=aula.NOMBRE,
                            NOMBREDOCENTE=docente.NOMBRE,
                            NOMBRECURSO=curso.NOMBRE
                        };
            return Json(lista, JsonRequestBehavior.AllowGet);
        }


        public JsonResult ListarAulas()
        {
            PruebaDataContext bd = new PruebaDataContext();

            var lista = bd.Aula.Where(p => p.BHABILITADO.Equals(1))
                .Select(p => new
                {
                    IID = p.IIDAULA,
                    p.NOMBRE


                });
            return Json(lista, JsonRequestBehavior.AllowGet);

        }


        public JsonResult ListarDocentes()
        {
            PruebaDataContext bd = new PruebaDataContext();

            var lista = bd.Docente.Where(p => p.BHABILITADO.Equals(1))
                .Select(p => new
                {
                    IID = p.IIDDOCENTE,
                    p.NOMBRE


                });
            return Json(lista, JsonRequestBehavior.AllowGet);

        }


        public JsonResult ListarCursos(int IIDPERIODO, int IIDGRADOSECCION)
        {
            PruebaDataContext bd = new PruebaDataContext();
            int iidgrado =(int) bd.GradoSeccion.Where(p => p.IID.Equals(IIDGRADOSECCION)).First().IIDGRADO;
            var lista = from pgc in bd.PeriodoGradoCurso
                        join curso in bd.Curso
                        on pgc.IIDCURSO equals curso.IIDCURSO
                        join periodo in bd.Periodo
                        on pgc.IIDPERIODO equals periodo.IIDPERIODO
                        where pgc.BHABILITADO.Equals(1)
                        && pgc.IIDPERIODO.Equals(IIDPERIODO)
                        && pgc.IIDGRADO.Equals(iidgrado)
                        select new
                        {
                          IID =  pgc.IIDCURSO,
                            curso.NOMBRE

                        };

            return Json(lista, JsonRequestBehavior.AllowGet);
        }
    }
}