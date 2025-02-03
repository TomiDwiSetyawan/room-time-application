using MPMLibrary.NET.Lib.Exception;
using MPMMODELRUANGAN.Database;
using MPMMODELRUANGAN.Table;
using MPMMODELRUANGAN.Table.Record;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MPMMODELRUANGAN.Model
{
    public class MonitoringRu_Model : BaseModel
    {
        MonitoringRU_OBJ MonitoringRU_OBJ = new MonitoringRU_OBJ();
        public MonitoringRu_Model() : base()
        {
            MonitoringRU_OBJ.Context = (MPMHRGADataContext)Context;
        }

        //public List<string> ListJabatan()
        //{
        //    try
        //    {
        //        return MonitoringRU_OBJ.();
        //    }
        //    catch (MPMException E)
        //    {
        //        throw new MPMException(E.Message);
        //    }
        //}

        public List<MonitoringRU_REC> ListDataSchedule()
        {
        //    int statusconv = datastatus == "Draft" ? 0 :
        //                       datastatus == "Release" ? 1 :
        //                        datastatus == "Final" ? 2 :
        //                         datastatus == "Release to AX error" ? 3 :
        //                          datastatus == "ALL" ? 4 : 0;

            //var dataarea = UserSession == null ? "mml" : UserSession.DATAAREA_ID;
           
                try
                {
                   
                    Context.CommandTimeout = 180;
                    var query = @" 
                               SELECT  IDTHRUANGAN,text, startDate, endDate, CREATEBY, CREATEDATE FROM MPMHRGA.dbo.MPMINFRUANGANHDR
                            ";
                    query = string.Format(query);
                    var result = Context.ExecuteQuery<MonitoringRU_REC>(query);
                    var hasil = result.ToList();
                    return hasil;
                    
                }
                catch (Exception e)
                {
                    throw new Exception(e.Message);
                }
            
        }

        //public void UpdateDataEntry(mpmaccpphinsentifhdr item, Guid idinsentif, string jabatan, string transaksi, string company, string departemen, string pasalpajakpph, string coapph, string deskripsipph, string coa, string deskripsicoa, string bankaccount, string deskripsi, int tahun, int bulan, string tanggalcon, string jurnalnumber, string jurnalvoucher, int status, string user)
        //{
        //    BeginTransaction();
        //    try
        //    {
        //        CultureInfo culture = new CultureInfo("en-US");
        //        DateTime tempDate = Convert.ToDateTime(tanggalcon, culture);

        //        item.idinsentif = idinsentif;
        //        item.jabatan = jabatan.ToUpper();
        //        item.transaksi = transaksi;
        //        item.company = company;
        //        item.departemen = departemen;
        //        item.coapph = coapph;
        //        item.deskripsipph = deskripsipph;
        //        item.coa = coa;
        //        item.deskripsicoa = deskripsicoa;
        //        item.bankaccount = bankaccount;
        //        item.deskripsi = deskripsi;
        //        item.tahun = tahun;
        //        item.bulan = bulan;
        //        item.pasalpajakpph = pasalpajakpph;
        //        item.tglpajak = tempDate;
        //        item.jurnalnumber = jurnalnumber;
        //        item.jurnalvoucher = jurnalvoucher;
        //        item.status = status;
        //        item.modifby = user;
        //        item.modifdate = DateTime.Now;


        //        Commit();
        //    }
        //    catch (MPMException e)
        //    {
        //        throw new MPMException(e.Message);
        //    }
        //}


    }
}
