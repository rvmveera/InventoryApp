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
 *
 *{
  "estimateFor": "HSC EswaraMoorthy",
  "estimateDate": "2026-05-24",
  "estimateDetails": [
    {
      "sno": 1,
      "productName": "BERO",
      "hsn": "HSN001",
      "quantity": 1,
      "unit": "Pc",
      "priceUnit": 10000,
      "amount": 10000
    },
    {
      "sno": 2,
      "productName": "TABLES",
      "hsn": "HSN002",
      "quantity": 2,
      "unit": "Pc",
      "priceUnit": 7000,
      "amount": 14000
    }
  ],
  "bankName": "string",
  "bankAccountNo": "string",
  "bankIfscCode": "string",
  "bankAccountHolderName": "string",
  "gstNumber": "string"
}
 *
 */
