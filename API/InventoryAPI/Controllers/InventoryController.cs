using InventoryAPI.Data;
using InventoryAPI.Models;
using InventoryAPI.Models.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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

    // READ - Get item by ID
   /* [HttpGet("{id}")]
    public async Task<ActionResult<InventoryMaster>> GetById(string id)
    {
        var item = await _context.tblInventoryMaster.FindAsync(id);
        if (item == null) return NotFound();
        return item;
    }*/

    // CREATE - Add new item
    /*[HttpPost]   
    public async Task<ActionResult<InventoryMaster>> Create(InventoryMaster item)
    {
        _context.tblInventoryMaster.Add(item);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = item.id }, item);
    }
    */
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
                        AvailableQty = im.availableQty ?? 0
                    };

        var result = await query.ToListAsync();
        return Ok(result);
    }


}