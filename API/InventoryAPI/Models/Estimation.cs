namespace InventoryAPI.Models
{
    
    public class tblEstimateHeader
    {
        public int Id { get; set; }
        public string EstimateNumber { get; set; }
        public string EstimateFor { get; set; }
        public DateTime EstimateDate { get; set; }
        public decimal EstimateTotalAmount { get; set; }

        public ICollection<tblEstimateDetails> EstimateDetails { get; set; }
    }

    public class tblEstimateDetails
    {
        public int Id { get; set; }
        public string EstimateNumber { get; set; }
        public int InventoryId { get; set; }
        public string HsnNumber { get; set; }
        public int Quantity { get; set; }
        public string Uom { get; set; }
        public decimal PricePerUnit { get; set; }
        public decimal Amount { get; set; }

        public int estimateHeaderId { get; set; }
        public tblEstimateHeader EstimateHeader { get; set; }
    }


}
