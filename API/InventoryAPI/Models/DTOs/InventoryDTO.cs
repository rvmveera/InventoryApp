namespace InventoryAPI.Models.DTOs
{
    public class InventoryDto
    {
        public int GoodsTypeId { get; set; }
        public string GoodsType { get; set; }
        public int InventoryId { get; set; }
        public string Goods_ServiceDesc { get; set; }
        public int AvailableQty { get; set; }
        public decimal GSTPercent { get; set; }
    }
}
