using Microsoft.AspNetCore.Mvc;

namespace UA5_Restaurant_App.Controllers
{
    public class TakeawayController : Controller
    {
        public IActionResult Index()
        {
            ViewData["PageClass"] = "takeaway";
            return View();
        }

        [HttpPost]
        public IActionResult SaveDelivery()
        {
            var response = new { success = true };
            return Ok(response);
        }

    }
}
