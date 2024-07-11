using Microsoft.AspNetCore.Mvc;
using UA5_Restaurant_App.Data;

namespace UA5_Restaurant_App.Controllers
{
    public class TakeawayController : Controller
    {
        private readonly AppDbContext _context;

        public TakeawayController(AppDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            ViewData["PageClass"] = "takeaway";
            var menuItems = _context.MenuView.ToList();
            return View(menuItems);
        }

        [HttpPost]
        public IActionResult SaveTakeaway()
        {
            var response = new { success = true };
            return Ok(response);
        }

    }
}
