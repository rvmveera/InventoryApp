namespace InventoryAPI.Models
{
    public class VendorGoodsType
    {
        public int Id { get; set; }          // Primary key
        public int vendorId { get; set; }    // FK to Vendor
        public string goodsType { get; set; }
        public string comments { get; set; }
    }

}
