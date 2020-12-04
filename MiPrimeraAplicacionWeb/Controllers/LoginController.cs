using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace MiPrimeraAplicacionWeb.Controllers
{
    public class LoginController : Controller
    {
        // GET: Login
        public ActionResult Index()
        {
            return View();
        }

        public int ValidarUsuario(string usuario,string contra)
        {
            int rpta = 0;
            try
            {
                using (PruebaDataContext bd=new PruebaDataContext())
                {
                    SHA256Managed sha = new SHA256Managed();
                    byte[] dataNoCifrada = Encoding.Default.GetBytes(contra);
                    byte[] dataCifrada = sha.ComputeHash(dataNoCifrada);
                    string contraCifrada = BitConverter.ToString(dataCifrada).Replace("-", "");

                    rpta = bd.Usuario.Where(p => p.NOMBREUSUARIO == usuario && p.CONTRA == contraCifrada).Count();

                }
            }
            catch (Exception ex)
            {

                rpta = 0;
            }
            return rpta;
        }

        public ActionResult Cerrar()
        {
            return RedirectToAction("Index");
        }
    }
}