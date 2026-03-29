

using Microsoft.EntityFrameworkCore;
using InventoryAPI.Models;

namespace InventoryAPI.Data
{
    public class InventoryContext : DbContext
    {
        

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
          
           // modelBuilder.Entity<InventoryMaster>().Property(i => i.CreatedBy).HasMaxLength(50);
        }
    }
}