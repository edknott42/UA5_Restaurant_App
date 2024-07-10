using Microsoft.AspNetCore.Mvc;

namespace UA5_Restaurant_App.Controllers
{
    public class DietaryController : Controller
    {
        public IActionResult Index()
        {
            ViewData["PageClass"] = "dietary";
            return View();
        }

        [HttpPost]
        public IActionResult SaveDietary()
        {
            var response = new { success = true };
            return Ok(response);
        }
    }
}
