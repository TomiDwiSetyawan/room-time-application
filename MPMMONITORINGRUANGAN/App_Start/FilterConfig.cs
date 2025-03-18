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
            filters.Add(new MPMActionFilterAttribute());
            filters.Add(new MPMAuthorizeAttribute("mpmmonitoringruangan")); //jangan lupa diganti
        }
    }
}
