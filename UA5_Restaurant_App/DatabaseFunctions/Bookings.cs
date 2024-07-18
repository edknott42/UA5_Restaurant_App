using Microsoft.Data.SqlClient;
using System.Data;
using UA5_Restaurant_App.Models;

namespace UA5_Restaurant_App.DatabaseFunctions
{
    public static class Bookings
    {
        /*public static int SaveBooking(BookingFormModel booking)
        {
            string connectionString = "data source=DESKTOP-L247V0Q;initial catalog=MockItalianRoom;user id=Zola;password=g3rm1n4l;TrustServerCertificate=True";
            int bookingId = 0;

            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    connection.Open();

                    SqlCommand command = new SqlCommand("sp_Bookings", connection);
                    command.CommandType = CommandType.StoredProcedure;

                    *//* // Add parameters
                     if (booking.Id != 0)
                     {*//*
                    command.Parameters.AddWithValue("@Id", booking.Id);
                    *//*}*//*
                    command.Parameters.AddWithValue("@First_name", booking.First_name);
                    command.Parameters.AddWithValue("@Last_name", booking.Last_name);
                    command.Parameters.AddWithValue("@Email_address", booking.Email_address);
                    command.Parameters.AddWithValue("@Phone_number", booking.Phone_number ?? "");
                    command.Parameters.AddWithValue("@Booking_date", booking.Booking_date);
                    command.Parameters.AddWithValue("@Booking_time", booking.Booking_time);
                    command.Parameters.AddWithValue("@Table_size", booking.Table_size);
                    command.Parameters.AddWithValue("@Special_requests", booking.Special_requests ?? "");
                    command.Parameters.AddWithValue("@Dietary_title", booking.Dietary_title);

                    *//*// Output parameter
                    SqlParameter outputParameter = new SqlParameter();
                    outputParameter.ParameterName = "@Id";
                    outputParameter.SqlDbType = SqlDbType.Int;
                    outputParameter.Direction = ParameterDirection.Output;
                    command.Parameters.Add(outputParameter);

                    // Execute command
                    command.ExecuteNonQuery();

                    // Retrieve the generated @Id
                    bookingId = Convert.ToInt32(outputParameter.Value);*//*
                }
            }
            catch (Exception ex)
            {
                // Handle exception (log, rethrow, etc.)
                throw new Exception("Error saving booking: " + ex.Message);
            }

            *//*// Check for DBNull.Value
            if (bookingId == 0)
            {
                throw new Exception("Failed to retrieve booking Id from database.");
            }*//*

            return bookingId;
        }*/

        public static BookingFormModel SaveBooking(BookingFormModel bookingFormModel)
        {
            string connectionString = "data source=DESKTOP-L247V0Q;initial catalog=MockItalianRoom;user id=Zola;password=g3rm1n4l;TrustServerCertificate=True";

            DataTable dtResult = new DataTable();

            using (SqlConnection dbconn = new SqlConnection(connectionString))
            {
                using (SqlCommand cmd = dbconn.CreateCommand())
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = "sp_Bookings";
                    cmd.Parameters.AddWithValue("@Id", bookingFormModel.Id);
                    cmd.Parameters.AddWithValue("@First_name", bookingFormModel.First_name);
                    cmd.Parameters.AddWithValue("@Last_name", bookingFormModel.Last_name);
                    cmd.Parameters.AddWithValue("@Email_address", bookingFormModel.Email_address);
                    cmd.Parameters.AddWithValue("@Phone_number", bookingFormModel.Phone_number);
                    cmd.Parameters.AddWithValue("@Booking_date", bookingFormModel.Booking_date);
                    cmd.Parameters.AddWithValue("@Booking_time", bookingFormModel.Booking_time);
                    cmd.Parameters.AddWithValue("@Table_size", bookingFormModel.Table_size);
                    cmd.Parameters.AddWithValue("@Special_requests", bookingFormModel.Special_requests);
                    cmd.Parameters.AddWithValue("@Dietary_title", bookingFormModel.Dietary_title);



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
                bookingFormModel.Id = Convert.ToInt32(dtResult.Rows[0]["Id"].ToString());
            }

            return bookingFormModel;
        }
    }


}
