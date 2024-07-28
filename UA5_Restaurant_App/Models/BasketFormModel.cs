namespace UA5_Restaurant_App.Models
{
    public class BasketFormModel
    {
        public Int32 Order_id { get; set; }
        public string Order_code { get; set; }
        public string? Item_Name { get; set; }
        public int Item_Id { get; set; }
        public string? Image_Path { get; set; }
        public decimal Price { get; set; }
        public decimal Item_price { get; set; }
        public int Quantity { get; set; }
        public int Status_Id { get; set; }
    }
}
