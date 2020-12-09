using MiPrimeraAplicacionWeb.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MiPrimeraAplicacionWeb.Controllers
{
    [Seguridad]
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
                        where pgc.BHABILITADO.Equals(1)
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
                   IID = p.IIDPERIODO,
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
                    IID = p.IIDGRADO,
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
                    IID = p.IIDCURSO,
                    p.NOMBRE

                });
            return Json(lista, JsonRequestBehavior.AllowGet);

        }

        public int Eliminar(int id)
        {

            PruebaDataContext bd = new PruebaDataContext();

            int nregistrosAfectados = 0;

            try
            {
                PeriodoGradoCurso obj = bd.PeriodoGradoCurso.Where(p => p.IID.Equals(id)).First();
                obj.BHABILITADO = 0;
                bd.SubmitChanges();
                nregistrosAfectados = 1;
            }
            catch (Exception ex)
            {

                
            }

            return nregistrosAfectados;
        }

        public int GuardarDatos(PeriodoGradoCurso oPeriodoGradoCurso)
        {
            PruebaDataContext bd = new PruebaDataContext();

            int nregistrosAfectados = 0;
            try
            {
                int id = oPeriodoGradoCurso.IID;
                if (oPeriodoGradoCurso.IID.Equals(0))
                {
                    int nvaces = bd.PeriodoGradoCurso.Where(p =>
                      p.IIDPERIODO.Equals(oPeriodoGradoCurso.IIDPERIODO)
                      && p.IIDGRADO.Equals(oPeriodoGradoCurso.IIDGRADO)
                      && p.IIDCURSO.Equals(oPeriodoGradoCurso.IIDCURSO)
                    ).Count();
                    if (nvaces==0)
                    {
                        bd.PeriodoGradoCurso.InsertOnSubmit(oPeriodoGradoCurso);
                        bd.SubmitChanges();
                        nregistrosAfectados = 1;
                    }
                    else
                    {
                        nregistrosAfectados = -1;
                    }
                   


                }else
                {
                    int nvaces = bd.PeriodoGradoCurso.Where(p =>
                     p.IIDPERIODO.Equals(oPeriodoGradoCurso.IIDPERIODO)
                     && p.IIDGRADO.Equals(oPeriodoGradoCurso.IIDGRADO)
                     && p.IIDCURSO.Equals(oPeriodoGradoCurso.IIDCURSO)
                     && !p.IID.Equals(oPeriodoGradoCurso.IID)).Count();

                    if (nvaces==0)
                    {
                        PeriodoGradoCurso obj = bd.PeriodoGradoCurso.Where(p => p.IID.Equals(id)).First();
                        obj.IIDCURSO = oPeriodoGradoCurso.IIDCURSO;
                        obj.IIDGRADO = oPeriodoGradoCurso.IIDGRADO;
                        obj.IIDPERIODO = oPeriodoGradoCurso.IIDPERIODO;
                        bd.SubmitChanges();
                        nregistrosAfectados = 1;
                    }
                    else
                    {
                        nregistrosAfectados = -1;
                    }

                   
                }

               
            }
            catch (Exception)
            {

                nregistrosAfectados = 0;
            }

            return nregistrosAfectados;
        }


    }
}