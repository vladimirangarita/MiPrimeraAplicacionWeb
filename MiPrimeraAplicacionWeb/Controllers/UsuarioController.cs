using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Transactions;
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

        public int GuardarDatos(Usuario oUsuario, string nombreCompleto)
        {
            int rpta = 0;
            try
            {

           
       
            int idUsuario = oUsuario.IIDUSUARIO;
            using (PruebaDataContext bd=new PruebaDataContext())
            {
                using (var transaccion= new TransactionScope())
                {
                    if (idUsuario == 0)
                    {
                        if (idUsuario==0)
                        {
                            string clave = oUsuario.CONTRA;
                            SHA256Managed sha = new SHA256Managed();
                            byte[] dataNoCifrada = Encoding.Default.GetBytes(clave);
                            byte[] dataCifrada= sha.ComputeHash(dataNoCifrada);
                            oUsuario.CONTRA =  BitConverter.ToString(dataCifrada).Replace("-", "");
                           char tipo = char.Parse(nombreCompleto.Substring(nombreCompleto.Length - 2,1));
                            oUsuario.TIPOUSUARIO = tipo;
                            bd.Usuario.InsertOnSubmit(oUsuario);

                            if (tipo.Equals("A")) 
                            {
                                Alumno oAlumno = bd.Alumno.Where(p => p.IIDALUMNO == oUsuario.IID).First();
                                oAlumno.bTieneUsuario = 1;

                            }
                            else
                            {
                                Docente oDocente = bd.Docente.Where(p => p.IIDDOCENTE == oUsuario.IID).First();
                                oDocente.bTieneUsuario = 1;
                            }
                            bd.SubmitChanges();
                            transaccion.Complete();
                            rpta = 1;
                        }
                    }
                }
            }
            }
            catch (Exception ex)
            {

                rpta = 0;
            }
            return rpta;
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