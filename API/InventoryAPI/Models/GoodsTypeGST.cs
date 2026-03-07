namespace InventoryAPI.Models
{
    public class GoodsTypeGST
    {
        public int Id { get; set; } // Auto-increment PK
        public string GoodsType { get; set; }
        public decimal GSTpercent { get; set; }
       
    }
}
