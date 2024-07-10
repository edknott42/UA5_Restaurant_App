using Microsoft.AspNetCore.Mvc;
using UA5_Restaurant_App.Data;

namespace UA5_Restaurant_App.Controllers
{

    public class MenuController : Controller
    {
        private readonly AppDbContext _context;

        public MenuController(AppDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            ViewData["PageClass"] = "menu";
            var menuItems = _context.MenuFormModel.ToList();
            return View(menuItems);
        }
    }
}
