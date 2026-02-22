using InventoryAPI.Data;
using InventoryAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InventoryAPI.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class VendorsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public VendorsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("addvendor")]
        public async Task<IActionResult> AddVendor([FromBody] Vendor vendor)
        {
            if (vendor == null)
                return BadRequest("Vendor data is required.");

            _context.Vendors.Add(vendor);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Vendor added successfully!", Vendor = vendor });
        }

        [HttpGet]
        public async Task<IActionResult> GetVendors()
        {
            var vendors = await _context.Vendors.ToListAsync();
            return Ok(vendors);
        }

        [HttpPost("addVendorGoodsType")]
        public async Task<IActionResult> AddVendorGoodsType([FromBody] VendorGoodsType model)
        {
            if (model == null)
                return BadRequest("Invalid data.");

            try
            {
                _context.VendorGoodsTypes.Add(model);
                await _context.SaveChangesAsync();
                return Ok(new { message = "Vendor goods type added successfully", data = model });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

    }
}