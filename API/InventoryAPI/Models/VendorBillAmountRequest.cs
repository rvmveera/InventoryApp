namespace InventoryAPI.Models
{
    public class VendorBillAmountRequest
    {
        public int VendorId { get; set; }
    }

    public class VendorPaymentRequest
    {

        public int VendorPaymentId { get; set; }
        public decimal PaymentAmount { get; set; }
        public DateTime PaymentDate { get; set; }

    }
}
