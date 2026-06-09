namespace InventoryAPI.Models
{
    public class InvoiceHeader
    {
        public int Id { get; set; }
        public string BuyerName { get; set; }
        public string BuyerAddress { get; set; }
        public string InvoiceNumber { get; set; }
        public DateTime InvoiceDate { get; set; }
        public int ConsigneeId { get; set; }
        public decimal InvoiceTotal { get; set; }

        public ICollection<InvoiceDetail> InvoiceDetails { get; set; }
    }

    public class InvoiceDetail
    {
        public int Id { get; set; }
        public int InvoiceHeaderId { get; set; }
        public int InventoryId { get; set; }
        public string HsnNumber { get; set; }
        public decimal Quantity { get; set; }
        public string Unit { get; set; }
        public decimal PricePerUnit { get; set; }
        public decimal Gst { get; set; }
        public decimal Discount { get; set; }
        public decimal NetAmount { get; set; }
        public decimal cgstPercent { get; set; }
        public decimal sgstPercent { get; set; }
        public string InvoiceNumber { get; set; }
        public decimal taxAmount { get; set; }
        public InvoiceHeader InvoiceHeader { get; set; }
    }
}
