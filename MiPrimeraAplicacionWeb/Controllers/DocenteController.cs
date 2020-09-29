using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MiPrimeraAplicacionWeb.Controllers
{
    public class DocenteController : Controller
    {
        // GET: Docente
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult  RecuperarInformacion(int id)
        {
            PruebaDataContext bd = new PruebaDataContext();
            var lista = bd.Docente.Where(p => p.IIDDOCENTE.Equals(id)).Select(
                   p => new
                   {
                       p.IIDDOCENTE,
                       p.NOMBRE,
                       p.APMATERNO,
                       p.APPATERNO,
                       p.DIRECCION,
                       p.TELEFONOCELULAR,
                       p.TELEFONOFIJO,
                       p.EMAIL,
                       p.IIDSEXO,
                       FECHACONTRAC = ((DateTime)p.FECHACONTRATO).ToShortDateString(),
                p.IIDMODALIDADCONTRATO,
                p.FOTO
                }



                );

            return Json(lista, JsonRequestBehavior.AllowGet);
        }
        public JsonResult ListarDocente()
        {
            PruebaDataContext bd = new PruebaDataContext();
           

            var lista = bd.Docente.Where(p => p.BHABILITADO.Equals(1)).Select(
                p => new
                {
                    p.IIDDOCENTE,
                    p.NOMBRE,
                    p.APPATERNO,
                    p.APMATERNO,
                    p.EMAIL
                }).ToList();



             


            return Json(lista, JsonRequestBehavior.AllowGet);
        }

        public JsonResult FiltrarDocentePorModalidad(int iidmodalidad)
        {
            PruebaDataContext bd = new PruebaDataContext();
            

            var lista = bd.Docente.Where(p => p.BHABILITADO.Equals(1) && p.IIDMODALIDADCONTRATO.Equals(iidmodalidad)).Select(
                p => new
                {
                    p.IIDDOCENTE,
                    p.NOMBRE,
                    p.APPATERNO,
                    p.APMATERNO,
                    p.EMAIL
                }).ToList();






            return Json(lista, JsonRequestBehavior.AllowGet);
        }
        public JsonResult ListarModalidadContrato()
        {

            PruebaDataContext bd = new PruebaDataContext();
            var lista =( bd.ModalidadContrato.Where(p => p.BHABILITADO.Equals(1)).
                                    Select(p => new
                                    {

                                     IID =   p.IIDMODALIDADCONTRATO,
                                        p.NOMBRE
                                    })).ToList();


            return Json(lista, JsonRequestBehavior.AllowGet);


        }

        public int Eliminar(int id)
        {
            PruebaDataContext bd = new PruebaDataContext();
            int nregistrosAfectados=0;
            
            try
            {
                Docente oDocente =    bd.Docente.Where(p => p.IIDDOCENTE.Equals(id)).First();
                oDocente.BHABILITADO = 0;
                bd.SubmitChanges();
                nregistrosAfectados = 1;
            }
            catch (Exception)
            {

                nregistrosAfectados = 0;
            }
            return nregistrosAfectados;
        }

    }
}