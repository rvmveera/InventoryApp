using ClosedXML.Excel;
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


        [HttpPost("downloadPurchaseTemplate")]

        public IActionResult DownloadPurchaseTemplate()
        {
            // Define your query with WHERE 1=0 to get schema only
            var query = from tph in _context.PurchaseHeaders
                        join tpd in _context.PurchaseDetails
                            on tph.Id equals tpd.PurchaseHeaderId
                        where 1 == 0 // ensures no records
                        select new
                        {
                            tph.VendorId,
                            tph.InvoiceNo,
                            tph.EwayBillNo,
                            tph.InvoiceDate,
                            tph.DeliveryNote,
                            tph.TermsOfPayment,
                            tph.SupplierRef,
                            tph.OtherReference,
                            tph.ConsigneeId,
                            tph.BuyerOrderNo,
                            tph.BuyerOrderDate,
                            tph.DespatchDocNo,
                            tph.DeliveryNoteDate,
                            tph.Destination,
                            tph.BuyerName,
                            tph.BuyerAddress,
                            tph.BuyerGST,
                            tph.BuyerState,
                            tph.BuyerCode,
                            tph.BuyerPlaceofsupply,
                            tph.BuyerContactName,
                            tph.BuyerEmail,
                            tph.BuyerMobileNo,
                            tph.BillOfLadingNo,
                            tph.VehicleNo,
                            tph.TermsOfDelivery,
                            tpd.goodsTypeId,
                            Description = tpd.Goods_ServiceDesc,
                            tpd.HsnSac,
                            tpd.Quantity,
                            tpd.Rate,
                            tpd.UomPer,
                            tpd.DiscountPercent,
                            tpd.Amount
                        };

            // Materialize to get schema (no rows returned)
            var data = query.ToList();

            using (var workbook = new XLWorkbook())
            {
                var worksheet = workbook.Worksheets.Add("PurchaseTemplate");

                // Write headers explicitly (since no rows are returned)
                worksheet.Cell(1, 1).Value = "vendorId";
                worksheet.Cell(1, 2).Value = "invoiceNo";
                worksheet.Cell(1, 3).Value = "ewayBillNo";
                worksheet.Cell(1, 4).Value = "invoiceDate";
                worksheet.Cell(1, 5).Value = "deliveryNote";
                worksheet.Cell(1, 6).Value = "termsOfPayment";
                worksheet.Cell(1, 7).Value = "supplierRef";
                worksheet.Cell(1, 8).Value = "otherReference";
                worksheet.Cell(1, 9).Value = "consigneeId";
                worksheet.Cell(1, 10).Value = "buyerOrderNo";
                worksheet.Cell(1, 11).Value = "buyerOrderDate";
                worksheet.Cell(1, 12).Value = "despatchDocNo";
                worksheet.Cell(1, 13).Value = "deliveryNoteDate";
                worksheet.Cell(1, 14).Value = "destination";
                worksheet.Cell(1, 15).Value = "buyerName";
                worksheet.Cell(1, 16).Value = "buyerAddress";
                worksheet.Cell(1, 17).Value = "buyerGST";
                worksheet.Cell(1, 18).Value = "buyerState";
                worksheet.Cell(1, 19).Value = "buyerCode";
                worksheet.Cell(1, 20).Value = "buyerPlaceofsupply";
                worksheet.Cell(1, 21).Value = "buyerContactName";
                worksheet.Cell(1, 22).Value = "buyerEmail";
                worksheet.Cell(1, 23).Value = "buyerMobileNo";
                worksheet.Cell(1, 24).Value = "billOfLadingNo";
                worksheet.Cell(1, 25).Value = "vehicleNo";
                worksheet.Cell(1, 26).Value = "termsOfDelivery";
                worksheet.Cell(1, 27).Value = "goodsTypeId";
                worksheet.Cell(1, 28).Value = "Description";
                worksheet.Cell(1, 29).Value = "hsnSac";
                worksheet.Cell(1, 30).Value = "quantity";
                worksheet.Cell(1, 31).Value = "rate";
                worksheet.Cell(1, 32).Value = "uomPer";
                worksheet.Cell(1, 33).Value = "discountPercent";
                worksheet.Cell(1, 34).Value = "amount";

                // Style headers
                worksheet.Row(1).Style.Font.Bold = true;
                worksheet.Row(1).Style.Fill.BackgroundColor = XLColor.LightGray;

                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    var content = stream.ToArray();
                    return File(content,
                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                                "PurchaseTemplate.xlsx");
                }
            }
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