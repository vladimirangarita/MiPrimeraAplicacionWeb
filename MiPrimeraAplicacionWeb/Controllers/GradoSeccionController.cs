using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MiPrimeraAplicacionWeb.Controllers
{
    public class GradoSeccionController : Controller
    {
        // GET: GradoSeccion
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult ListarGradoSeccion()
        {
            PruebaDataContext bd = new PruebaDataContext();
            var lista = (from gradosec in bd.GradoSeccion
                         join sec in bd.Seccion
                         on gradosec.IIDSECCION equals sec.IIDSECCION
                         join grad in bd.Grado
                         on gradosec.IIDGRADO equals grad.IIDGRADO
                         select new
                         {
                             gradosec.IID,
                             NOMBREGRADO = grad.NOMBRE,
                             NOMBRESECCION = sec.NOMBRE

                         }).ToList();
            return Json(lista, JsonRequestBehavior.AllowGet);

        }


        public JsonResult RecuperarInformacion(int id)
        {
            PruebaDataContext bd = new PruebaDataContext();

            var consulta = bd.GradoSeccion.Where(p => p.IID.Equals(id)).
            Select(
                p => new
                {
                    p.IID,
                    p.IIDGRADO,
                    p.IIDSECCION                 
                
                }


                );
            return Json(consulta,JsonRequestBehavior.AllowGet);
        }

        public JsonResult ListarSeccion()
        {
            PruebaDataContext bd = new PruebaDataContext();
            var lista = bd.Seccion.Where(p => p.BHABILITADO.Equals(1)).
                Select(
                p => new
                {
                  IDD =  p.IIDSECCION,
                    p.NOMBRE
                }

                );

            return Json(lista, JsonRequestBehavior.AllowGet);
        }
        public JsonResult ListarGrado()
        {
            PruebaDataContext bd = new PruebaDataContext();
            var lista = bd.Grado.Where(p => p.BHABILITADO.Equals(1)).
                Select(
                p => new
                {
                  IID =  p.IIDGRADO,
                    p.NOMBRE
                }

                );

            return Json(lista, JsonRequestBehavior.AllowGet);
        }

    }
}