using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MiPrimeraAplicacionWeb.Controllers
{
    public class ProfesorNotasController : Controller
    {
        // GET: ProfesorNotas
        public ActionResult Index()
        {
            return View();
        }


        public JsonResult ListarPeriodos()
        {
            PruebaDataContext bd = new PruebaDataContext();

            int idUsuario = (int)Session["idusuario"];
            Usuario oUsuario = bd.Usuario.Where(p => p.IIDUSUARIO == idUsuario && p.TIPOUSUARIO == 'D').First();
            int idDocente = (int)oUsuario.IID;
            //var listaPeriodos =    bd.GradoSeccionAula.Where(p => p.IIDDOCENTE == idDocente && p.BHABILITADO==1).
            //    Select(p=>new {



            //    }).Distinct();
            var listaPeriodos = (from gradoSeccionAula in bd.GradoSeccionAula
                                 join periodo in bd.Periodo
                                 on gradoSeccionAula.IIDPERIODO equals periodo.IIDPERIODO
                                 where gradoSeccionAula.IIDDOCENTE == idDocente && gradoSeccionAula.BHABILITADO == 1
                                 select new
                                 {
                                     IID = periodo.IIDPERIODO,
                                     periodo.NOMBRE
                                 }).Distinct();
            return Json(listaPeriodos, JsonRequestBehavior.AllowGet);

        }

        public JsonResult ListarGrados(int iidPeriodo)
        {
            PruebaDataContext bd = new PruebaDataContext();

            int idUsuario = (int)Session["idusuario"];
            Usuario oUsuario = bd.Usuario.Where(p => p.IIDUSUARIO == idUsuario && p.TIPOUSUARIO == 'D').First();
            int idDocente = (int)oUsuario.IID;

            var ListaGrados = (from gradoseccionAula in bd.GradoSeccionAula
                               join gradoSeccion in bd.GradoSeccion
                               on gradoseccionAula.IIDGRADOSECCION
                               equals gradoSeccion.IID
                               join grado in bd.Grado
                               on gradoSeccion.IIDGRADO equals grado.IIDGRADO
                               where gradoseccionAula.BHABILITADO == 1
                               && gradoseccionAula.IIDDOCENTE == idDocente
                               && gradoseccionAula.IIDPERIODO == iidPeriodo
                               select new
                               {
                                   IID = grado.IIDGRADO,
                                   grado.NOMBRE
                               }).Distinct();
            return Json(ListaGrados, JsonRequestBehavior.AllowGet);

        }


        public JsonResult ListarCursos(int iidPeriodo, int iidGrado)
        {
            PruebaDataContext bd = new PruebaDataContext();

            int idUsuario = (int)Session["idusuario"];
            Usuario oUsuario = bd.Usuario.Where(p => p.IIDUSUARIO == idUsuario && p.TIPOUSUARIO == 'D').First();
            int idDocente = (int)oUsuario.IID;

            var ListaCurso = (from gradoseccionAula in bd.GradoSeccionAula
                              join gradoSeccion in bd.GradoSeccion
                              on gradoseccionAula.IIDGRADOSECCION
                              equals gradoSeccion.IID
                              join grado in bd.Grado
                              on gradoSeccion.IIDGRADO equals grado.IIDGRADO
                              join curso in bd.Curso
                              on gradoseccionAula.IIDCURSO equals curso.IIDCURSO
                              where gradoseccionAula.BHABILITADO == 1
                                && gradoseccionAula.IIDDOCENTE == idDocente
                                && gradoseccionAula.IIDPERIODO == iidPeriodo
                                && grado.IIDGRADO == iidGrado
                              select new
                              {
                                IID =  curso.IIDCURSO,
                                  curso.NOMBRE

                              }).ToList();
            return Json(ListaCurso, JsonRequestBehavior.AllowGet);

        }

        public JsonResult ListarAlumnos(int iidPeriodo, int iidGrado, int iidCurso)
        {
            PruebaDataContext bd = new PruebaDataContext();

            var ListaAlumnos = (from matricula in bd.Matricula
                                join detalleMatricula in bd.DetalleMatricula
                                on matricula.IIDMATRICULA equals detalleMatricula.IIDMATRICULA
                                join alumno in bd.Alumno
                                on matricula.IIDALUMNO equals alumno.IIDALUMNO
                                where matricula.IIDPERIODO == iidPeriodo
                                && matricula.IIDGRADO == iidGrado
                                && detalleMatricula.IIDCURSO == iidCurso
                                select new
                                {
                                    matricula.IIDALUMNO,
                                    NOMBRECOMPLETO = alumno.NOMBRE + " " + alumno.APPATERNO + " " + alumno.APMATERNO,
                                    detalleMatricula.NOTA1,
                                    detalleMatricula.NOTA2,
                                    detalleMatricula.NOTA3,
                                    detalleMatricula.NOTA4,
                                    detalleMatricula.PROMEDIO,

                                }).Distinct();

                    return Json(ListaAlumnos,JsonRequestBehavior.AllowGet);

        }

    }
}