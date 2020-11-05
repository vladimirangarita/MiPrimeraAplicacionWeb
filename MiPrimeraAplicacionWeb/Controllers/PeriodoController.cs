using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MiPrimeraAplicacionWeb.Controllers
{
    public class PeriodoController : Controller
    {
        // GET: Periodo
        public ActionResult Index()
        {
            return View();
        }


        public JsonResult ListarPeriodo()
        {
            PruebaDataContext bd = new PruebaDataContext();
         var lista =   (bd.Periodo.Where(p => p.BHABILITADO.Equals(1))
                .Select(p => new { p.IIDPERIODO, p.NOMBRE, FECHAINICIO = ((DateTime) p.FECHAINICIO).ToShortDateString(), FECHAFIN =((DateTime)  p.FECHAFIN).ToShortDateString() })).ToList();


            return Json(lista, JsonRequestBehavior.AllowGet);
        }

        public JsonResult BuscarPeriodoPorNombre(string NombrePeriodo)
        {
            PruebaDataContext bd = new PruebaDataContext();
            var lista = (bd.Periodo.Where(p => p.BHABILITADO.Equals(1) && p.NOMBRE.Contains(NombrePeriodo))
                   .Select(p => new { p.IIDPERIODO, p.NOMBRE, FECHAINICIO = ((DateTime)p.FECHAINICIO).ToShortDateString(), FECHAFIN = ((DateTime)p.FECHAFIN).ToShortDateString() })).ToList();


            return Json(lista, JsonRequestBehavior.AllowGet);
        }

        public int Eliminar(Periodo oPeriodo)
        {
            PruebaDataContext bd = new PruebaDataContext();
            int nregistrosAfectados = 0;
            try
            {
                int idperiodo = oPeriodo.IIDPERIODO;
                Periodo obj = bd.Periodo.Where(p => p.IIDPERIODO.Equals(idperiodo)).First();
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

        public  JsonResult RecuperarInformacion(int id)
        {
            PruebaDataContext bd = new PruebaDataContext();
            var lista = bd.Periodo.Where(p => p.IIDPERIODO.Equals(id)).Select(
                P =>new
                {
                    P.IIDPERIODO,
                    P.NOMBRE,
                   FECHAINICIOCADENA= ((DateTime) P.FECHAINICIO).ToShortDateString(),
                   FECHAFINCADENA= ((DateTime)P.FECHAFIN).ToShortDateString()


                }
                );
            return Json(lista,JsonRequestBehavior.AllowGet);

        }
        

        public int GuardarDatos(Periodo oPerido)
        {
            PruebaDataContext bd = new PruebaDataContext();
            int nregistrosAfectados = 0;

            try
            {
                int idPerido = oPerido.IIDPERIODO;
                if(idPerido >= 1)
                {
                    //Editar
                    int nveces = bd.Periodo.Where(p => p.NOMBRE.Equals(oPerido.NOMBRE) && !p.IIDPERIODO.Equals(idPerido)).Count();
                    if (nveces==0)
                    {

                   
                    Periodo obj = bd.Periodo.Where(p => p.IIDPERIODO.Equals(idPerido)).First();
                    obj.NOMBRE = oPerido.NOMBRE;
                    obj.FECHAINICIO = oPerido.FECHAINICIO;
                    obj.FECHAFIN = oPerido.FECHAFIN;
                    bd.SubmitChanges();
                    nregistrosAfectados = 1;
                    }else
                    {
                        nregistrosAfectados = -1;
                    }
                }
                else
                {
                 int nveces =   bd.Periodo.Where(p => p.NOMBRE.Equals(oPerido.NOMBRE)).Count();
                    if (nveces == 0){
                        bd.Periodo.InsertOnSubmit(oPerido);
                        bd.SubmitChanges();
                        nregistrosAfectados = 1;
                    }
                    else
                    {
                        //ya existe
                        nregistrosAfectados = -1;
                    }
                  
                    //Nuevo
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