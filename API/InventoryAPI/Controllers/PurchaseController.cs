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


            var vendorPayment = new VendorPayments
            {
                VendorId = purchaseHeader.VendorId,       // assuming PurchaseHeader has VendorId
                BillAmount = purchaseHeader.totalBillAmount,  // or whichever field represents bill amount
                OutstandingAmount = purchaseHeader.totalBillAmount, // initially equal to bill amount
                PurchaseId = purchaseHeader.Id,           // link to the saved purchase
                //CreatedBy = purchaseHeader.create,     // or current user context
                //PaymentHistories = new List<VendorPaymentHistory>() // optional, can be left null
            };

            _context.VendorPayments.Add(vendorPayment);
            await _context.SaveChangesAsync();
            return Ok(new { purchaseHeader.Id, Message = "Purchase saved successfully" });
        }
    }
}



/*
{
  "id": 0,
  "vendorId": 1,
  "consigneeId": 1,
  "buyerName": "buyer1",
  "buyerAddress": "Buyer Addr1",
  "buyerGST": "GST234",
  "buyerEmail": "test@test.com",
  "buyerState": "Tamil Nadu",
  "buyerCode": "33",
  "buyerPlaceofsupply": "Chennai",
  "buyerContactName": "Contact1",
  "buyerMobileNo": "1234567890",
  "invoiceNo": "INV001",
  "ewayBillNo": "EWAY001",
  "invoiceDate": "2026-03-08T15:27:30.412Z",
  "deliveryNote": "string",
  "termsOfPayment": "string",
  "supplierRef": "string",
  "otherReference": "string",
  "buyerOrderNo": "string",
  "buyerOrderDate": "2026-03-08T15:27:30.412Z",
  "despatchDocNo": "string",
  "deliveryNoteDate": "2026-03-08T15:27:30.412Z",
  "despatchedThrough": "string",
  "destination": "string",
  "billOfLadingNo": "string",
  "vehicleNo": "string",
  "termsOfDelivery": "string",
  "purchaseDetails": [
    {
      "id": 0,
      "purchaseHeaderId": 0,
      "goods_ServiceDesc": "Bed",
      "hsnSac": "HSN001",
      "quantity": 10,
      "rate": 100,
      "uomPer": "pc",
      "discountPercent": 0,
      "amount": 20000,
      "gst": 5,
      "total": 20000
    }
  ]
}
*/