using Microsoft.AspNetCore.Mvc;
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
            /*var menuItems = _context.MenuView.ToList();
            return View(menuItems);*/

            var model = new TakeawayFormModel
            {
                BasketFormModel = _context.BasketView.ToList(),
                MenuFormModel = _context.MenuView.ToList()
            };

            return View(model);
        }

        [HttpPost]
        public IActionResult SaveBasket(BasketFormModel basketForm)
        {
            try
            {
                basketForm = Basket.SaveBasket(basketForm);

                var response = new { success = true, basketForm.Item_Id, basketForm.Order_code };
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

            var model = new CheckoutFormModel
            {
                BasketFormModel = _context.BasketView.ToList(),
            };

            return View(model);
        }

        [HttpPost]
        public /*async Task<*/IActionResult/*>*/ SaveCheckout(CheckoutFormModel checkoutForm)
        {
            try
            {
                checkoutForm = Checkouts.SaveCheckout(checkoutForm);

                /*string toEmail = $"{checkoutForm.Email_address}";
                string subject = "Checkout Confirmation";
                string body = $"Thank you for your purchase, {checkoutForm.First_name} {checkoutForm.Last_name} ! Your order has been received.";

                await EmailHelper.SendEmailAsync(toEmail, subject, body);*/

                var response = new { success = true, checkoutForm.Order_id, checkoutForm.Order_code };
                return Ok(response);
            }
            catch (SqlException ex) // Catch SQL-related exceptions
            {
                return StatusCode(500, $"Database error: {ex.Message}");
            }

        }

        public IActionResult Confirmation()
        {
            ViewData["PageClass"] = "confirmation";
            return View();
        }

        /*public static class EmailHelper
        {
            public static async Task SendEmailAsync(string toEmail, string subject, string body)
            {
                var fromEmail = "edknott04@gmail.com";
                var fromPassword = "";

                using (var client = new SmtpClient("smtp.gmail.com", 587))
                {
                    client.Credentials = new NetworkCredential(fromEmail, fromPassword);
                    client.EnableSsl = true;

                    var mailMessage = new MailMessage
                    {
                        From = new MailAddress(fromEmail),
                        Subject = subject,
                        Body = body,
                        IsBodyHtml = true,
                    };
                    mailMessage.To.Add(toEmail);

                    await client.SendMailAsync(mailMessage);
                }
            }
        }*/

    }
}
