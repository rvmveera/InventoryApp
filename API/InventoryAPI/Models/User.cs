
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace InventoryAPI.Models
{
   
    
    public class User
    {
        [Key]
        [Column("UID")]
        public int Id { get; set; }
        public string FirstName { get; set; } = default!;
        public string LastName { get; set; } = default!;
        public string EmailId { get; set; } = default!;
        public int PhoneNumber { get; set; } = default!;
        public string Username { get; set; } = default!;
        public string PasswordHash { get; set; } = default!;
        public string Address1 { get; set; } = default!;
        public string Address2 { get; set; } = default!;
        public string Address3 { get; set; } = default!;
        public int UserTypeId { get; set; }

        [Column("AadhaarNo")]
        public string? AadhaarEncrypted { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string Gender { get; set; }
        //public string? ResumePath { get; set; }
        [Column("GSTNumber")]
        public string? GST { get; set; }


        public byte[] Resume { get; set; }

    }
}