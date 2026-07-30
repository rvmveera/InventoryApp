namespace InventoryAPI.Models
{
    public class EstimationReportRequest
    {
        public string EstimateNumber { get; set; }
    }

    public class EstimateDetail
    {
        public int Sno { get; set; }
        public string ProductName { get; set; }
        public string Hsn { get; set; }
        public int Quantity { get; set; }
        public string Unit { get; set; }
        public decimal PriceUnit { get; set; }
        public decimal Amount { get; set; }
    }

    public class BankDetails
    {
        public string Name { get; set; }
        public string AccountNo { get; set; }
        public string IfscCode { get; set; }
        public string AccountHolderName { get; set; }
        public string GST { get; set; }
    }

}
