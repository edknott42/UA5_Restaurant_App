namespace UA5_Restaurant_App.DatabaseFunctions
{
    public class Takeaways
    {
        /*public static string GetConnectionString()
        {
            string returnValue = null;
            ConnectionStringSettings settings = ConfigurationManager.ConnectionStrings[""];

            //If found, return the connection string.
            if (settings != null)
                returnValue = settings.ConnectionString;

            return returnValue;
        }*/

        /*public static TakeawayFormModel saveTakeaways(TakeawayFormModel takeawayFormModel)
        {

            DataTable dtResult = new DataTable();

            using (SqlConnection dbconn = DatabaseConn.GetDBConnection())
            {
                using (SqlCommand cmd = dbconn.CreateCommand())
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = "sp_Candidates_Update";
                    cmd.Parameters.AddWithValue("@Id", candidateFormModel.Id);
                    cmd.Parameters.AddWithValue("@First_Name", candidateFormModel.First_name);
                    cmd.Parameters.AddWithValue("@Last_Name", candidateFormModel.Last_name);
                    cmd.Parameters.AddWithValue("@Employer", candidateFormModel.Employer);
                    cmd.Parameters.AddWithValue("@Cabwi_number", candidateFormModel.Cabwi_number);
                    cmd.Parameters.AddWithValue("@Date_of_birth", candidateFormModel.Date_of_birth);

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
                candidateFormModel.Id = Convert.ToInt32(dtResult.Rows[0]["Id"].ToString());
            }

            return candidateFormModel;
        }*/

    }
}
