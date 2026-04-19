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
            // Step 1: Query DB for vendor-goods mapping
            var vendorGoods = (from vm in _context.Vendors
                               join vgt in _context.VendorGoodsTypes on vm.VendorId equals vgt.vendorId
                               join gst in _context.GoodsTypeGSTs on vgt.goodsTypeId equals gst.Id
                               where vm.activeStatus == 1
                               orderby vm.VendorId, gst.GoodsType
                               select new
                               {
                                   VendorId = vm.VendorId,
                                   VendorName = vm.VendorName,
                                   GoodsTypeId = gst.Id,
                                   GoodsType = gst.GoodsType,
                                   GSTPercent = gst.GSTpercent
                               }).ToList();

            using (var workbook = new XLWorkbook())
            {
                var worksheet = workbook.Worksheets.Add("PurchaseTemplate");

                // Step 2: Headers
                worksheet.Cell(1, 1).Value = "vendorId - vendorName";
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
                worksheet.Cell(1, 27).Value = "goodsTypeId - goodsType";
                worksheet.Cell(1, 28).Value = "Description";
                worksheet.Cell(1, 29).Value = "hsnSac";
                worksheet.Cell(1, 30).Value = "quantity";
                worksheet.Cell(1, 31).Value = "rate";
                worksheet.Cell(1, 32).Value = "uomPer";
                worksheet.Cell(1, 33).Value = "discountPercent";
                worksheet.Cell(1, 34).Value = "amount";

                worksheet.Row(1).Style.Font.Bold = true;
                worksheet.Row(1).Style.Fill.BackgroundColor = XLColor.LightGray;

                // Step 3: Hidden sheet for vendor-goods mapping
                var hiddenSheet = workbook.Worksheets.Add("VendorGoods");

                // Group goods by vendor
                var grouped = vendorGoods
                    .GroupBy(v => new { v.VendorId, v.VendorName })
                    .ToList();

                // Vendor list in col A (ID – Name)
                for (int i = 0; i < grouped.Count; i++)
                {
                    string displayName = $"{grouped[i].Key.VendorId} - {grouped[i].Key.VendorName}";
                    hiddenSheet.Cell(i + 1, 1).Value = displayName;
                }

                // Named range for vendor list
                var vendorRange = hiddenSheet.Range(1, 1, grouped.Count, 1);
                workbook.NamedRanges.Add("VendorList", vendorRange);

                // Goods lists per vendor
                int row = 1;
                foreach (var group in grouped)
                {
                    string vendorKey = $"Vendor{group.Key.VendorId}"; // safe named range

                    int startRow = row;
                    foreach (var g in group)
                    {
                        hiddenSheet.Cell(row, 2).Value = $"{g.GoodsTypeId} - {g.GoodsType}";
                        row++;
                    }

                    var goodsRange = hiddenSheet.Range(startRow, 2, row - 1, 2);
                    workbook.NamedRanges.Add(vendorKey, goodsRange);
                }

                hiddenSheet.Visibility = XLWorksheetVisibility.VeryHidden;

                // Step 4: Vendor dropdown in col A
                var vendorValidationRange = worksheet.Range("A2:A100");
                var dvVendor = vendorValidationRange.CreateDataValidation();
                dvVendor.List("VendorList");

                // Step 5: Goods dropdown in col 27 (AA)
                var goodsValidationRange = worksheet.Range("AA2:AA100");
                var dvGoods = goodsValidationRange.CreateDataValidation();

                // Formula: extract VendorId from "VendorId - VendorName"
                dvGoods.List("INDIRECT(\"Vendor\" & LEFT($A2,FIND(\" \",$A2)-1))");

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