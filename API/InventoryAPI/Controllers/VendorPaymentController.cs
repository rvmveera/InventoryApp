using InventoryAPI.Data;
using InventoryAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InventoryAPI.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class VendorPaymentController : ControllerBase
    {

        private readonly AppDbContext _context;

        public VendorPaymentController(AppDbContext context)
        {
            _context = context;
        }
       
        [HttpPost("billdetails")]
        public async Task<IActionResult> GetBillDetails([FromBody] VendorBillAmountRequest request)
        {
            if (request == null || request.VendorId <= 0)
                return BadRequest("Invalid vendorId");

            var billDetails = await _context.VendorPayments
                .Where(vp => vp.VendorId == request.VendorId)
                .Select(vp => new
                {
                    PurchaseId = vp.PurchaseId,
                    BillAmount = vp.BillAmount,
                    OutstandingAmount = vp.OutstandingAmount
                })
                .ToListAsync();

            if (billDetails == null || billDetails.Count == 0)
                return NotFound($"No bill details found for vendorId {request.VendorId}");

            return Ok(billDetails);
        }
    }
}
