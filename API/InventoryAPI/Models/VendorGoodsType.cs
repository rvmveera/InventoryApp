namespace InventoryAPI.Models
{
    public class VendorGoodsType
    {
        public int Id { get; set; }          // Primary key
        public int vendorId { get; set; }    // FK to Vendor
        public int goodsTypeId { get; set; }
        public string comments { get; set; }
    }

}
