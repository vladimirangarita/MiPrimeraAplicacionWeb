using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MiPrimeraAplicacionWeb.Controllers
{
    public class RolPaginaController : Controller
    {
        // GET: RolPagina
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult ListarRol()
        {
            using (PruebaDataContext bd = new PruebaDataContext())
            {
                var lista = bd.Rol.Where(p => p.BHABILITADO == 1)
                    .Select(p => new
                    {
                        p.IIDROL,
                        p.NOMBRE,
                        p.DESCRIPCION

                    }).ToList();

                return Json(lista, JsonRequestBehavior.AllowGet);
            }

        }

        public JsonResult ListarPaginas()
        {
            using (PruebaDataContext bd= new PruebaDataContext())
            {
                var lista = bd.Pagina.Where(p => p.BHABILITADO == 1)
                    .Select(
                    p => new
                    {
                        p.IIDPAGINA,
                        p.MENSAJE,
                        p.BHABILITADO
                    }
                    ).ToList();

                return Json(lista, JsonRequestBehavior.AllowGet);
            }

            
        }

        public JsonResult ObtenerRol(int idRol)
        {
            using (PruebaDataContext bd=new PruebaDataContext())
            {
                var rol = bd.Rol.Where(p => p.IIDROL == idRol).Select(
                    p => new
                    {
                        p.IIDROL,
                        p.NOMBRE,
                        p.DESCRIPCION
                    }
                    ).First();

                return Json(rol, JsonRequestBehavior.AllowGet);
            }

        }

    }
}