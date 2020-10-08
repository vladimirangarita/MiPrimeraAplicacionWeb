using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MiPrimeraAplicacionWeb.Controllers
{
    public class PeriodoGradoCursoController : Controller
    {
        // GET: PeriodoGradoCurso
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult ListarPeriodoGradoCurso()
        {
            PruebaDataContext bd = new PruebaDataContext();

            var lista = from pgc in bd.PeriodoGradoCurso
                        join per in bd.Periodo
                        on pgc.IIDPERIODO equals per.IIDPERIODO
                        join grand in bd.Grado
                        on pgc.IIDGRADO equals grand.IIDGRADO
                        join cur in bd.Curso
                        on pgc.IIDCURSO equals cur.IIDCURSO
                        select new
                        {
                            pgc.IID,
                            NOMBREPERIODO = per.NOMBRE,
                            NOMBREGRADO = grand.NOMBRE,
                            NOMBRECURSO = cur.NOMBRE
                        };
            return Json(lista, JsonRequestBehavior.AllowGet);
        }

        public JsonResult RecuperarInformacion(int id)
        {
            PruebaDataContext bd = new PruebaDataContext();

            var lista = bd.PeriodoGradoCurso.Where(p => p.IID.Equals(id)).
                Select(p => new
                {
                    p.IID,
                    p.IIDPERIODO,
                    p.IIDGRADO,
                    p.IIDCURSO


                });

            return Json(lista, JsonRequestBehavior.AllowGet);

        }

        public JsonResult ListarPeriodo()
        {
            PruebaDataContext bd = new PruebaDataContext();
            var lista = bd.Periodo.Where(p => p.BHABILITADO.Equals(1)).
                Select(p => new
                {
                    p.IIDPERIODO,
                    p.NOMBRE

                });
            return Json(lista, JsonRequestBehavior.AllowGet);

        }

        public JsonResult ListarGrado()
        {
            PruebaDataContext bd = new PruebaDataContext();
            var lista = bd.Grado.Where(p => p.BHABILITADO.Equals(1)).
                Select(p => new
                {
                    p.IIDGRADO,
                    p.NOMBRE

                });
            return Json(lista, JsonRequestBehavior.AllowGet);

        }


        public JsonResult ListarCurso()
        {
            PruebaDataContext bd = new PruebaDataContext();
            var lista = bd.Curso.Where(p => p.BHABILITADO.Equals(1)).
                Select(p => new
                {
                    p.IIDCURSO,
                    p.NOMBRE

                });
            return Json(lista, JsonRequestBehavior.AllowGet);

        }


    }
}