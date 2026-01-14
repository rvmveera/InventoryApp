using InventoryAPI.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InventoryAPI.Models.DTOs
{
    public class RegisterUserDto
    {
        public string FirstName { get; set; } = default!;
        public string LastName { get; set; } = default!;
        public string EmailId { get; set; } = default!;
        public int PhoneNumber { get; set; } = default!;
        public string Username { get; set; } = default!;
        public string Password { get; set; } = default!;
        public string ConfirmPassword { get; set; } = default!;
        public string Address1 { get; set; } = default!;
        public string Address2 { get; set; } = default!;
        public string Address3 { get; set; } = default!;
        public int UserTypeId { get; set; }
        [Column("AadhaarNo")]
        public string? Aadhaar { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string Gender { get; set; }
        [Column("GSTNumber")]
        public string? GST { get; set; }
    }
}