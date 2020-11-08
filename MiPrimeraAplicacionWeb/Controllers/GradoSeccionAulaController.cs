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

        public JsonResult RecuperarInformacion(int id)
        {
            PruebaDataContext bd = new PruebaDataContext();

            var lista = bd.GradoSeccionAula.Where(p => p.IID.Equals(id)).
                Select(p => new
                {
                    p.IID,
                    p.IIDPERIODO,
                    p.IIDGRADOSECCION,
                    p.IIDCURSO,
                    p.IIDAULA,
                    p.IIDDOCENTE
             
                });

            return Json(lista, JsonRequestBehavior.AllowGet);

        }

        public int GuardarDatos(GradoSeccionAula oGradoSeccionAula)
        {
            PruebaDataContext bd = new PruebaDataContext();
            int nregistrosAfectados = 0;
            try
            {
                int iidgradoseccionaula = oGradoSeccionAula.IID;
                if (oGradoSeccionAula.IID.Equals(0))
                {
                    int nvaces = bd.GradoSeccionAula.Where(p =>
                      p.IIDPERIODO.Equals(oGradoSeccionAula.IIDPERIODO)
                      && p.IIDGRADOSECCION.Equals(oGradoSeccionAula.IIDGRADOSECCION)
                      && p.IIDCURSO.Equals(oGradoSeccionAula.IIDCURSO)).Count();

                    if (nvaces==0)
                    {
                        bd.GradoSeccionAula.InsertOnSubmit(oGradoSeccionAula);
                        bd.SubmitChanges();
                        nregistrosAfectados = 1;
                    }else
                    {
                        nregistrosAfectados = -1;
                    }
                   
                }else
                {
                    int nvaces = bd.GradoSeccionAula.Where(p =>
                      p.IIDPERIODO.Equals(oGradoSeccionAula.IIDPERIODO)
                      && p.IIDGRADOSECCION.Equals(oGradoSeccionAula.IIDGRADOSECCION)
                      && p.IIDCURSO.Equals(oGradoSeccionAula.IIDCURSO)
                      //&& p.IIDDOCENTE.Equals(oGradoSeccionAula.IIDDOCENTE)
                      && !p.IID.Equals(oGradoSeccionAula.IID)).Count();
                    if (nvaces==0)
                    {
                        GradoSeccionAula obj = bd.GradoSeccionAula.Where(p => p.IID.Equals(iidgradoseccionaula)).First();
                        obj.IIDAULA = oGradoSeccionAula.IIDAULA;
                        obj.IIDCURSO = oGradoSeccionAula.IIDCURSO;
                        obj.IIDDOCENTE = oGradoSeccionAula.IIDDOCENTE;
                        obj.IIDGRADOSECCION = oGradoSeccionAula.IIDGRADOSECCION;
                        obj.IIDPERIODO = oGradoSeccionAula.IIDPERIODO;
                        obj.BHABILITADO = oGradoSeccionAula.IIDPERIODO;
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

        public int Eliminar(int id)
        {
            PruebaDataContext bd = new PruebaDataContext();

            int nregistrosAfectados = 0;
            try
            {
                GradoSeccionAula obj = bd.GradoSeccionAula.Where(p => p.IID.Equals(id)).First();
                obj.BHABILITADO = 0;
                bd.SubmitChanges();
                nregistrosAfectados = 1;
            }
            catch (Exception)
            {

                nregistrosAfectados = 0;
            }
            return nregistrosAfectados;
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
                            NOMBRE = grado.NOMBRE + " - " + seccion.NOMBRE
                        };
            return Json(lista, JsonRequestBehavior.AllowGet);
        }


        public JsonResult Listar()
        {
            PruebaDataContext bd = new PruebaDataContext();

            var lista = from gsa in bd.GradoSeccionAula
                        join periodo in bd.Periodo
                        on gsa.IIDPERIODO equals periodo.IIDPERIODO
                        join gradoSeccion in bd.GradoSeccion
                        on gsa.IIDGRADOSECCION equals gradoSeccion.IID
                        join docente in bd.Docente
                        on gsa.IIDDOCENTE equals docente.IIDDOCENTE
                        join curso in bd.Curso
                        on gsa.IIDCURSO equals curso.IIDCURSO
                        join grado in bd.Grado
                        on gradoSeccion.IIDGRADO equals grado.IIDGRADO
                        where gsa.BHABILITADO.Equals(1)
                        select new
                        {
                            ID = gsa.IID,
                            NOMBREPERIODO = periodo.NOMBRE,
                            NOMBREGRADO = grado.NOMBRE,
                            NOMBRECURSO = curso.NOMBRE,
                            NOMBREDOCENTE = docente.NOMBRE
                           
                            //NOMBREAULA =aula.NOMBRE
                           
                           
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