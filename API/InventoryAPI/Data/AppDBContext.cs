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
        public DbSet<VendorGoodsType> VendorGoodsTypes { get; set; }
        public DbSet<PurchaseHeader> PurchaseHeaders { get; set; }
        public DbSet<PurchaseDetail> PurchaseDetails { get; set; }
        public DbSet<GoodsTypeGST> GoodsTypeGSTs { get; set; }

        // New DbSets for your vendor payment entities
        public DbSet<VendorPayments> VendorPayments { get; set; }
        public DbSet<VendorPaymentHistory> VendorPaymentHistories { get; set; }


        // DB Sets for Sales entities

        public DbSet<InvoiceHeader> InvoiceHeaders { get; set; }
        public DbSet<InvoiceDetail> InvoiceDetails { get; set; }
        
        public DbSet<InventoryMaster> InventoryMaster { get; set; }
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

            b.Entity<Vendor>().Property(v => v.state).HasColumnName("state");
            b.Entity<Vendor>().Property(v => v.code).HasColumnName("code");
            b.Entity<Vendor>().Property(v => v.acNo).HasColumnName("acNo");
            b.Entity<Vendor>().Property(v => v.bank).HasColumnName("bank");
            b.Entity<Vendor>().Property(v => v.ifscCode).HasColumnName("ifscCode");
            b.Entity<Vendor>().Property(v => v.acName).HasColumnName("acName");
            b.Entity<Vendor>().Property(v => v.branchName).HasColumnName("branchName");
            b.Entity<Vendor>().Property(v => v.companyPAN).HasColumnName("companyPAN");
            b.Entity<Vendor>().Property(v => v.upi_gpayNo).HasColumnName("upi_gpayNo");
            b.Entity<Vendor>().Property(v => v.comments).HasColumnName("comments");


            b.Entity<VendorGoodsType>().ToTable("tblVendorGoodsType");

            // Purchase
            b.Entity<PurchaseHeader>()
       .ToTable("tblPurchaseHeader");

            b.Entity<PurchaseDetail>()
                .ToTable("tblPurchaseDetails");

            b.Entity<PurchaseDetail>()
                .HasOne(d => d.PurchaseHeader)
                .WithMany(h => h.PurchaseDetails)
                .HasForeignKey(d => d.PurchaseHeaderId);

            // Tell EF Core that tblPurchaseDetails has triggers
            b.Entity<PurchaseDetail>()
                .ToTable("tblPurchaseDetails", tb => tb.HasTrigger("trg_AfterInsert_PurchaseDetails"));


            // Invoice

            b.Entity<InvoiceHeader>()
       .ToTable("tblInvoiceHeader");

            b.Entity<InvoiceDetail>()
                .ToTable("tblInvoiceDetail");

            b.Entity<InvoiceDetail>()
                .HasOne(d => d.InvoiceHeader)
                .WithMany(h => h.InvoiceDetails)
                .HasForeignKey(d => d.InvoiceHeaderId);

            b.Entity<GoodsTypeGST>().ToTable("tblGoodsTypeGST");


            // New mappings
            b.Entity<VendorPayments>().ToTable("tblVendorPayments");
            b.Entity<VendorPaymentHistory>().ToTable("tblVendorPaymentHistory");


            b.Entity<VendorPayments>()
           .HasMany(v => v.PaymentHistories)
           .WithOne() // no navigation back in your class, but you can add if needed
           .HasForeignKey(h => h.VendorPaymentId);


            b.Entity<InventoryMaster>().ToTable("tblInventoryMaster");
            b.Entity<InventoryMaster>().HasKey(i => i.id);
            
            b.Entity<InventoryMaster>().Property(i => i.goods_serviceDesc);
            b.Entity<InventoryMaster>().Property(i => i.Status).HasMaxLength(10);
        }
    }
}