using InventoryAPI.Data;
using InventoryAPI.Models;
using InventoryAPI.Models.DTOs;
using InventoryAPI.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace InventoryAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IAadhaarCrypto _crypto;
        private readonly PasswordHasher<User> _hasher;
        private readonly IWebHostEnvironment _env;

        public UsersController(AppDbContext db, IAadhaarCrypto crypto, PasswordHasher<User> hasher, IWebHostEnvironment env)
        {
            _db = db; _crypto = crypto; _hasher = hasher; _env = env;
        }

        //public async Task<IActionResult> Register([FromBody] RegisterUserDto dto, IFormFile? resume)
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterUserDto dto)
        {

            if (!ModelState.IsValid)
                return BadRequest(ModelState);



            if (dto.Password != dto.ConfirmPassword) return BadRequest("Passwords do not match.");

            
            var user = new User
            {
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                EmailId = dto.EmailId,
                PhoneNumber = dto.PhoneNumber,
                Username = dto.Username,
                Address1 = dto.Address1,
                Address2 = dto.Address2,
                Address3 = dto.Address3,
                UserTypeId = dto.UserTypeId,
                DateOfBirth = dto.DateOfBirth,
                Gender = dto.Gender,
                GST = dto.GST
            };

            user.PasswordHash = _hasher.HashPassword(user, dto.Password);

            if (!string.IsNullOrWhiteSpace(dto.Aadhaar))
                user.AadhaarEncrypted = _crypto.Encrypt(dto.Aadhaar);

            // to test
            /*if (resume != null && resume.Length > 0)
            {
                var uploadsDir = Path.Combine(_env.WebRootPath ?? "wwwroot", "uploads");
                Directory.CreateDirectory(uploadsDir);
                var safeName = $"{Guid.NewGuid()}{Path.GetExtension(resume.FileName)}";
                var fullPath = Path.Combine(uploadsDir, safeName);
                using var fs = System.IO.File.Create(fullPath);
                await resume.CopyToAsync(fs);
                user.ResumePath = $"/uploads/{safeName}";
            }*/

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = user.Id }, new { user.Id, user.Username, user.EmailId });
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var user = await _db.Users.FirstOrDefaultAsync(x => x.Id == id);

            if (user == null)
                return NotFound(new { message = $"User with id {id} not found." });

            // Mask Aadhaar if present
            string? maskedAadhaar = null;
            if (!string.IsNullOrEmpty(user.AadhaarEncrypted))
            {
                try
                {
                    var aadhaar = _crypto.Decrypt(user.AadhaarEncrypted);
                    maskedAadhaar = $"XXXXXXXX{aadhaar[^4..]}"; // show only last 4 digits
                }
                catch
                {
                    maskedAadhaar = "Invalid Aadhaar data";
                }
            }

            // Return safe DTO (exclude password hash)
            var response = new
            {
                user.Id,
                user.FirstName,
                user.LastName,
                user.EmailId,
                user.PhoneNumber,
                user.Username,
                user.Address1,
                user.Address2,
                user.Address3,
                user.UserTypeId,
                user.DateOfBirth,
                user.Gender,
                //user.ResumePath,
                user.GST,
                AadhaarMasked = maskedAadhaar,
                
            };

            return Ok(response);
        }
    }
}
