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

        public string state { get; set; }
        public string code { get; set; }
        public string acNo { get; set; }
        public string bank { get; set; }
        public string ifscCode { get; set; }
        public string acName { get; set; }
        public string branchName { get; set; }  
        public string companyPAN { get; set; }
        public string upi_gpayNo { get; set; }
        public string comments { get; set; }
        public int activeStatus { get; set; }
    }
}
