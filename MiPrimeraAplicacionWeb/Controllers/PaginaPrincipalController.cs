﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MiPrimeraAplicacionWeb.Controllers
{
    public class PaginaPrincipalController : Controller
    {
        // GET: PaginaPrincipal
        public ActionResult Index()
        {
            int idusuario = (int)Session["idusuario"];
         
            using (PruebaDataContext bd = new PruebaDataContext())
            {
                string nombreCompleto="";
                Usuario usu = bd.Usuario.Where(p => p.IIDUSUARIO == idusuario).First();
                if (usu.TIPOUSUARIO=='D')
                {
             Docente odocente =       bd.Docente.Where(p => p.IIDDOCENTE == usu.IID).First();
                    nombreCompleto = odocente.NOMBRE + " " + odocente.APPATERNO + " " + odocente.APMATERNO;
                    ViewBag.nombreCompleto = nombreCompleto;
                }
                else
                {
                    Alumno oAlumno = bd.Alumno.Where(p => p.IIDALUMNO == usu.IID).First();
                    nombreCompleto = oAlumno.NOMBRE + " " + oAlumno.APPATERNO + " " + oAlumno.APMATERNO;
                    ViewBag.nombreCompleto = nombreCompleto;
                }
            }
            return View();
        }
    }
}