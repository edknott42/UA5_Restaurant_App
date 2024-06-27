using Microsoft.AspNetCore.Mvc;

namespace UA5_Restaurant_App.Models
{
    public class TakeawayFormModel : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
