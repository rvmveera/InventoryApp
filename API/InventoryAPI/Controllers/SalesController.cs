using InventoryAPI.Data;
using InventoryAPI.Models;
using InventoryAPI.Models.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InventoryAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SalesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SalesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("CreateEstimate")]
        public async Task<IActionResult> CreateEstimate([FromBody] EstimateRequest request)
        {
            if (request == null || request.EstimateDetails == null || !request.EstimateDetails.Any())
                return BadRequest("Invalid estimate data.");

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                // 🔹 Generate next EstimateNumber
                var lastEstimate = await _context.EstimateHeaders
                    .OrderByDescending(h => h.Id)
                    .FirstOrDefaultAsync();

                int nextNumber = 1;
                if (lastEstimate != null && !string.IsNullOrEmpty(lastEstimate.EstimateNumber))
                {
                    string numericPart = lastEstimate.EstimateNumber.Replace("EST", "");
                    if (int.TryParse(numericPart, out int lastNumber))
                    {
                        nextNumber = lastNumber + 1;
                    }
                }

                string newEstimateNumber = $"EST{nextNumber:D3}"; // EST001, EST002, … EST1000

                // 🔹 Create header
                var header = new tblEstimateHeader
                {
                    EstimateNumber = newEstimateNumber,
                    EstimateFor = request.EstimateFor,
                    EstimateDate = request.EstimateDate,
                    EstimateTotalAmount = request.EstimateDetails.Sum(d => d.Amount),
                    EstimateDetails = request.EstimateDetails.Select(d => new tblEstimateDetails
                    {
                        EstimateNumber = newEstimateNumber,
                        InventoryId = d.InventoryId,
                        HsnNumber = d.HsnNumber,
                        Quantity = d.Quantity,
                        Uom = d.Uom,
                        PricePerUnit = d.PricePerUnit,
                        Amount = d.Amount
                    }).ToList()
                };

                _context.EstimateHeaders.Add(header);
                await _context.SaveChangesAsync();

                // 🔹 Commit transaction
                await transaction.CommitAsync();

                return Ok(new { message = "Estimate created successfully", header.Id, header.EstimateNumber });
            }
            catch (Exception ex)
            {
                // 🔹 Rollback if anything fails
                await transaction.RollbackAsync();
                return StatusCode(500, new { message = "Error creating estimate", error = ex.Message });
            }
        }

    }
}



/*
 * 
 * {
  "estimateFor": "ABC Corp",
  "estimateDate": "2026-05-30",
"estimateNumber":"",
  "estimateDetails": [
    { "inventoryId": 1, "hsnNumber": "1234", "quantity": 2, "uom": "Nos", "pricePerUnit": 50000, "amount": 100000 },
    { "inventoryId": 2, "hsnNumber": "5678", "quantity": 5, "uom": "Nos", "pricePerUnit": 500, "amount": 2500 }
  ]
}
*/