using Microsoft.AspNetCore.Mvc;

namespace UA5_Restaurant_App.Controllers
{
    public class BookingController : Controller
    {
        public IActionResult Index()
        {
            ViewData["PageClass"] = "booking";
            return View();
        }
    }
}
