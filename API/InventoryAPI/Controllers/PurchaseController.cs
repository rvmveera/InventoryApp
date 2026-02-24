using InventoryAPI.Data;
using InventoryAPI.Models;
using Microsoft.AspNetCore.Mvc;

namespace InventoryAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PurchaseController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PurchaseController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("save")]
        public async Task<IActionResult> SavePurchase([FromBody] PurchaseHeader purchaseHeader)
        {
            if (purchaseHeader == null)
                return BadRequest("Invalid data");

            // Add header and details in one transaction
            _context.PurchaseHeaders.Add(purchaseHeader);
            await _context.SaveChangesAsync();

            return Ok(new { purchaseHeader.Id, Message = "Purchase saved successfully" });
        }
    }
}
