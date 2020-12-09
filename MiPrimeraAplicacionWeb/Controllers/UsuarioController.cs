using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Transactions;
using System.Web;
using System.Web.Mvc;
using MiPrimeraAplicacionWeb.Filters;
using MiPrimeraAplicacionWeb.Models;
namespace MiPrimeraAplicacionWeb.Controllers
{
    [Seguridad]
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

                            if (tipo.Equals('A')) 
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
                        }else
                            {
                                Usuario ousuarioCLS = bd.Usuario.Where(p => p.IIDUSUARIO == idUsuario).First();
                                ousuarioCLS.IIDROL = oUsuario.IIDROL;
                                ousuarioCLS.NOMBREUSUARIO = oUsuario.NOMBREUSUARIO;
                                bd.SubmitChanges();
                                transaccion.Complete();
                                rpta = 1;
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

        public JsonResult RecuperarInformacion(int idUsuario)
        {
            using (PruebaDataContext bd=new PruebaDataContext())
            {
                var ousuario = bd.Usuario.Where(p => p.IIDUSUARIO == idUsuario).
                    Select(
                    p => new
                    {
                        p.IIDUSUARIO,
                        p.NOMBREUSUARIO,
                        p.IIDROL

                    }



                    ).First();
                return Json(ousuario,JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult ListarUsuarios()
        {
            List<UsuarioCLS> ListarUsuario = new List<UsuarioCLS>();
            using (PruebaDataContext bd=new PruebaDataContext())
            {
                List<UsuarioCLS> ListaAlumno = (from usuario in bd.Usuario
                                                join alumno in bd.Alumno
                                                on usuario.IID equals alumno.IIDALUMNO
                                                join rol in bd.Rol
                                                on usuario.IIDROL equals rol.IIDROL
                                                where usuario.BHABILITADO == 1 && usuario.TIPOUSUARIO == 'A'
                                                select new UsuarioCLS
                                                {
                                                    idUsuario = usuario.IIDUSUARIO,
                                                    NombrePersona = alumno.NOMBRE + " " + alumno.APPATERNO + " " + alumno.APMATERNO,
                                                    NombreUsuario = usuario.NOMBREUSUARIO,
                                                    NombreRol = rol.NOMBRE,
                                                    NombreTipoEmpleado = "ALUMNO"

                                                }).ToList();
                                          ListarUsuario.AddRange(ListaAlumno);
                List<UsuarioCLS> ListaDocente = (from usuario in bd.Usuario
                                                join docente in bd.Docente
                                                on usuario.IID equals docente.IIDDOCENTE
                                                join rol in bd.Rol
                                                on usuario.IIDROL equals rol.IIDROL
                                                where usuario.BHABILITADO == 1 && usuario.TIPOUSUARIO == 'D'
                                                select new UsuarioCLS
                                                {
                                                    idUsuario = usuario.IIDUSUARIO,
                                                    NombrePersona = docente.NOMBRE + " " + docente.APPATERNO + " " + docente.APMATERNO,
                                                    NombreUsuario = usuario.NOMBREUSUARIO,
                                                    NombreRol = rol.NOMBRE,
                                                    NombreTipoEmpleado = "DOCENTE"

                                                }).ToList();
                ListarUsuario.AddRange(ListaDocente);

                ListarUsuario = ListarUsuario.OrderBy(p =>p.idUsuario).ToList();

                return Json(ListarUsuario, JsonRequestBehavior.AllowGet);
        }

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