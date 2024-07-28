namespace UA5_Restaurant_App.Models
{
    public class MenuFormModel
    {
        public int Item_Id { get; set; }
        public string? Item_Name { get; set; }
        public string? Item_Description { get; set; }
        public decimal? Item_Price { get; set; }
        public int? Item_Type_Id { get; set; }
        public string? Item_Type { get; set; }
        public string? Dietary_Id { get; set; }
        public string? Dietary_Titles { get; set; }
        public string? Image_Path { get; set; }
    }
}

