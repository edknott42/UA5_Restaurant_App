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
                    cmd.Parameters.AddWithValue("@Id", basketForm.Id);
                    cmd.Parameters.AddWithValue("@Basket_Id", basketForm.Basket_Id);
                    cmd.Parameters.AddWithValue("@Dish_Id", basketForm.Dish_Id);
                    cmd.Parameters.AddWithValue("@Price", basketForm.Price);
                    cmd.Parameters.AddWithValue("@Quantity", basketForm.Quantity);
                    cmd.Parameters.AddWithValue("@Status_Id", basketForm.Quantity);

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
                basketForm.Id = Convert.ToInt32(dtResult.Rows[0]["Id"].ToString());
                /*basketForm.Basket_Id = Guid.Parse(dtResult.Rows[0]["Basket_Id"].ToString());*/
                basketForm.Basket_Id = dtResult.Rows[0]["Basket_Id"].ToString();
            }

            return basketForm;
        }
    }
}
