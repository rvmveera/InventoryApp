

using Microsoft.EntityFrameworkCore;
using InventoryAPI.Models;

namespace InventoryAPI.Data
{
    public class InventoryContext : DbContext
    {
        public InventoryContext(DbContextOptions<InventoryContext> options) : base(options) { }

        public DbSet<InventoryMaster> tblInventoryMaster { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<InventoryMaster>().ToTable("tblInventoryMaster");
            modelBuilder.Entity<InventoryMaster>().HasKey(i => i.InvId);

            modelBuilder.Entity<InventoryMaster>().Property(i => i.InvId).IsRequired().HasMaxLength(50);
            modelBuilder.Entity<InventoryMaster>().Property(i => i.InvName).HasMaxLength(50);
            modelBuilder.Entity<InventoryMaster>().Property(i => i.Status).HasMaxLength(10);
            modelBuilder.Entity<InventoryMaster>().Property(i => i.CreatedBy).HasMaxLength(50);
        }
    }
}