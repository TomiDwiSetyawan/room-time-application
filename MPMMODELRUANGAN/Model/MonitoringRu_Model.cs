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

        public MPMHRGADataContext ServiceContext { get; set; }
        MonitoringRU_OBJ MonitoringRU_OBJ = new MonitoringRU_OBJ();
        public MonitoringRu_Model() : base()
        {
            ServiceContext = new MPMHRGADataContext();
            MonitoringRU_OBJ.Context = (MPMHRGADataContext)Context;
        }

       
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
                               SELECT  IDTHRUANGAN,text,description, startDate, endDate, CREATEBY, CREATEDATE FROM MPMHRGA.dbo.MPMINFRUANGANHDR
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

        public string insertDataScheduls(MonitoringRU_REC item, string user)
        {
            try
            {
                var res = "";
                //var isExit = ServiceContext.MPMAMORTISATIONHDRs.Any(x => x.MPMAMORTISATIONHDRID == item.MPMAMORTISATIONHDRID).ToString();
                //if (isExit == "False")
                //{
                BeginTransaction();
                ServiceContext.CommandTimeout = 3200;
                var itemREC = new MPMINFRUANGANHDR();
                itemREC.IDTHRUANGAN = Guid.NewGuid();
                itemREC.text = item.text;
                itemREC.description = item.description;
                itemREC.startDate = item.startDate;
                itemREC.endDate = item.endDate;
                itemREC.CREATEDATE = DateTime.Now;
                itemREC.CREATEBY = user;
                ServiceContext.MPMINFRUANGANHDRs.InsertOnSubmit(itemREC);
                ServiceContext.SubmitChanges();
                Commit();

                res = "Berhasil Insert Data";

                return res;
                //}
                //else
                //{
                //    return "Gagal Insert Data";
                //}

            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public string deleteDataScheduls(MonitoringRU_REC item)
        {
            try
            {

                Context.CommandTimeout = 180;
                var query = $@" 
                               DELETE FROM MPMHRGA.dbo.MPMINFRUANGANHDR
                               WHERE IDTHRUANGAN =  '{item.IDTHRUANGAN}'
                            ";
                query = string.Format(query);
                var result = Context.ExecuteQuery<MonitoringRU_REC>(query);
                var res = "";
                res = "Berhasil Hapus Data";

                return res;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }

        }


        public string updateDataScheduls(MonitoringRU_REC item, string user)
        {
            try
            {
                var res = "";
                //var isExit = ServiceContext.MPMAMORTISATIONHDRs.Any(x => x.MPMAMORTISATIONHDRID == item.MPMAMORTISATIONHDRID).ToString();
                //if (isExit == "False")
                //{
                var itemREC = ServiceContext.MPMINFRUANGANHDRs.SingleOrDefault(x => x.IDTHRUANGAN == item.IDTHRUANGAN);


                BeginTransaction();
                ServiceContext.CommandTimeout = 3200;
                
                itemREC.text = item.text;
                itemREC.description = item.description;
                itemREC.startDate = item.startDate;
                itemREC.endDate = item.endDate;
                itemREC.MODIFDATE = DateTime.Now;
                itemREC.MODIFBY = user;
                //ServiceContext.MPMINFRUANGANHDRs.InsertOnSubmit(itemREC);
                ServiceContext.SubmitChanges();
                Commit();

                res = "Berhasil Update Data";

                return res;
                //}
                //else
                //{
                //    return "Gagal Insert Data";
                //}

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
