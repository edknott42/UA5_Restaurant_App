﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using UA5_Restaurant_App.DatabaseFunctions;
using UA5_Restaurant_App.Models;

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
        public IActionResult SaveBasket(BasketFormModel basketForm)
        {
            try
            {
                basketForm = Basket.SaveBasket(basketForm);

                var response = new { success = true, basketForm.Id };
                return Ok(response);
            }
            catch (SqlException ex) // Catch SQL-related exceptions
            {
                return StatusCode(500, $"Database error: {ex.Message}");
            }
        }

        public IActionResult Checkout()
        {
            ViewData["PageClass"] = "checkout";

            var basketForm = _context.BasketView.ToList();
            return View(basketForm);
        }

        [HttpPost]
        public IActionResult SaveCheckout(BasketFormModel checkoutForm)
        {
            try
            {
                /*checkoutForm = Menu.SaveBasket(checkoutForm);*/
                return RedirectToAction("Confirmation");
            }
            catch (SqlException ex) // Catch SQL-related exceptions
            {
                return StatusCode(500, $"Database error: {ex.Message}");
            }

        }

        public IActionResult Confirmation()
        {
            return View();
        }

    }
}
