using ClosedXML.Excel;
using InventoryAPI.Data;
using InventoryAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace InventoryAPI.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class VendorsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public VendorsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("addvendor")]
        public async Task<IActionResult> AddVendor([FromBody] Vendor vendor)
        {
            if (vendor == null)
                return BadRequest("Vendor data is required.");

            _context.Vendors.Add(vendor);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Vendor added successfully!", Vendor = vendor });
        }

        [HttpPost("uploadvendors")]
        public async Task<IActionResult> UploadVendors(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            var vendors = new List<Vendor>();

            try
            {
                using (var stream = new MemoryStream())
                {
                    await file.CopyToAsync(stream);
                    using (var workbook = new XLWorkbook(stream))
                    {
                        var worksheet = workbook.Worksheet(1); // first sheet
                        var rows = worksheet.RangeUsed().RowsUsed();

                        foreach (var row in rows.Skip(1)) // skip header row
                        {
                            var vendor = new Vendor
                            {
                                VendorName = row.Cell(1).GetString(),
                                Address1 = row.Cell(2).GetString(),
                                Address2 = row.Cell(3).GetString(),
                                Address3 = row.Cell(4).GetString(),
                                ContactNo1 = row.Cell(5).GetString(),
                                ContactNo2 = row.Cell(6).GetString(),
                                GstNumber = row.Cell(7).GetString(),
                                state = row.Cell(8).GetString(),
                                code = row.Cell(9).GetString(),
                                acNo = row.Cell(10).GetString(),
                                bank = row.Cell(11).GetString(),
                                ifscCode = row.Cell(12).GetString(),
                                acName = row.Cell(13).GetString(),
                                branchName = row.Cell(14).GetString(),
                                companyPAN = row.Cell(15).GetString(),
                                upi_gpayNo = row.Cell(16).GetString(),
                                comments = row.Cell(17).GetString(),
                               // activeStatus = int.TryParse(row.Cell(18).GetString(), out var status) ? status : 1
                            };

                            vendors.Add(vendor);
                        }
                    }
                }

                _context.Vendors.AddRange(vendors);
                await _context.SaveChangesAsync();

                return Ok(new { Message = $"{vendors.Count} vendors uploaded successfully!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error processing file: {ex.Message}");
            }
        }


        [HttpGet("downloadvendortemplate")]
        public IActionResult DownloadVendorTemplate()
        {
            using (var workbook = new XLWorkbook())
            {
                var worksheet = workbook.Worksheets.Add("Vendors");

                // Header row
                worksheet.Cell(1, 1).Value = "VendorName";
                worksheet.Cell(1, 2).Value = "Address1";
                worksheet.Cell(1, 3).Value = "Address2";
                worksheet.Cell(1, 4).Value = "Address3";
                worksheet.Cell(1, 5).Value = "ContactNo1";
                worksheet.Cell(1, 6).Value = "ContactNo2";
                worksheet.Cell(1, 7).Value = "GstNumber";
                worksheet.Cell(1, 8).Value = "State";
                worksheet.Cell(1, 9).Value = "Code";
                worksheet.Cell(1, 10).Value = "AcNo";
                worksheet.Cell(1, 11).Value = "Bank";
                worksheet.Cell(1, 12).Value = "IfscCode";
                worksheet.Cell(1, 13).Value = "AcName";
                worksheet.Cell(1, 14).Value = "BranchName";
                worksheet.Cell(1, 15).Value = "CompanyPAN";
                worksheet.Cell(1, 16).Value = "Upi_gpayNo";
                worksheet.Cell(1, 17).Value = "Comments";

                // Style header
                var headerRange = worksheet.Range(1, 1, 1, 17);
                headerRange.Style.Font.Bold = true;
                headerRange.Style.Fill.BackgroundColor = XLColor.LightGray;
                headerRange.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;

                worksheet.Columns().AdjustToContents();

                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    var content = stream.ToArray();
                    return File(content,
                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                                "VendorTemplate.xlsx");
                }
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetVendors()
        {
            var vendors = await _context.Vendors.ToListAsync();
            return Ok(vendors);
        }

        [HttpPost("addVendorGoodsType")]
        public async Task<IActionResult> AddVendorGoodsType([FromBody] List<VendorGoodsType> models)
        {
            if (models == null || !models.Any())
                return BadRequest("Invalid data. Must provide at least one group type.");

            try
            {
                _context.VendorGoodsTypes.AddRange(models);   // ✅ Add multiple records
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = "Vendor goods types added successfully",
                    data = models
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("GetVendorGroupType")]
        public async Task<IActionResult> GetVendorGroupType([FromQuery] int vendorId)
        {
            var vendorGroupTypes = await (from vg in _context.VendorGoodsTypes
                                          join gt in _context.GoodsTypeGSTs
                                          on vg.goodsTypeId equals gt.Id
                                          where vg.vendorId == vendorId
                                          select new
                                          {
                                              gt.Id,
                                              vg.goodsTypeId,
                                              vg.vendorId,
                                              vg.comments,
                                              GoodsTypeName = gt.GoodsType,   // ✅ fetch name from tblGoodsTypeGST
                                              GSTpercent = gt.GSTpercent
                                          }).ToListAsync();

            if (vendorGroupTypes == null || !vendorGroupTypes.Any())
            {
                return NotFound($"No group types found for vendor {vendorId}.");
            }

            return Ok(vendorGroupTypes);
        }      
    }
}
