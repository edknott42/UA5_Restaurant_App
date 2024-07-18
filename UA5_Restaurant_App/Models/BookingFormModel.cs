namespace UA5_Restaurant_App.Models
{
    public class BookingFormModel
    {

        public Int32 Id { get; set; }
        public required string First_name { get; set; }
        public required string Last_name { get; set; }
        public required string Email_address { get; set; }
        public string? Phone_number { get; set; }
        public DateOnly Booking_date { get; set; }
        public TimeOnly Booking_time { get; set; }
        public Int32 Table_size { get; set; }
        public string? Special_requests { get; set; }
        public string? Dietary_title { get; set; }
    }
}
