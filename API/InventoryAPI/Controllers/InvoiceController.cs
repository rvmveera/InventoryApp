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

        [HttpPost("GetEstimationReport")]
        public IActionResult GetEstimationReport([FromBody] EstimationReportRequest request)
        {
            string reportPath = Path.Combine(Directory.GetCurrentDirectory(), "Reports", "RptEstimation.rdlc");

            LocalReport report = new LocalReport();
            report.LoadReportDefinition(System.IO.File.OpenRead(reportPath));

            // Bind the list of EstimateDetails
            report.DataSources.Add(new ReportDataSource("EstimateDetailsDataSet", request.EstimateDetails));
            //report.DataSources.Add(new ReportDataSource("EstimateDetailsDataSet", request));

           // request.EstimateFor = "HSC - Eswaramoorthipalayam";

            // Bind single-value objects as parameters
           
            var parameters = new[]
{
    new ReportParameter("EstimateFor", request.EstimateFor ?? string.Empty),
    new ReportParameter("EstimateDate", request.EstimateDate.ToString("dd-MMM-yyyy")),
    new ReportParameter("BankName", request?.BankName ?? string.Empty),
    new ReportParameter("BankAccountNo", request?.BankAccountNo ?? string.Empty),
    new ReportParameter("BankIfscCode", request?.BankIfscCode ?? string.Empty),
    new ReportParameter("BankAccountHolderName", request?.BankAccountHolderName ?? string.Empty),
    new ReportParameter("GSTNumber", request?.GSTNumber ?? string.Empty)
};
            report.SetParameters(parameters);

           

            byte[] pdfBytes = report.Render("PDF");
            return File(pdfBytes, "application/pdf", "estimationReport.pdf");
        }
    }
}




/*
 * 
 * {
estimateFor:
estimateDate:
estimateDetails :[
{
Sno, productName, hsn, quantity, unit, priceUnit, amount
},
{
Sno, productName, hsn, quantity, unit, priceUnit, amount
}],
bankDetails:{
name, accountNo, ifscCode, accountholderName, GST
}
}
 * 
 */
