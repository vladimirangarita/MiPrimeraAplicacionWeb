using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MiPrimeraAplicacionWeb.Controllers
{
    public class CursoController : Controller
    {
        // GET: Curso
        public ActionResult Index()
        {
            return View();
        }

        public string  Mensaje()
        {
            return "Bienvenido MVC";
        }
        public JsonResult RecuperarDatos(int id)
        {
            PruebaDataContext bd = new PruebaDataContext();
            var lista = bd.Curso.Where(p => p.BHABILITADO.Equals(1) && p.IIDCURSO.Equals(id))
                .Select(p => new { p.IIDCURSO, p.NOMBRE, p.DESCRIPCION }).ToList();

            return Json(lista, JsonRequestBehavior.AllowGet);

        }

        public int GuardarDatos(Curso ocurso)
        {
            PruebaDataContext bd = new PruebaDataContext();
            int nregistrosAfectados = 0;
            try
            {

                if (ocurso.IIDCURSO == 0)
                {
                    int nveces = bd.Curso.Where(p => p.NOMBRE.Equals(ocurso.NOMBRE)).Count();
                    if (nveces == 0)
                    {
                        bd.Curso.InsertOnSubmit(ocurso);
                        bd.SubmitChanges();
                        nregistrosAfectados = 1;
                    }
                    else
                    {
                        nregistrosAfectados = -1;
                    }
                   
                }else
                {
                    int nveces = bd.Curso.Where(p => p.NOMBRE.Equals(ocurso.NOMBRE) && !p.IIDCURSO.Equals(ocurso)).Count();
                    if (nveces==0)
                    {
                        Curso cursoSel = bd.Curso.Where(p => p.IIDCURSO.Equals(ocurso.IIDCURSO)).First();
                        cursoSel.NOMBRE = ocurso.NOMBRE;
                        cursoSel.DESCRIPCION = ocurso.DESCRIPCION;
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



        public int EliminarCurso(Curso ocurso)
        {
            PruebaDataContext bd = new PruebaDataContext();
            int nregistrosAfectados = 0;


            try
            {
                Curso cursoSel = bd.Curso.Where(p => p.IIDCURSO.Equals(ocurso.IIDCURSO)).First();
                cursoSel.BHABILITADO = 0;
                bd.SubmitChanges();
                nregistrosAfectados = 1;
            }
            catch (Exception)
            {

                nregistrosAfectados = 0;
            }



            return nregistrosAfectados;
        }



        public string Saludo(string Nombre)
        {
            return "Hola" + Nombre;
        }
        public string SaludoCompleto(string Nombre, string Apellido)
        {
            return "Hola" + Nombre + " " + Apellido;
        }

        public JsonResult listarCurso()
        {
            PruebaDataContext bd = new PruebaDataContext();
            var lista = bd.Curso.Where(p => p.BHABILITADO.Equals(1))
                .Select(p => new { p.IIDCURSO, p.NOMBRE, p.DESCRIPCION }).ToList();

            return Json(lista, JsonRequestBehavior.AllowGet);
           
        }

        public JsonResult BuscarCursoPorNombre(string nombre)
        {
            PruebaDataContext bd = new PruebaDataContext();
            var lista = bd.Curso.Where(p => p.BHABILITADO.Equals(1) && p.NOMBRE.Contains(nombre))
                .Select(p => new { p.IIDCURSO, p.NOMBRE, p.DESCRIPCION }).ToList();

            return Json(lista, JsonRequestBehavior.AllowGet);

        }

    }
}