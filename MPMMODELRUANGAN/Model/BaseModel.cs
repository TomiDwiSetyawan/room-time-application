using MPMLibrary.NET.Lib.Exception;
using MPMLibrary.NET.Mvc.Models;
using MPMMODELRUANGAN.Database;
using MPMMODELRUANGAN.Table;
using MPMMODELRUANGAN.Table.Record;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MPMMODELRUANGAN.Model
{
    public class BaseModel : MPMModel
    {
        public MonitoringRU_OBJ MonitoringRU_ = new MonitoringRU_OBJ();

        public BaseModel() : base()
        {
            Context = new MPMHRGADataContext();
            MonitoringRU_.Context = (MPMHRGADataContext)Context;
        }
    }
}
