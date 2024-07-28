using Microsoft.Data.SqlClient;
using System.Data;
using UA5_Restaurant_App.Models;

namespace UA5_Restaurant_App.DatabaseFunctions
{
    public static class Bookings
    {

        public static BookingFormModel SaveBooking(BookingFormModel bookingForm)
        {
            string connectionString = "data source=DESKTOP-L247V0Q;initial catalog=MockItalianRoom;user id=Zola;password=g3rm1n4l;TrustServerCertificate=True";

            DataTable dtResult = new DataTable();

            using (SqlConnection dbconn = new SqlConnection(connectionString))
            {
                using (SqlCommand cmd = dbconn.CreateCommand())
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = "sp_Bookings";
                    cmd.Parameters.AddWithValue("@Id", bookingForm.Id);
                    cmd.Parameters.AddWithValue("@First_name", bookingForm.First_name);
                    cmd.Parameters.AddWithValue("@Last_name", bookingForm.Last_name);
                    cmd.Parameters.AddWithValue("@Email_address", bookingForm.Email_address);
                    cmd.Parameters.AddWithValue("@Phone_number", bookingForm.Phone_number);
                    cmd.Parameters.AddWithValue("@Booking_date", bookingForm.Booking_date);
                    cmd.Parameters.AddWithValue("@Booking_time", bookingForm.Booking_time);
                    cmd.Parameters.AddWithValue("@Table_size", bookingForm.Table_size);
                    cmd.Parameters.AddWithValue("@Dietary_id", bookingForm.Dietary_id);



                    using (SqlDataAdapter daData = new SqlDataAdapter())
                    {
                        daData.SelectCommand = cmd;
                        dbconn.Open();
                        daData.Fill(dtResult);
                    }

                }

            }

            if (dtResult.Rows.Count > 0)
            {
                bookingForm.Id = Convert.ToInt32(dtResult.Rows[0]["Id"].ToString());
            }

            return bookingForm;
        }
    }


}
