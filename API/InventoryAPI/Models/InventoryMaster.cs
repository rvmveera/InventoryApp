using Microsoft.EntityFrameworkCore;

namespace InventoryAPI.Models
{
    public class InventoryMaster
    {
        public int id { get; set; }          // nvarchar(50) NOT NULL
        public string? goods_serviceDesc { get; set; }        // nvarchar(50) NULL
        public string? Status { get; set; }         // nchar(10) NULL
        public int goodsTypeId { get; set; }       // int NOT NULL
        public int? availableQty { get; set; }   // int NULL
        public string? comments { get; set; }
        public string? CreatedBy { get; set; }      // nvarchar(50) NULL
        public string? hsnSac { get; set; }
     
    }
    public class MyDbContext : DbContext
    {
        public MyDbContext(DbContextOptions<MyDbContext> options) : base(options) { }

        public DbSet<InventoryMaster> tblInventoryMaster { get; set; }
        public DbSet<GoodsTypeGST> tblGoodsTypeGST { get; set; }
        public DbSet<tblInventoryPrice> tblInventoryPrice { get; set; }
    }
    public class tblInventoryPrice
    {
        public int Id { get; set; }
        public int inventoryId { get; set; }
        public decimal price { get; set; }
    }

}
