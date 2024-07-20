namespace UA5_Restaurant_App.Models
{
    public class BasketFormModel
    {
        public int Id { get; set; }
        public int Basket_Id { get; set; }
        public int Dish_Id { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
    }
}
