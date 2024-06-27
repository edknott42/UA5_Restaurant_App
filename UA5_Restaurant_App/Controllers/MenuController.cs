using Microsoft.AspNetCore.Mvc;

namespace UA5_Restaurant_App.Controllers
{
    public class MenuController : Controller
    {
        public IActionResult Index()
        {
            ViewData["PageClass"] = "menu";
            return View();
        }
    }
}
