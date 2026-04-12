using InventoryAPI.Data;
using InventoryAPI.Models;
using InventoryAPI.Models.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ClosedXML.Excel;

[Route("api/[controller]")]
[ApiController]
public class InventoryController : ControllerBase
{
    private readonly MyDbContext _context;

    public InventoryController(MyDbContext context)
    {
        _context = context;
    }



    // READ - Get all inventory items
    [HttpGet]
    public async Task<ActionResult<IEnumerable<InventoryMaster>>> GetAll()
    {
        return await _context.tblInventoryMaster.ToListAsync();
    }


    // UPDATE - Modify item
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, InventoryMaster updatedItem)
    {
        if (id != updatedItem.id) return BadRequest();

        _context.Entry(updatedItem).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    // DELETE - Remove item
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var item = await _context.tblInventoryMaster.FindAsync(id);
        if (item == null) return NotFound();

        _context.tblInventoryMaster.Remove(item);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpPost("GetAvailableStock")]
    public async Task<ActionResult<IEnumerable<InventoryDto>>> GetActiveInventory()
    {
        var query = from im in _context.tblInventoryMaster
                    join gt in _context.tblGoodsTypeGST
                        on im.goodsTypeId equals gt.Id
                    where im.Status == "A"
                    select new InventoryDto
                    {
                        GoodsTypeId = im.goodsTypeId,
                        GoodsType = gt.GoodsType,
                        InventoryId = im.id,
                        Goods_ServiceDesc = im.goods_serviceDesc,
                        AvailableQty = im.availableQty ?? 0,
                        GSTPercent = gt.GSTpercent
                    };

        var result = await query.ToListAsync();
        return Ok(result);
    }


    [HttpPost("export")]
    public IActionResult ExportActiveInventories()
    {
        
        var query = from tim in _context.tblInventoryMaster
                    join tg in _context.tblGoodsTypeGST
                        on tim.goodsTypeId equals tg.Id
                    join tip in _context.tblInventoryPrice
                        on tim.id equals tip.inventoryId into priceGroup
                    from tip in priceGroup.DefaultIfEmpty() // LEFT JOIN
                    where tim.Status == "A"
                    orderby tim.id
                    select new AvailableInventoryDto
                    {
                        Id = tim.id,
                        GoodsType = tg.GoodsType,
                        GoodsServiceDesc = tim.goods_serviceDesc,
                        price = tip != null ? tip.price : 0
                    };


        var data = query.ToList();

        using (var workbook = new XLWorkbook())
        {
            var worksheet = workbook.Worksheets.Add("Inventories");

            // Headers
            worksheet.Cell(1, 1).Value = "ID";
            worksheet.Cell(1, 2).Value = "GoodsType";
            worksheet.Cell(1, 3).Value = "GoodsServiceDesc";
            worksheet.Cell(1, 4).Value = "Price";

            int row = 2;
            foreach (var item in data)
            {
                worksheet.Cell(row, 1).Value = item.Id;
                worksheet.Cell(row, 2).Value = item.GoodsType;
                worksheet.Cell(row, 3).Value = item.GoodsServiceDesc;
                worksheet.Cell(row, 4).Value = item.price; // editable Price column
                row++;
            }

            // Lock all cells except Price column  // Explicitly lock first 3 columns
            worksheet.RangeUsed().Columns(1, 3).Style.Protection.SetLocked(true);
            worksheet.Column(4).Cells().Style.Protection.SetLocked(false);


            using (var stream = new MemoryStream())
            {
                workbook.SaveAs(stream);
                var content = stream.ToArray();
                return File(content,
                            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                            "ActiveInventories.xlsx");
            }
        }
    }

}