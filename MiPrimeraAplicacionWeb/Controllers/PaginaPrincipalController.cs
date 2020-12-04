using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MiPrimeraAplicacionWeb.Controllers
{
    public class PaginaPrincipalController : Controller
    {
        // GET: PaginaPrincipal
        public ActionResult Index()
        {
            return View();
        }
    }
}