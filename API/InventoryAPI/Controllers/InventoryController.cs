using InventoryAPI.Data;
using InventoryAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
public class InventoryController : ControllerBase
{
    private readonly InventoryContext _context;

    public InventoryController(InventoryContext context)
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
    [HttpGet("{id}")]
    public async Task<ActionResult<InventoryMaster>> GetById(string id)
    {
        var item = await _context.tblInventoryMaster.FindAsync(id);
        if (item == null) return NotFound();
        return item;
    }

    // CREATE - Add new item
    [HttpPost]
    public async Task<ActionResult<InventoryMaster>> Create(InventoryMaster item)
    {
        _context.tblInventoryMaster.Add(item);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = item.InvId }, item);
    }

    // UPDATE - Modify item
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, InventoryMaster updatedItem)
    {
        if (id != updatedItem.InvId) return BadRequest();

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
}