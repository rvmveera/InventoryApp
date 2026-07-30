namespace InventoryAPI.Models.DTOs
{   
    public class EstimateRequest
    {
        public string EstimateNumber { get; set; }
        public string EstimateFor { get; set; }
        public DateTime EstimateDate { get; set; }
        public decimal EstimateTotalAmount { get; set; }
        public List<EstimateDetailDto> EstimateDetails { get; set; }
    }

    public class EstimateDetailDto
    {
        public int InventoryId { get; set; }
        public string HsnNumber { get; set; }
        public int Quantity { get; set; }
        public string Uom { get; set; }
        public decimal PricePerUnit { get; set; }
        public decimal Amount { get; set; }
    }

}
