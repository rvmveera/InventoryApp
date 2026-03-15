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
        public async Task<IActionResult> AddVendorGoodsType([FromBody] List<VendorGoodsType> models)
        {
            if (models == null || !models.Any())
                return BadRequest("Invalid data. Must provide at least one group type.");

            try
            {
                _context.VendorGoodsTypes.AddRange(models);   // ✅ Add multiple records
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = "Vendor goods types added successfully",
                    data = models
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("GetVendorGroupType")]
        public async Task<IActionResult> GetVendorGroupType([FromQuery] int vendorId)
        {
            var vendorGroupTypes = await (from vg in _context.VendorGoodsTypes
                                          join gt in _context.GoodsTypeGSTs
                                          on vg.goodsTypeId equals gt.Id
                                          where vg.vendorId == vendorId
                                          select new
                                          {
                                              vg.Id,
                                              vg.vendorId,
                                              vg.comments,
                                              GoodsTypeName = gt.GoodsType,   // ✅ fetch name from tblGoodsTypeGST
                                              GSTpercent = gt.GSTpercent
                                          }).ToListAsync();

            if (vendorGroupTypes == null || !vendorGroupTypes.Any())
            {
                return NotFound($"No group types found for vendor {vendorId}.");
            }

            return Ok(vendorGroupTypes);
        }      
    }
}
