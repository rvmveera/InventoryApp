namespace InventoryAPI.Models.DTOs
{
    public class InvoiceDto
    {
        public string BuyerName { get; set; }
        public string BuyerAddress { get; set; }
        public string InvoiceNumber { get; set; }
        public DateTime InvoiceDate { get; set; }
        public int ConsigneeId { get; set; }
        public decimal InvoiceTotal { get; set; }
        public List<InvoiceDetailDto> Details { get; set; }
    }
    public class InvoiceDetailDto
    {
        public int InventoryId { get; set; }
        public string HsnNumber { get; set; }
        public int Quantity { get; set; }
        public string Unit { get; set; }
        public decimal PricePerUnit { get; set; }
        public decimal Gst { get; set; }
        public decimal Discount { get; set; }
        public decimal NetAmount { get; set; }
    }

    
}