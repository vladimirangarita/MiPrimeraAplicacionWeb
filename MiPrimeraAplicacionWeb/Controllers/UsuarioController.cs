using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MiPrimeraAplicacionWeb.Controllers
{
    public class UsuarioController : Controller
    {
        // GET: Usuario
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult ListarRol()
        {
            using (PruebaDataContext bd=new PruebaDataContext())
            {
                var lista = bd.Rol.Where(p => p.BHABILITADO == 1)
                    .Select(x => new
                    {
                       IID = x.IIDROL,
                        x.NOMBRE

                    }

                    ).ToList();

                return Json(lista, JsonRequestBehavior.AllowGet);
            } 

        }
    }
}