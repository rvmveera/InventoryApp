using InventoryAPI.Data;
using InventoryAPI.Models;
using InventoryAPI.Models.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Reporting.NETCore;
using InventoryAPI.Services;

namespace InventoryAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SalesController : Controller
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
        [HttpPost("GetEstimationReport")]
        public async Task<IActionResult> GetEstimationReport([FromBody] EstimationReportRequest request)
        {
            try
            {
                string reportPath = Path.Combine(Directory.GetCurrentDirectory(), "Reports", "RptEstimation.rdlc");

                LocalReport report = new LocalReport();
                report.LoadReportDefinition(System.IO.File.OpenRead(reportPath));

                // 🔹 Fetch header + details from DB
                var header = await _context.EstimateHeaders
                    .FirstOrDefaultAsync(h => h.EstimateNumber == request.EstimateNumber);

                if (header == null)
                    return NotFound($"Estimate {request.EstimateNumber} not found.");
                var detailsRaw = await (from d in _context.EstimateDetails
                                        join im in _context.InventoryMaster
                                            on d.InventoryId equals im.id
                                        where d.EstimateNumber == request.EstimateNumber
                                        select new
                                        {
                                            d.Id,
                                            d.EstimateNumber,
                                            d.InventoryId,
                                            ProductName = im.goods_serviceDesc,
                                            Hsn = d.HsnNumber,
                                            d.Quantity,
                                            Unit = d.Uom,
                                            PriceUnit = d.PricePerUnit,
                                            d.Amount
                                        }).ToListAsync();

                // 🔹 Add S.No sequentially
                var details = detailsRaw.Select((x, index) => new
                {
                    Sno = index + 1,
                    x.ProductName,
                    x.Hsn,
                    x.Quantity,
                    x.Unit,
                    x.PriceUnit,
                    x.Amount
                }).ToList();

                // 🔹 Bind details dataset
                report.DataSources.Add(new ReportDataSource("EstimateDetailsDataSet", details));
                string totalAmountInWords = NumberToWordsConverter.ConvertAmountToWords(header.EstimateTotalAmount);

                // 🔹 Bind header parameters
                var parameters = new[]
                {
        new ReportParameter("EstimateFor", header.EstimateFor ?? string.Empty),
        new ReportParameter("EstimateDate", header.EstimateDate.ToString("dd-MMM-yyyy")),        
        new ReportParameter("EstimateNumber", header.EstimateNumber ?? string.Empty),
        new ReportParameter("EstimateTotalAmount", header.EstimateTotalAmount.ToString("N2")),
        new ReportParameter("TotalAmountInWords", totalAmountInWords)
                };

                report.SetParameters(parameters);

                // 🔹 Render PDF
                byte[] pdfBytes = report.Render("PDF");
                return File(pdfBytes, "application/pdf", $"{request.EstimateNumber}_Report.pdf");
            }

            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating estimate", error = ex.Message });

            }
        }
    }
}

/*
 new ReportParameter("BankName",  string.Empty),
        new ReportParameter("BankAccountNo", string.Empty),
        new ReportParameter("BankIfscCode", string.Empty),
        new ReportParameter("BankAccountHolderName", string.Empty),
        new ReportParameter("GSTNumber", string.Empty),
 */

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