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
                    OutstandingAmount = vp.OutstandingAmount,
                    Id = vp.Id
                })
                .ToListAsync();

            if (billDetails == null || billDetails.Count == 0)
                return NotFound($"No bill details found for vendorId {request.VendorId}");

            return Ok(billDetails);
        }

        [HttpPost("makepayment")]
        public async Task<IActionResult> SubmitVendorPayment([FromBody] VendorPaymentRequest request)
        {
            if (request == null || request.VendorPaymentId <= 0 || request.PaymentAmount <= 0 || request.PaymentDate == default)
                return BadRequest("Invalid payment history request");

            // Start a transaction
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                // Step 1: Insert into VendorPaymentHistories
                var history = new VendorPaymentHistory
                {
                    VendorPaymentId = request.VendorPaymentId,
                    PaymentAmount = request.PaymentAmount,
                    PaymentDate = request.PaymentDate,
                    Comments = request.Comments
                };

                _context.VendorPaymentHistories.Add(history);
                await _context.SaveChangesAsync();

                
                // Update outstanding directly
                await _context.VendorPayments
                    .Where(v => v.Id == request.VendorPaymentId)
                    .ExecuteUpdateAsync(s => s
                        .SetProperty(v => v.OutstandingAmount,
                            v => (v.OutstandingAmount - request.PaymentAmount)));

                await transaction.CommitAsync();


                return Ok(new
                {
                    message = "Payment history recorded successfully",
                    historyId = history.Id,
                    vendorPaymentId = history.VendorPaymentId,
                    paymentAmount = history.PaymentAmount,
                    paymentDate = history.PaymentDate
                });
            }
            catch (Exception ex)
            {
                // Rollback if anything fails
                await transaction.RollbackAsync();
                return StatusCode(500, $"An error occurred while processing payment: {ex.Message}");
            }
        }
    }
}
