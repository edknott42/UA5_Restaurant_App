namespace UA5_Restaurant_App.Models
{
    public class TakeawayFormModel
    {
        public int Id { get; set; }
        public string? Dish_Name { get; set; }
        public string? Dish_Description { get; set; }
        public decimal? Price { get; set; }
        public int? Dish_Type_Id { get; set; }
        public string? Dish_Type { get; set; }
        public string? Dietary_Info { get; set; }
        public string? Dietary_Titles { get; set; }
        public string? Image_Path { get; set; }
    }
}
