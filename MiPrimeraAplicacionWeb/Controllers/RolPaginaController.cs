using System;
using System.Collections.Generic;
using System.Linq;
using System.Transactions;
using System.Web;
using System.Web.Mvc;

namespace MiPrimeraAplicacionWeb.Controllers
{
    public class RolPaginaController : Controller
    {
        // GET: RolPagina
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult ListarRol()
        {
            using (PruebaDataContext bd = new PruebaDataContext())
            {
                var lista = bd.Rol.Where(p => p.BHABILITADO == 1)
                    .Select(p => new
                    {
                        p.IIDROL,
                        p.NOMBRE,
                        p.DESCRIPCION

                    }).ToList();

                return Json(lista, JsonRequestBehavior.AllowGet);
            }

        }

        public JsonResult ListarPaginas()
        {
            using (PruebaDataContext bd= new PruebaDataContext())
            {
                var lista = bd.Pagina.Where(p => p.BHABILITADO == 1)
                    .Select(
                    p => new
                    {
                        p.IIDPAGINA,
                        p.MENSAJE,
                        p.BHABILITADO
                    }
                    ).ToList();

                return Json(lista, JsonRequestBehavior.AllowGet);
            }

            
        }

        public JsonResult ObtenerRol(int idRol)
        {
            using (PruebaDataContext bd=new PruebaDataContext())
            {
                var rol = bd.Rol.Where(p => p.IIDROL == idRol).Select(
                    p => new
                    {
                        p.IIDROL,
                        p.NOMBRE,
                        p.DESCRIPCION
                    }
                    ).First();

                return Json(rol, JsonRequestBehavior.AllowGet);
            }

        }

        public JsonResult ListarRolPagina(int idRol)
        {
            using (PruebaDataContext bd = new PruebaDataContext())
            {
                var lista = bd.RolPagina.Where(p => p.IIDROL == idRol && p.BHABILITADO == 1)
                    .Select(x => new

                    {
                        x.IIDROL,
                        x.IIDPAGINA,
                        x.BHABILITADO
                    }).ToList();

                return Json(lista, JsonRequestBehavior.AllowGet);
            }


        }

        public int GuardarDatos(Rol oRolCLS, string dataEnviar)
        {

            int rpta = 0;
            try
            {

                using (PruebaDataContext bd=new PruebaDataContext())
                {

                    using (var transaccion = new TransactionScope())
                    {

                        if (oRolCLS.IIDROL==0)
                        {
                            Rol oRol = new Rol();
                            oRol.NOMBRE = oRolCLS.NOMBRE;
                            oRol.DESCRIPCION = oRolCLS.DESCRIPCION;
                            oRol.BHABILITADO = oRolCLS.BHABILITADO;
                            bd.Rol.InsertOnSubmit(oRol);
                            bd.SubmitChanges();

                            string[] codigos = dataEnviar.Split('$');
                            for (int i = 0; i < codigos.Length; i++)
                            {
                                RolPagina oRolPagina = new RolPagina();
                                oRolPagina.IIDROL = oRol.IIDROL;
                                oRolPagina.IIDPAGINA = int.Parse(codigos[i]);
                                oRolPagina.BHABILITADO = 1;
                                bd.RolPagina.InsertOnSubmit(oRolPagina);


                            }
                            rpta = 1;
                            bd.SubmitChanges();
                            transaccion.Complete();
                        }
                        else
                        {
                            Rol oRol = bd.Rol.Where(p => p.IIDROL == oRolCLS.IIDROL).First();
                            oRol.NOMBRE = oRolCLS.NOMBRE;
                            oRol.DESCRIPCION = oRolCLS.DESCRIPCION;

                            var lista = bd.RolPagina.Where(p => p.IIDROL == oRolCLS.IIDROL);
                            foreach (RolPagina oRolPagina in lista)
                            {
                                oRolPagina.BHABILITADO = 0;

                            }
                            string[] codigos = dataEnviar.Split('$');
                            for (int i = 0; i < codigos.Length; i++)
                            {
                                int cantidad = bd.RolPagina.Where(p => p.IIDROL == oRolCLS.IIDROL && p.IIDPAGINA == int.Parse(codigos[i])).Count();
                                if (cantidad==0)
                                {
                                    RolPagina oRolPagina = new RolPagina();
                                    oRolPagina.IIDROL = oRol.IIDROL;
                                    oRolPagina.IIDPAGINA = int.Parse(codigos[i]);
                                    oRolPagina.BHABILITADO = 1;
                                    bd.RolPagina.InsertOnSubmit(oRolPagina);

                                }
                                else
                                {
                                    RolPagina oRolPagina =   bd.RolPagina.Where(p => p.IIDROL == oRolCLS.IIDROL && p.IIDPAGINA == int.Parse(codigos[i])).First();
                                    oRolPagina.BHABILITADO = 1;

                                }
                                
                            }
                            rpta = 1;
                            bd.SubmitChanges();
                            transaccion.Complete();
                        }


                    }


                }



            }
            catch (Exception ex)
            {

                //throw;
            }
            return rpta;
        }


    }
}