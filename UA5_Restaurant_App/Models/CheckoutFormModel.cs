namespace UA5_Restaurant_App.Models
{
    public class CheckoutFormModel
    {
        public List<BasketFormModel> BasketFormModel { get; set; }
        public Int32 Order_id { get; set; }
        public string Order_code { get; set; }
        public string? First_name { get; set; }
        public string? Last_name { get; set; }
        public string? Email_address { get; set; }
        public string? Address_Line_1 { get; set; }
        public string? Address_Line_2 { get; set; }
        public string? Postal_town { get; set; }
        public string? County { get; set; }
        public string? Postal_code { get; set; }

        public Decimal Total_price { get; set; }

    }
}
