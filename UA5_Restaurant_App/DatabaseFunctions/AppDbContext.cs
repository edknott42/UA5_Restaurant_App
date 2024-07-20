using Microsoft.EntityFrameworkCore;
using UA5_Restaurant_App.Models;

namespace UA5_Restaurant_App.DatabaseFunctions
{
    public class AppDbContext : DbContext
    {

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<MenuFormModel> MenuView { get; set; }
        public DbSet<BasketFormModel> BasketView { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<MenuFormModel>().HasNoKey().ToView("Menu_View");
            modelBuilder.Entity<BasketFormModel>().HasNoKey().ToView("Basket_View");

            base.OnModelCreating(modelBuilder);
        }

    }
}
