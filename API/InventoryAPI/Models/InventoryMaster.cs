namespace InventoryAPI.Models
{
    public class InventoryMaster
    {
        public string InvId { get; set; }          // nvarchar(50) NOT NULL
        public string InvName { get; set; }        // nvarchar(50) NULL
        public string Status { get; set; }         // nchar(10) NULL
        public int? AvailableStock { get; set; }   // int NULL
        public string CreatedBy { get; set; }      // nvarchar(50) NULL
        public DateTime? CreatedDate { get; set; } // datetime NULL

    }
}
