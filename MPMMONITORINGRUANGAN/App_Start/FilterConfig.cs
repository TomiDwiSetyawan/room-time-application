using MPMSecurityFilter.Mvc.Filters;
using System.Web;
using System.Web.Mvc;

namespace MPMMONITORINGRUANGAN
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
            filters.Add(new MPMDevAuthorizeAttribute("mpmwisspg"));
            filters.Add(new MPMActionFilterAttribute());
        }
    }
}
