namespace InventoryAPI.Models
{
    public class Vendor
    {
        public int VendorId { get; set; } // Primary Key
        public string VendorName { get; set; }
        public string Address1 { get; set; }
        public string Address2 { get; set; }
        public string Address3 { get; set; }
        public string ContactNo1 { get; set; }
        public string ContactNo2 { get; set; }
        public string GstNumber { get; set; }
    }
}
