using Microsoft.EntityFrameworkCore;
using UA5_Restaurant_App.Models;

namespace UA5_Restaurant_App.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<MenuFormModel> MenuFormModel { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<MenuFormModel>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired();
                entity.Property(e => e.Description).IsRequired();
                entity.Property(e => e.Price).IsRequired();
                entity.Property(e => e.DietaryTitle).IsRequired();
                entity.Property(e => e.MenuType).IsRequired();
            });
        }
    }
}
