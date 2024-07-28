using Microsoft.Data.SqlClient;
using System.Data;
using UA5_Restaurant_App.Models;

namespace UA5_Restaurant_App.DatabaseFunctions
{
    public class Checkouts
    {
        public static CheckoutFormModel SaveCheckout(CheckoutFormModel checkoutForm)
        {
            string connectionString = "data source=DESKTOP-L247V0Q;initial catalog=MockItalianRoom;user id=Zola;password=g3rm1n4l;TrustServerCertificate=True";

            DataTable dtResult = new DataTable();

            using (SqlConnection dbconn = new SqlConnection(connectionString))
            {
                using (SqlCommand cmd = dbconn.CreateCommand())
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = "sp_Checkout";
                    cmd.Parameters.AddWithValue("@Order_id", checkoutForm.Order_id);
                    cmd.Parameters.AddWithValue("@Order_code", checkoutForm.Order_code);
                    cmd.Parameters.AddWithValue("@First_name", checkoutForm.First_name);
                    cmd.Parameters.AddWithValue("@Last_name", checkoutForm.Last_name);
                    cmd.Parameters.AddWithValue("@Email_address", checkoutForm.Email_address);
                    cmd.Parameters.AddWithValue("@Address_line_1", checkoutForm.Address_Line_1);
                    cmd.Parameters.AddWithValue("@Address_line_2", checkoutForm.Address_Line_2);
                    cmd.Parameters.AddWithValue("@Postal_town", checkoutForm.Postal_town);
                    cmd.Parameters.AddWithValue("@County", checkoutForm.County);
                    cmd.Parameters.AddWithValue("@Postal_code", checkoutForm.Postal_code);
                    cmd.Parameters.AddWithValue("@Total_price", checkoutForm.Total_price);


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
                checkoutForm.Order_id = Convert.ToInt32(dtResult.Rows[0]["Order_id"].ToString());
            }

            return checkoutForm;
        }
    }
}
