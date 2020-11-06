﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MiPrimeraAplicacionWeb.Controllers
{
    public class DocenteController : Controller
    {
        // GET: Docente
        public ActionResult Index()
        {
            return View();
        }

        public JsonResult  RecuperarInformacion(int id)
        {
            PruebaDataContext bd = new PruebaDataContext();
            var lista = bd.Docente.Where(p => p.IIDDOCENTE.Equals(id)).Select(
                   p => new
                   {
                       p.IIDDOCENTE,
                       p.NOMBRE,
                       p.APMATERNO,
                       p.APPATERNO,
                       p.DIRECCION,
                       p.TELEFONOCELULAR,
                       p.TELEFONOFIJO,
                       p.EMAIL,
                       p.IIDSEXO,
                       FECHACONTRAC = ((DateTime)p.FECHACONTRATO).ToShortDateString(),
                       p.IIDMODALIDADCONTRATO,
                       FOTOMOSTRAR= Convert.ToBase64String(p.FOTO.ToArray())
                }



                );

            return Json(lista, JsonRequestBehavior.AllowGet);
        }

        public int GuardarDatos(Docente oDocente, string cadenaFoto)
        {
            PruebaDataContext bd = new PruebaDataContext();
            int nregistradosAfectados = 0;
            try
            {
                int idDocente=oDocente.IIDDOCENTE;

                if (idDocente.Equals(0))
                {
                    int nveces = bd.Docente.Where(p => p.NOMBRE.Equals(oDocente.NOMBRE)
                      && p.APPATERNO.Equals(oDocente.APPATERNO) && p.APMATERNO.Equals(oDocente.APMATERNO)).Count();
                    if (nveces==0)
                    {
                        oDocente.FOTO = Convert.FromBase64String(cadenaFoto);
                        bd.Docente.InsertOnSubmit(oDocente);
                        bd.SubmitChanges();
                        nregistradosAfectados = 1;
                    }else
                    {
                        nregistradosAfectados = -1;
                    }
                    
                }else
                {
                    int nveces = bd.Docente.Where(p => p.NOMBRE.Equals(oDocente.NOMBRE)
                         && p.APPATERNO.Equals(oDocente.APPATERNO) && p.APMATERNO.Equals(oDocente.APMATERNO) && !p.IIDDOCENTE.Equals(oDocente.IIDDOCENTE)).Count();
                    if (nveces == 0)
                    {

                   
                    Docente obj =   bd.Docente.Where(p => p.IIDDOCENTE.Equals(idDocente)).First();
                    obj.NOMBRE = oDocente.NOMBRE;
                    obj.APPATERNO = oDocente.APPATERNO;
                    obj.APMATERNO = oDocente.APMATERNO;
                    obj.DIRECCION = oDocente.DIRECCION;
                    obj.TELEFONOCELULAR = oDocente.TELEFONOCELULAR;
                    obj.TELEFONOFIJO = oDocente.TELEFONOFIJO;
                    obj.EMAIL = oDocente.EMAIL;
                    obj.IIDSEXO = oDocente.IIDSEXO;
                    obj.FECHACONTRATO = oDocente.FECHACONTRATO;
                    obj.IIDMODALIDADCONTRATO = oDocente.IIDMODALIDADCONTRATO;
                    obj.BHABILITADO = oDocente.BHABILITADO;
                    obj.FOTO = Convert.FromBase64String(cadenaFoto);
                    bd.SubmitChanges();
                    nregistradosAfectados = 1;
                    }
                    else
                    {
                        nregistradosAfectados = -1;
                    }
                }


            }
            catch (Exception ex)
            {

                nregistradosAfectados = 0;
            }

            return nregistradosAfectados;
        }

        public JsonResult ListarDocente()
        {
            PruebaDataContext bd = new PruebaDataContext();
           

            var lista = bd.Docente.Where(p => p.BHABILITADO.Equals(1)).Select(
                p => new
                {
                    p.IIDDOCENTE,
                    p.NOMBRE,
                    p.APPATERNO,
                    p.APMATERNO,
                    p.EMAIL
                }).ToList();



             


            return Json(lista, JsonRequestBehavior.AllowGet);
        }

        public JsonResult FiltrarDocentePorModalidad(int iidmodalidad)
        {
            PruebaDataContext bd = new PruebaDataContext();
            

            var lista = bd.Docente.Where(p => p.BHABILITADO.Equals(1) && p.IIDMODALIDADCONTRATO.Equals(iidmodalidad)).Select(
                p => new
                {
                    p.IIDDOCENTE,
                    p.NOMBRE,
                    p.APPATERNO,
                    p.APMATERNO,
                    p.EMAIL
                }).ToList();






            return Json(lista, JsonRequestBehavior.AllowGet);
        }
        public JsonResult ListarModalidadContrato()
        {

            PruebaDataContext bd = new PruebaDataContext();
            var lista =( bd.ModalidadContrato.Where(p => p.BHABILITADO.Equals(1)).
                                    Select(p => new
                                    {

                                     IID =   p.IIDMODALIDADCONTRATO,
                                        p.NOMBRE
                                    })).ToList();


            return Json(lista, JsonRequestBehavior.AllowGet);


        }
       
        public int Eliminar(int id)
        {
            PruebaDataContext bd = new PruebaDataContext();
            int nregistrosAfectados=0;
            
            try
            {
                Docente oDocente =    bd.Docente.Where(p => p.IIDDOCENTE.Equals(id)).First();
                oDocente.BHABILITADO = 0;
                bd.SubmitChanges();
                nregistrosAfectados = 1;
            }
            catch (Exception)
            {

                nregistrosAfectados = 0;
            }
            return nregistrosAfectados;
        }

    }
}