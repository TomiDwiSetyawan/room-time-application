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


        public List<MonitoringRU_REC> ListDataSchedule(string npk)
        {
           
           if(npk == "") {
                try
                {

                    Context.CommandTimeout = 180;
                    var query = $@" 
                                
                                    SELECT 
	                                    IDTHRUANGAN,
                                        text,
                                        description,
                                        startDate,
                                        endDate,
                                        STUFF((
                                            SELECT ', ' + CAST(b2.NPK AS VARCHAR)
                                            FROM MPMHRGA.dbo.MPMINFRUANGANDTL b2
                                            WHERE b2.IDTHRUANGAN = a.IDTHRUANGAN 
		                                    and NPK = '{npk}'
                                            FOR XML PATH(''), TYPE).value('.', 'NVARCHAR(MAX)'), 1, 2, '') AS NPK
                                    FROM MPMHRGA.dbo.MPMINFRUANGANHDR a
                                    GROUP BY text, description, startDate, endDate, a.IDTHRUANGAN



                            ";

                    //var query = @" 
                    //            SELECT  a.IDTHRUANGAN,text,description, startDate, endDate, a.CREATEBY, a.CREATEDATE, b.NPK USERNAME 
                    //            FROM MPMHRGA.dbo.MPMINFRUANGANHDR a
                    //            join MPMHRGA.dbo.MPMINFRUANGANDTL b on b.IDTHRUANGAN = a.IDTHRUANGAN
                    //        ";
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
            else
            {
                try
                {

                    Context.CommandTimeout = 180;
                    var query = @" 
                                SELECT  a.IDTHRUANGAN,text,description, startDate, endDate, a.CREATEBY, a.CREATEDATE
                                FROM MPMHRGA.dbo.MPMINFRUANGANHDR a
                            ";

                    //var query = @" 
                    //            SELECT  a.IDTHRUANGAN,text,description, startDate, endDate, a.CREATEBY, a.CREATEDATE, b.NPK USERNAME 
                    //            FROM MPMHRGA.dbo.MPMINFRUANGANHDR a
                    //            join MPMHRGA.dbo.MPMINFRUANGANDTL b on b.IDTHRUANGAN = a.IDTHRUANGAN
                    //        ";
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

        }

        public List<DataDetail_REC> ListDataParticipant()
        {
            try
            {

                Context.CommandTimeout = 180;
                var query = @" 
                               SELECT DISTINCT NPK ID, NPK + ' ' +  UPPER(USER_NAME) NPK FROM MPMIT.dbo.MPM_USER
                            ";
                query = string.Format(query);
                var result = Context.ExecuteQuery<DataDetail_REC>(query);
                var hasil = result.ToList();
                return hasil;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }

        }

        public List<DataDetail_REC> ListDataDTL(string ID)
        {
            try
            {

                Context.CommandTimeout = 180;
                var query = $@"
                            SELECT DISTINCT NPK ID
                            FROM MPMHRGA.dbo.MPMINFRUANGANDTL
                            WHERE IDTHRUANGAN = '{ID}'";
                query = string.Format(query);
                var result = Context.ExecuteQuery<DataDetail_REC>(query);
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

            bool isExists = ServiceContext.MPMINFRUANGANHDRs.Any(x => x.text == item.text &&
              ((item.startDate >= x.startDate && item.startDate <= x.endDate) ||
               (item.endDate >= x.startDate && item.endDate <= x.endDate) ||
               (item.startDate <= x.startDate && item.endDate >= x.endDate)));

            if (!isExists)
            {

                bool isExists2 = (from hdr in ServiceContext.MPMINFRUANGANHDRs
                                  join dtl in ServiceContext.MPMINFRUANGANDTLs
                                      on hdr.IDTHRUANGAN equals dtl.IDTHRUANGAN
                                  where item.npk.Contains(dtl.NPK)
                                  && (
                                      (item.startDate >= hdr.startDate && item.startDate <= hdr.endDate) ||
                                      (item.endDate >= hdr.startDate && item.endDate <= hdr.endDate) ||
                                      (item.startDate <= hdr.startDate && item.endDate >= hdr.endDate)
                                  )
                                  select hdr).Any();
                if (!isExists2)
                {
                    try
                    {

                        //base(global::System.Configuration.ConfigurationManager.ConnectionStrings["MPMHRGA"].ConnectionString, mappingSource)
                        var res = "";
                        //var isExit = ServiceContext.MPMINFRUANGANHDRs.Any(x => x.startDate == item.startDate).ToString();
                        //if (isExit == "False")
                        //{
                        BeginTransaction();

                        Guid IDTHRUANGAN = Guid.NewGuid();

                        ServiceContext.CommandTimeout = 3200;
                        var itemREC = new MPMINFRUANGANHDR();
                        itemREC.IDTHRUANGAN = IDTHRUANGAN;
                        itemREC.text = item.text;
                        itemREC.description = item.description;
                        itemREC.startDate = item.startDate;
                        itemREC.endDate = item.endDate;
                        itemREC.CREATEDATE = DateTime.Now;
                        itemREC.CREATEBY = user;
                        ServiceContext.MPMINFRUANGANHDRs.InsertOnSubmit(itemREC);
                        ServiceContext.SubmitChanges();
                        Commit();


                        //BeginTransaction();
                        //ServiceContext.CommandTimeout = 3200;
                        //var itemRECDTL = new MPMINFRUANGANDTL();
                        //itemRECDTL.IDTHRUANGAN = IDTHRUANGAN;
                        //itemRECDTL.IDPARTICIPANT = Guid.NewGuid();
                        //itemRECDTL.NPK = item.USERNAME;
                        //itemRECDTL.CREATEDATE = DateTime.Now;
                        //itemRECDTL.CREATEBY = user;
                        //ServiceContext.MPMINFRUANGANDTLs.InsertOnSubmit(itemRECDTL);
                        //ServiceContext.SubmitChanges();
                        //Commit();

                        foreach (var participan in item.npk)
                        {
                            //{
                            BeginTransaction();
                            ServiceContext.CommandTimeout = 3200;
                            var itemRECDTL = new MPMINFRUANGANDTL();
                            itemRECDTL.IDTHRUANGAN = IDTHRUANGAN;
                            itemRECDTL.IDPARTICIPANT = Guid.NewGuid();
                            itemRECDTL.NPK = participan;
                            itemRECDTL.CREATEDATE = DateTime.Now;
                            itemRECDTL.CREATEBY = user;
                            ServiceContext.MPMINFRUANGANDTLs.InsertOnSubmit(itemRECDTL);
                            ServiceContext.SubmitChanges();
                            Commit();
                        }

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
                else
                {
                    return "F2";
                }



            }
            else
            {
                return "F";
            }

        }

        public string deleteDataScheduls(MonitoringRU_REC item)
        {
            try
            {
                ServiceContext.CommandTimeout = 1800;

                var query = $@" 
                               DELETE FROM MPMHRGA.dbo.MPMINFRUANGANDTL
                               WHERE IDTHRUANGAN =  '{item.IDTHRUANGAN}'
                            ";
                query = string.Format(query);
                ServiceContext.ExecuteQuery<MonitoringRU_REC>(query);
                ServiceContext.SubmitChanges();


                Context.CommandTimeout = 1800;
                var query2 = $@" 
                               DELETE FROM MPMHRGA.dbo.MPMINFRUANGANHDR
                               WHERE IDTHRUANGAN =  '{item.IDTHRUANGAN}'
                            ";
                query2 = string.Format(query2);
                ServiceContext.ExecuteQuery<MonitoringRU_REC>(query2);

                ServiceContext.SubmitChanges();

                return "Berhasil Hapus Data";

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
                var itemREC = ServiceContext.MPMINFRUANGANHDRs
                             .Where(x => x.IDTHRUANGAN == item.IDTHRUANGAN)
                             .FirstOrDefault();

                var itemDTL = ServiceContext.MPMINFRUANGANDTLs
                                .Where(x => x.IDTHRUANGAN == item.IDTHRUANGAN)
                                .FirstOrDefault();

                bool isExists = ServiceContext.MPMINFRUANGANHDRs.Any(x =>
                    x.IDTHRUANGAN != item.IDTHRUANGAN &&
                    x.text == item.text &&
                    (
                        (item.startDate >= x.startDate && item.startDate <= x.endDate) ||
                        (item.endDate >= x.startDate && item.endDate <= x.endDate) ||
                        (item.startDate <= x.startDate && item.endDate >= x.endDate)
                    ));

                if (isExists)
                {
                    res = "F";
                }
                else
                {
                    BeginTransaction();
                    ServiceContext.CommandTimeout = 3200;

                    itemREC.text = item.text;
                    itemREC.description = item.description;
                    itemREC.startDate = item.startDate;
                    itemREC.endDate = item.endDate;
                    itemREC.MODIFDATE = DateTime.Now;
                    itemREC.MODIFBY = user;
                    ServiceContext.SubmitChanges();
                    Commit();

                    Context.Connection.Close();
                    //ServiceContext.MPMINFRUANGANHDRs.InsertOnSubmit(itemREC);


                    if (itemDTL != null)
                    {
                        var query = $@" 
                               DELETE FROM MPMHRGA.dbo.MPMINFRUANGANDTL
                               WHERE IDTHRUANGAN =  '{item.IDTHRUANGAN}'
                            ";
                        query = string.Format(query);
                        Context.ExecuteQuery<MonitoringRU_REC>(query);

                    }

                    bool isExists2 = ServiceContext.MPMINFRUANGANHDRs
                        .Join(ServiceContext.MPMINFRUANGANDTLs,
                              hdr => hdr.IDTHRUANGAN,
                              dtl => dtl.IDTHRUANGAN,
                              (hdr, dtl) => new { hdr, dtl })
                        .Any(joined =>
                             joined.hdr.IDTHRUANGAN != item.IDTHRUANGAN &&
                             item.npk.Contains(joined.dtl.NPK) &&
                             (
                                 (item.startDate >= joined.hdr.startDate && item.startDate <= joined.hdr.endDate) ||
                                 (item.endDate >= joined.hdr.startDate && item.endDate <= joined.hdr.endDate) ||
                                 (item.startDate <= joined.hdr.startDate && item.endDate >= joined.hdr.endDate)
                             ));

                    if (!isExists2)
                    {
                        if (item.npk != null)
                        {
                            updateDataScheduls2(item, user);
                        }
                        res = "Berhasil Update Data";
                    }
                    else
                    {
                        res = "F2";
                    }
                }


                return res;

            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }

        public string updateDataScheduls2(MonitoringRU_REC item, string user)
        {
            try
            {
                foreach (var participan in item.npk)
                {
                    //{
                    BeginTransaction();
                    ServiceContext.CommandTimeout = 3200;
                    var itemRECDTL = new MPMINFRUANGANDTL();
                    itemRECDTL.IDTHRUANGAN = item.IDTHRUANGAN;
                    itemRECDTL.IDPARTICIPANT = Guid.NewGuid();
                    itemRECDTL.NPK = participan;
                    itemRECDTL.CREATEDATE = DateTime.Now;
                    itemRECDTL.CREATEBY = user;
                    itemRECDTL.MODIFDATE = DateTime.Now;
                    itemRECDTL.MODIFBY = user;
                    ServiceContext.MPMINFRUANGANDTLs.InsertOnSubmit(itemRECDTL);
                    ServiceContext.SubmitChanges();
                    Commit();
                }
                return "success";
            }
            catch (Exception e)
            {
                throw new Exception(e.Message);
            }
        }
    }
}
