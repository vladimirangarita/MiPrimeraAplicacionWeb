using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MiPrimeraAplicacionWeb.Controllers
{
    public class PaginaController : Controller
    {
        // GET: Pagina
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult ListarPaginas()
        {
            PruebaDataContext bd = new PruebaDataContext();

            var ListaPagina = bd.Pagina.Where(p => p.BHABILITADO == 1)
                .Select(p => new
                {
                    p.IIDPAGINA,
                    p.MENSAJE,
                    p.CONTROLADOR,
                    p.ACCION

                }).ToList();

            return Json(ListaPagina, JsonRequestBehavior.AllowGet);
        }

        public int GuardarDatos(Pagina oPagina)
        {
            PruebaDataContext bd = new PruebaDataContext();
            int nregistrosAfectados = 0;
            try
            {

                if (oPagina.IIDPAGINA == 0)
                {
                    int nveces = bd.Pagina.Where(p => p.MENSAJE.Equals(oPagina.MENSAJE)).Count();
                    if (nveces == 0)
                    {
                        bd.Pagina.InsertOnSubmit(oPagina);
                        bd.SubmitChanges();
                        nregistrosAfectados = 1;
                    }
                    else
                    {
                        nregistrosAfectados = -1;
                    }

                }
                else
                {
                    int nveces = bd.Pagina.Where(p => p.MENSAJE.Equals(oPagina.MENSAJE) && !p.IIDPAGINA.Equals(oPagina)).Count();
                    if (nveces == 0)
                    {
                        Pagina paginaSel = bd.Pagina.Where(p => p.IIDPAGINA.Equals(oPagina.IIDPAGINA)).First();
                        paginaSel.MENSAJE = oPagina.MENSAJE;
                        paginaSel.ACCION = oPagina.ACCION;
                        paginaSel.CONTROLADOR = oPagina.CONTROLADOR;
                        bd.SubmitChanges();
                        nregistrosAfectados = 1;
                    }
                    else
                    {
                        nregistrosAfectados = -1;
                    }


                }
            }
            catch (Exception ex)
            {

                nregistrosAfectados = 0;
            }
            return nregistrosAfectados;

        }


        public JsonResult RecuperarInformacion(int id)
        {
            PruebaDataContext bd = new PruebaDataContext();
            var oPagina = bd.Pagina.Where(p => p.IIDPAGINA == id).
                Select(p => new

                {
                    p.IIDPAGINA,
                    p.MENSAJE,
                    p.CONTROLADOR,
                    p.ACCION
                }).First();




            return Json(oPagina, JsonRequestBehavior.AllowGet);
        }



        }

    }
