using InventoryAPI.Data;
using InventoryAPI.Models;
using InventoryAPI.Models.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Reporting.NETCore;

namespace InventoryAPI.Controllers
{
    public class InvoiceController : Controller
    {

        private readonly AppDbContext _context;

        public InvoiceController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("CreateInvoice")]
        public async Task<IActionResult> CreateInvoice([FromBody] InvoiceDto invoiceDto)
        {
            if (invoiceDto == null || invoiceDto.Details == null || !invoiceDto.Details.Any())
                return BadRequest("Invalid invoice data.");
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                // Save header
                var header = new InvoiceHeader
                {
                    BuyerName = invoiceDto.BuyerName,
                    BuyerAddress = invoiceDto.BuyerAddress,
                    InvoiceNumber = invoiceDto.InvoiceNumber,
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
                        InventoryId = detailDto.InventoryId,
                        HsnNumber = detailDto.HsnNumber,
                        Quantity = detailDto.Quantity,
                        Unit = detailDto.Unit,
                        PricePerUnit = detailDto.PricePerUnit,
                        Gst = detailDto.Gst,
                        Discount = detailDto.Discount,
                        NetAmount = detailDto.NetAmount
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

                return Ok(new { InvoiceId = header.Id, Message = "Invoice created successfully" });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, $"Error saving invoice: {ex.Message}");
            }
        }

        [HttpGet("GetEstimationReport")]
        public IActionResult GetSalesReport()
        {
            // Path to RDLC file
            string reportPath = Path.Combine(Directory.GetCurrentDirectory(), "Reports", "RptEstimation.rdlc");

            // Prepare LocalReport
            LocalReport report = new LocalReport();
            report.LoadReportDefinition(System.IO.File.OpenRead(reportPath));

            // Example: in-memory dataset (no DB call)
          

            // Render as PDF
            byte[] pdfBytes = report.Render("PDF");

            // Return as file
            return File(pdfBytes, "application/pdf", "estimationReport.pdf");
        }
    }
}

