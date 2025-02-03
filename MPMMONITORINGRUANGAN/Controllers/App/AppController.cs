using MPMLibrary.NET.Mvc.Controllers;
using MPMMODELRUANGAN.Table.Record;
using MPMMONITORINGRUANGAN.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace MPMMONITORINGRUANGAN.Controllers.App
{
    public class AppController : MPMController<MonitoringRuanganModel>
    {
        // GET: App
        public AppController() : base()
        {
            Model = new MonitoringRuanganModel();
        }

        // GET: App
        public override ActionResult Index()
        {
            Session["userId"] = UserSession == null ? "gundala" : UserSession.NAME;
            return View();
        }

        public JsonResult listData()
        {
            try
            {
                var listgrid = Model.ListDataSchedule();

                return Json(new
                {
                    status = 1,
                    message = "",
                    data = "Data Called!",
                    grid = listgrid

                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return Json(new
                {
                    status = 0,
                    message = e.Message,
                    code = "",
                    data = "Error"
                }, JsonRequestBehavior.AllowGet);
            }
        }

    }
}