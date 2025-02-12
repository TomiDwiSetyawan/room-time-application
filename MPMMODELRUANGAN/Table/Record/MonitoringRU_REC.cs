using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MPMMODELRUANGAN.Table.Record
{
    public class MonitoringRU_REC
    {
        public Guid IDTHRUANGAN { get; set; }
        public string text { get; set; }
        public DateTime startDate { get; set; }
        public DateTime endDate { get; set; }
        public string CREATEBY { get; set; }
        public DateTime CREATEDATE { get; set; }
        public string MODIFBY { get; set; }
        public DateTime MODIFDATE { get; set; }
        public string description { get; set; }
    }
}
