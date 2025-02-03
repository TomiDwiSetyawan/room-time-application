using MPMLibrary.NET.Lib.Db.Objects;
using MPMLibrary.NET.Lib.Exception;
using MPMMODELRUANGAN.Database;
using MPMMODELRUANGAN.Table.Record;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MPMMODELRUANGAN.Table
{
    public class MonitoringRU_OBJ : MPMDbObject<MPMHRGADataContext>
    {
        public MonitoringRU_OBJ() : base() { }

        //public MonitoringRU_REC ListHeaderRuangan()
        //{

        //    try
        //    {
        //        MPMHRGADataContext Context1 = new MPMHRGADataContext();
        //        var result = from a in Context1.mpmaccpphmasterpersonils
        //                     where a.personilid.ToString() == PERSONILID
        //                     select new MasterPersonilMu_Rec
        //                     {
        //                         PERSONILID = a.personilid.ToString(),
        //                         ALASANNONAKTIF = (a.alasannonaktif == null ? " " : a.alasannonaktif == "null" ? " " : a.alasannonaktif == "NULL" ? " " : a.alasannonaktif)
        //                     };
        //        return result.Take(1).FirstOrDefault();
        //    }

        //    catch (MPMException)
        //    {
        //        return null;
        //    }
        //}
    }
}
