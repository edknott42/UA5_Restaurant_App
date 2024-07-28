using Microsoft.Data.SqlClient;
using System.Data;
using UA5_Restaurant_App.Models;

namespace UA5_Restaurant_App.DatabaseFunctions
{
    public class Basket
    {
        public static BasketFormModel SaveBasket(BasketFormModel basketForm)
        {
            string connectionString = "data source=DESKTOP-L247V0Q;initial catalog=MockItalianRoom;user id=Zola;password=g3rm1n4l;TrustServerCertificate=True";

            DataTable dtResult = new DataTable();

            using (SqlConnection dbconn = new SqlConnection(connectionString))
            {
                using (SqlCommand cmd = dbconn.CreateCommand())
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = "sp_Basket";
                    cmd.Parameters.AddWithValue("@Order_id", basketForm.Order_id);
                    cmd.Parameters.AddWithValue("@Order_code", basketForm.Order_code);
                    cmd.Parameters.AddWithValue("@Item_Id", basketForm.Item_Id);
                    cmd.Parameters.AddWithValue("@Price", basketForm.Price);
                    cmd.Parameters.AddWithValue("@Quantity", basketForm.Quantity);
                    cmd.Parameters.AddWithValue("@Status_Id", basketForm.Status_Id);

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
                basketForm.Order_id = Convert.ToInt32(dtResult.Rows[0]["Order_id"].ToString());
                basketForm.Order_code = dtResult.Rows[0]["Order_code"].ToString();
            }

            return basketForm;
        }
    }
}
