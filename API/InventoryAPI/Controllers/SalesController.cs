using InventoryAPI.Data;
using InventoryAPI.Models;
using InventoryAPI.Models.DTOs;
using InventoryAPI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Reporting.NETCore;

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
                string reportPath = Path.Combine(AppContext.BaseDirectory, "Reports", "RptEstimation.rdlc");

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

        [HttpPost("CreateInvoice")]
        public async Task<IActionResult> CreateInvoice([FromBody] InvoiceDto invoiceDto)
        {
            if (invoiceDto == null || invoiceDto.Details == null || !invoiceDto.Details.Any())
                return BadRequest("Invalid invoice data.");
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {

                // Generate next invoice number
                var lastInvoice = await _context.InvoiceHeaders
                    .OrderByDescending(h => h.Id)
                    .FirstOrDefaultAsync();

                string nextInvoiceNumber;
                if (lastInvoice == null || string.IsNullOrEmpty(lastInvoice.InvoiceNumber))
                {
                    nextInvoiceNumber = "INV001";
                }
                else
                {
                    // Extract numeric part
                    var numericPart = int.Parse(lastInvoice.InvoiceNumber.Substring(3));
                    nextInvoiceNumber = $"INV{(numericPart + 1).ToString("D3")}";
                }
                // Save header
                var header = new InvoiceHeader
                {
                    BuyerName = invoiceDto.BuyerName,
                    BuyerAddress = invoiceDto.BuyerAddress,
                    InvoiceNumber = nextInvoiceNumber,
                    InvoiceDate = invoiceDto.InvoiceDate,
                    ConsigneeId = invoiceDto.ConsigneeId,
                    InvoiceTotal = invoiceDto.InvoiceTotal
                };

                _context.InvoiceHeaders.Add(header);
                await _context.SaveChangesAsync();

                // Save details and update inventory
                foreach (var detailDto in invoiceDto.Details)
                {
                    var detail = new InvoiceDetail
                    {
                        InvoiceHeaderId = header.Id,
                        InvoiceNumber = header.InvoiceNumber,
                        InventoryId = detailDto.InventoryId,
                        HsnNumber = detailDto.HsnNumber,
                        Quantity = detailDto.Quantity,
                        Unit = detailDto.Unit,
                        PricePerUnit = detailDto.PricePerUnit,
                        Gst = detailDto.Gst,
                        cgstPercent = detailDto.Gst / 2,
                        sgstPercent = detailDto.Gst / 2,
                        Discount = detailDto.Discount,
                        NetAmount = detailDto.NetAmount,
                        taxAmount = detailDto.TaxAmount
                    };
                    _context.InvoiceDetails.Add(detail);

                    // Update inventory quantity
                    var inventory = await _context.InventoryMaster
                        .FirstOrDefaultAsync(i => i.id == detailDto.InventoryId);

                    if (inventory == null)
                    {
                        await transaction.RollbackAsync();
                        return BadRequest($"Inventory item {detailDto.InventoryId} not found.");
                    }

                    if (inventory.availableQty < detailDto.Quantity)
                    {
                        await transaction.RollbackAsync();
                        return BadRequest($"Insufficient stock for inventory {detailDto.InventoryId}. " +
                            $"Available: {inventory.availableQty}, Requested: {detailDto.Quantity}");
                    }

                    inventory.availableQty -= detailDto.Quantity;
                    _context.InventoryMaster.Update(inventory);
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new { InvoiceNumber = header.InvoiceNumber, Message = "Invoice created successfully" });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, $"Error saving invoice: {ex.Message}");
            }
        }

      

      
        [HttpPost("GetInvoiceReport")]
        public async Task<IActionResult> GetInvoiceReport([FromBody] InvoiceReportRequest request)
        {
            try
            {
                string reportPath = Path.Combine(Directory.GetCurrentDirectory(), "Reports", "RptInvoice.rdlc");

                LocalReport report = new LocalReport();
                report.LoadReportDefinition(System.IO.File.OpenRead(reportPath));

                // 🔹 Fetch header + details from DB
                var header =  await _context.InvoiceHeaders
                    .FirstOrDefaultAsync(h => h.InvoiceNumber == request.InvoiceNumber);

                if (header == null)
                    return NotFound($"Invoice {request.InvoiceNumber} not found.");
                var detailsRaw = await (from d in _context.InvoiceDetails
                                        join im in _context.InventoryMaster
                                            on d.InventoryId equals im.id
                                        where d.InvoiceNumber == request.InvoiceNumber
                                        select new
                                        {
                                            d.Id,
                                            d.InvoiceHeaderId,
                                            d.InventoryId,
                                            ProductName = im.goods_serviceDesc,
                                            Hsn = d.HsnNumber,
                                            d.Quantity,
                                            Unit = d.Unit,
                                            d.Gst,
                                            PriceUnit = d.PricePerUnit,
                                            d.taxAmount,
                                            d.NetAmount
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
                    CGST = x.Gst / 2 + "%",
                    SGST = x.Gst / 2 + "%",
                    taxAmount = x.taxAmount,
                    Amount = x.NetAmount
                }).ToList();

                // 🔹 Bind details dataset
                report.DataSources.Add(new ReportDataSource("InvoiceDetailsDataSet", details));
                string totalAmountInWords = NumberToWordsConverter.ConvertAmountToWords(header.InvoiceTotal);

                // 🔹 Bind header parameters
                var parameters = new[]
                {
        new ReportParameter("InvoiceFor", header.BuyerName ?? string.Empty),
        new ReportParameter("InvoiceDate", header.InvoiceDate.ToString("dd-MMM-yyyy")),
        new ReportParameter("InvoiceNumber", header.InvoiceNumber ?? string.Empty),
        new ReportParameter("InvoiceTotalAmount", header.InvoiceTotal.ToString("N2")),
        new ReportParameter("TotalAmountInWords", totalAmountInWords)
                };

                report.SetParameters(parameters);

                // 🔹 Render PDF
                byte[] pdfBytes = report.Render("PDF");
                return File(pdfBytes, "application/pdf", $"{request.InvoiceNumber}_Report.pdf");
            }

            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error creating estimate", error = ex.Message });

            }
        }


        [HttpPost("GetInvoiceDetails")]
        public async Task<IActionResult> GetInvoiceDetails([FromBody] InvoiceReportRequest request)
        {
            try
            {
                // 🔹 Fetch header
                var header = await _context.InvoiceHeaders
                    .FirstOrDefaultAsync(h => h.InvoiceNumber == request.InvoiceNumber && 
                    h.Status != "R");

              
                if (header == null)
                    return NotFound(new { message = $"Invoice {request.InvoiceNumber} not found." });

                // 🔹 Fetch details
                var detailsRaw = await (from d in _context.InvoiceDetails
                                        join im in _context.InventoryMaster
                                            on d.InventoryId equals im.id
                                        where d.InvoiceNumber == request.InvoiceNumber
                                        select new
                                        {
                                            d.Id,
                                            d.InvoiceHeaderId,
                                            d.InventoryId,
                                            ProductName = im.goods_serviceDesc,
                                            Hsn = d.HsnNumber,
                                            d.Quantity,
                                            Unit = d.Unit,
                                            d.Gst,
                                            PriceUnit = d.PricePerUnit,
                                            d.taxAmount,
                                            d.NetAmount
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
                    CGST = x.Gst / 2,
                    SGST = x.Gst / 2,
                    x.taxAmount,
                    Amount = x.NetAmount
                }).ToList();

                // 🔹 Return JSON response
                return Ok(new
                {
                    Header = new
                    {
                        header.Id,
                        header.BuyerName,
                        header.BuyerAddress,
                        header.InvoiceNumber,
                        InvoiceDate = header.InvoiceDate.ToString("dd-MMM-yyyy"),
                        header.ConsigneeId,
                        header.InvoiceTotal
                    },
                    Details = details
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching invoice details", error = ex.Message });
            }
        }
        [HttpPost("ReturnInvoice")]
        public async Task<IActionResult> ReturnInvoice([FromBody] ReturnInvoiceRequest request)
        {
            if (string.IsNullOrEmpty(request.InvoiceNumber))
                return BadRequest("Invoice number is required.");

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                // 🔹 Fetch header
                var header = await _context.InvoiceHeaders
                    .FirstOrDefaultAsync(h => h.InvoiceNumber == request.InvoiceNumber);

                if (header == null)
                    return NotFound($"Invoice {request.InvoiceNumber} not found.");

                // 🔹 Mark header as Returned
                header.Status = "R";
                _context.InvoiceHeaders.Update(header);

                // 🔹 Fetch details
                var details = await _context.InvoiceDetails
                    .Where(d => d.InvoiceNumber == request.InvoiceNumber)
                    .ToListAsync();

                if (!details.Any())
                    return NotFound($"No details found for invoice {request.InvoiceNumber}.");

                foreach (var detail in details)
                {
                    // Mark detail as Returned
                    detail.Status = "R";
                    _context.InvoiceDetails.Update(detail);

                    // Update inventory qty
                    var inventory = await _context.InventoryMaster
                        .FirstOrDefaultAsync(i => i.id == detail.InventoryId);

                    if (inventory == null)
                    {
                        await transaction.RollbackAsync();
                        return BadRequest($"Inventory item {detail.InventoryId} not found.");
                    }

                    inventory.availableQty += detail.Quantity;
                    _context.InventoryMaster.Update(inventory);
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new { Message = $"Invoice {request.InvoiceNumber} returned successfully." });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { message = "Error returning invoice", error = ex.Message });
            }
        }


    }
}


/*
 * Create Estimate sample request payload 
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

/*
 * Create Invoice sample payload
 * {
  "buyerName": "HSC KUMAR",
  "buyerAddress": "HSCKUMAR",
  "invoiceNumber": "INV010",
  "invoiceDate": "2026-06-07",
  "consigneeId": 1,
  "invoiceTotal": 1000,
  "details": [
    {
      "inventoryId": 1, 
      "hsnNumber": "HSN001",
      "quantity": 1,
      "unit": "PC",
      "pricePerUnit": 1000,
      "gst": 0,
      "discount": 0,
      "netAmount": 0
    }
  ]
}
 */ 