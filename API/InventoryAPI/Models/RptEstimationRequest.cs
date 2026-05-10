namespace InventoryAPI.Models
{
    public class EstimationReportRequest
    {
        public string EstimateFor { get; set; }
        public DateTime EstimateDate { get; set; }
        public List<EstimateDetail> EstimateDetails { get; set; }
        //public BankDetails BankDetails { get; set; }
        public string BankName { get; set; }
        public string BankAccountNo { get; set; }
        public string BankIfscCode { get; set; }
        public string BankAccountHolderName { get; set; }
        public string GSTNumber { get; set; }
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
