using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MiPrimeraAplicacionWeb.Models;
namespace MiPrimeraAplicacionWeb.Controllers
{
    public class UsuarioController : Controller
    {
        // GET: Usuario
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult ListarPersonas()
        {
            List<PersonaCLS> ListaPersona = new List<PersonaCLS>();
            using (PruebaDataContext bd = new PruebaDataContext())
            {
                List<PersonaCLS> ListaAlumno=(from item in bd.Alumno
                                  where item.bTieneUsuario == 0
                                  select new PersonaCLS
                                  {
                                      IID = item.IIDALUMNO,
                                      NOMBRE = item.NOMBRE + " " + item.APPATERNO + " " + item.APMATERNO + "(A) "
                                 }).ToList();
                ListaPersona.AddRange(ListaAlumno);
                var ListaDocente = (from item in bd.Docente
                                   where item.bTieneUsuario == 0
                                   select new PersonaCLS
                                   {
                                       IID = item.IIDDOCENTE,
                                       NOMBRE = item.NOMBRE + " " + item.APPATERNO + " " + item.APMATERNO + "(D) "
                                   }).ToList();

                ListaPersona.AddRange(ListaDocente);

                ListaPersona = ListaPersona.OrderBy(p => p.NOMBRE).ToList();
                return Json(ListaPersona,JsonRequestBehavior.AllowGet);

            }
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