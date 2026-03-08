using InventoryAPI.Data;
using InventoryAPI.Models;
using Microsoft.AspNetCore.Mvc;


namespace InventoryAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GoodsTypeController : Controller
    {
        private readonly AppDbContext _context;

        public GoodsTypeController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("addGoodsGST")]
        public IActionResult AddGoodsTypeGST([FromBody] GoodsTypeGST model)
        {
            if (model == null)
                return BadRequest("Invalid data.");

            _context.GoodsTypeGSTs.Add(model);
            _context.SaveChanges();

            return Ok("Record saved successfully");
        }

        [HttpGet("GetAllGoodsType")]
        public ActionResult<IEnumerable<GoodsTypeGST>> GetAllGoodsTypes()
        {
            var goodsTypes = _context.GoodsTypeGSTs
                                 .OrderBy(g => g.GoodsType) // sort alphabetically
                                 .ToList();

            if (goodsTypes == null || !goodsTypes.Any())
            {
                return NotFound("No goods types found.");
            }
            return Ok(goodsTypes);
        }

    }
}