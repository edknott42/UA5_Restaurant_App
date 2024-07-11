using Microsoft.EntityFrameworkCore;
using UA5_Restaurant_App.Models;

namespace UA5_Restaurant_App.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<MenuFormModel> MenuView { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<MenuFormModel>().HasNoKey().ToView("Menu_View");
            base.OnModelCreating(modelBuilder);
        }
    }
}
