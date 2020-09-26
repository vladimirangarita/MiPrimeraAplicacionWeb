using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MiPrimeraAplicacionWeb.Controllers
{
    public class AlumnoController : Controller
    {
        // GET: Alumno
        public ActionResult Index()
        {
            return View();
        }


        public JsonResult ListarSexo()
        {

            var lista = bd.Sexo.Where(p => p.BHABILITADO.Equals(1)).Select(p => new { IID = p.IIDSEXO, p.NOMBRE });

            return Json(lista, JsonRequestBehavior.AllowGet);

        }
        PruebaDataContext bd = new PruebaDataContext();
        public JsonResult ListarAlumnos()
        {


            var lista = (bd.Alumno.Where(p => p.BHABILITADO.Equals(1))
                .Select(p => new { p.IIDALUMNO, p.NOMBRE, p.APPATERNO, p.APMATERNO, p.TELEFONOPADRE })).ToList();

            return Json(lista, JsonRequestBehavior.AllowGet);
        }

        public JsonResult FiltrarAlumnoPorSexo(int iidsexo)
        {
            PruebaDataContext bd = new PruebaDataContext();
            var lista = bd.Alumno.Where(p => p.BHABILITADO.Equals(1)
              && p.IIDSEXO.Equals(iidsexo)).Select(p => new
              {
                  p.IIDALUMNO,
                  p.NOMBRE,
                  p.APMATERNO,
                  p.APPATERNO,
                  p.TELEFONOPADRE

              }).ToList();
            return Json(lista, JsonRequestBehavior.AllowGet);

        }

        public int Eliminar(int id)
        {
            PruebaDataContext bd = new PruebaDataContext();
            int nregistrosAfectados = 0;

            try
            {
                Alumno oAlumno = bd.Alumno.Where(p => p.IIDALUMNO.Equals(id)).First();
                oAlumno.BHABILITADO = 0;
                bd.SubmitChanges();
                nregistrosAfectados = 1;

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

           var Consulta = bd.Alumno.Where(p => p.IIDALUMNO.Equals(id)).Select(

                p => new
                {
                    p.IIDALUMNO,
                    p.NOMBRE,
                    p.APPATERNO,
                    p.APMATERNO,
            
                    FECHANAC = ((DateTime)p.FECHANACIMIENTO).ToShortDateString(),
                    p.IIDSEXO,
                    p.NUMEROHERMANOS,
                    p.TELEFONOPADRE,
                    p.TELEFONOMADRE,
                }


                );

            return Json(Consulta, JsonRequestBehavior.AllowGet);
        }

        public  int GuardarDatos(Alumno oAlumno)
        {
            int nregistrosAfectados = 0;
            try
            {
                int idAlumno = oAlumno.IIDALUMNO;
                PruebaDataContext bd = new PruebaDataContext();
                if (idAlumno == 0)
                {
                    bd.Alumno.InsertOnSubmit(oAlumno);
                    bd.SubmitChanges();
                    nregistrosAfectados = 1;

                }
                else
                {
                    Alumno obj = bd.Alumno.Where(p => p.IIDALUMNO.Equals(idAlumno)).First();
                    obj.NOMBRE = oAlumno.NOMBRE;
                    obj.APPATERNO = oAlumno.APPATERNO;
                    obj.APMATERNO = oAlumno.APMATERNO;
                    obj.IIDSEXO = oAlumno.IIDSEXO;
                    obj.TELEFONOPADRE = oAlumno.TELEFONOPADRE;
                    obj.TELEFONOMADRE = oAlumno.TELEFONOMADRE;
                    obj.NUMEROHERMANOS  = oAlumno.NUMEROHERMANOS;
                    obj.FECHANACIMIENTO = oAlumno.FECHANACIMIENTO;

                    bd.SubmitChanges();
                    nregistrosAfectados = 1;
                }

            }
            catch (Exception ex)
            {
                
                nregistrosAfectados = 0;
            }

            return nregistrosAfectados;
        }

    }
}