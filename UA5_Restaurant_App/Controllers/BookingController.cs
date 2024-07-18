using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using UA5_Restaurant_App.DatabaseFunctions;
using UA5_Restaurant_App.Models;

namespace UA5_Restaurant_App.Controllers
{
    public class BookingController : Controller
    {
        public IActionResult Index()
        {
            ViewData["PageClass"] = "booking";
            return View();
        }

        [HttpPost]
        public IActionResult SaveBooking(BookingFormModel bookingForm)
        {
            try
            {
                bookingForm = Bookings.SaveBooking(bookingForm);

                var response = new { success = true, bookingForm.Id };
                return Ok(response);
            }
            catch (SqlException ex) // Catch SQL-related exceptions
            {
                return StatusCode(500, $"Database error: {ex.Message}");
            }
        }

    }
}
