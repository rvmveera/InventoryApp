namespace InventoryAPI.Models
{
    public class VendorPayments
    {
        public int Id { get; set; }
        public int VendorId { get; set; }
        public decimal BillAmount { get; set; }
        public decimal OutstandingAmount { get; set; }
        public int PurchaseId { get; set; }
        public string CreatedBy { get; set; }

        // Navigation property for related payment history records
        public ICollection<VendorPaymentHistory>? PaymentHistories { get; set; }
    }

    public class VendorPaymentHistory
    {
        public int Id { get; set; }
        public int VendorPaymentId { get; set; }
        public decimal PaymentAmount { get; set; }
        public DateTime PaymentDate { get; set; }
        public string CreatedBy { get; set; }
        public string? Comments { get; set; }
    }

    public class PaymentHistoryRequest
    {
        public int VendorPaymentId { get; set; }
    }

    public class PurchaseDetailsRequest
    {
        public int purchaseId { get; set; }
    }
}
