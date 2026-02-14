using InventoryAPI.Models;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;

namespace InventoryAPI.Data
{   
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        public DbSet<User> Users => Set<User>();
        public DbSet<Vendor> Vendors { get; set; }

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

            b.Entity<Vendor>().ToTable("tblVendorMaster"); // DB table name
            b.Entity<Vendor>().Property(v => v.VendorName).HasColumnName("vendorname");
            b.Entity<Vendor>().Property(v => v.Address1).HasColumnName("address1");
            b.Entity<Vendor>().Property(v => v.Address2).HasColumnName("address2");
            b.Entity<Vendor>().Property(v => v.Address3).HasColumnName("address3");
            b.Entity<Vendor>().Property(v => v.ContactNo1).HasColumnName("contactno1");
            b.Entity<Vendor>().Property(v => v.ContactNo2).HasColumnName("contactno2");
            b.Entity<Vendor>().Property(v => v.GstNumber).HasColumnName("gstnumber");
        

    }
}
}