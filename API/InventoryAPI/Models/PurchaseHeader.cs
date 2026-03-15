namespace InventoryAPI.Models
{
    public class PurchaseHeader
    {
        public int Id { get; set; }
        public int VendorId { get; set; }
        public int ConsigneeId { get; set; }
        public string BuyerName { get; set; }
        public string BuyerAddress { get; set; }
        public string BuyerGST { get; set; }
        public string BuyerEmail { get; set; }
        public string BuyerState { get; set; }
        public string BuyerCode { get; set; }
        public string BuyerPlaceofsupply { get; set; }
        public string BuyerContactName { get; set; }
        public string BuyerMobileNo { get; set; }
        public string InvoiceNo { get; set; }
        public string EwayBillNo { get; set; }
        public DateTime InvoiceDate { get; set; }
        public string DeliveryNote { get; set; }
        public string TermsOfPayment { get; set; }
        public string SupplierRef { get; set; }
        public string OtherReference { get; set; }
        public string BuyerOrderNo { get; set; }
        public DateTime? BuyerOrderDate { get; set; }
        public string DespatchDocNo { get; set; }
        public DateTime? DeliveryNoteDate { get; set; }
        public string DespatchedThrough { get; set; }
        public string Destination { get; set; }
        public string BillOfLadingNo { get; set; }
        public string VehicleNo { get; set; }
        public string TermsOfDelivery { get; set; }       

        public decimal totalBillAmount { get; set; }
        public ICollection<PurchaseDetail> PurchaseDetails { get; set; }
    }

    public class PurchaseDetail
    {
        public int Id { get; set; }
        public int PurchaseHeaderId { get; set; }
        public string Goods_ServiceDesc { get; set; }
        public string HsnSac { get; set; }
        public int Quantity { get; set; }
        public decimal Rate { get; set; }
        public string UomPer { get; set; }
        public decimal DiscountPercent { get; set; }
        public decimal Amount { get; set; }
        public decimal Gst { get; set; }
        public decimal Total { get; set; }
        public PurchaseHeader? PurchaseHeader { get; set; }

    }
}
