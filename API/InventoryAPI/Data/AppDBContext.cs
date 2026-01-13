using InventoryAPI.Models;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;

namespace InventoryAPI.Data
{   
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        public DbSet<User> Users => Set<User>();

        protected override void OnModelCreating(ModelBuilder b)
        {

            b.Entity<User>().ToTable("tblUserRegistration");


            b.Entity<User>(e =>
            {
                e.HasIndex(x => x.Username).IsUnique();
                e.Property(x => x.PasswordHash).IsRequired().HasMaxLength(255);
                e.Property(x => x.AadhaarEncrypted).HasMaxLength(1024);
                //e.Property(x => x.ResumePath).HasMaxLength(512);
            });
        }
    }
}