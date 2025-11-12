using BloodDonationSystem.Dtos;
using BloodDonationSystem.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace BloodDonationSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BloodStockController : ControllerBase
    {
        private readonly BloodStockService _bloodStockService;

        public BloodStockController(BloodStockService bloodStockService)
        {
            _bloodStockService = bloodStockService;
        }

        [HttpGet]
        [Authorize(Roles = "0,1")]
        public async Task<ActionResult<IEnumerable<BloodStockResponseDto>>> GetAllBloodStocks()
        {
            try
            {
                var stocks = await _bloodStockService.GetAllBloodStocks();
                return Ok(stocks);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", details = ex.Message });
            }
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<BloodStockResponseDto>> GetBloodStockById(int id)
        {
            try
            {
                if (id <= 0)
                    return BadRequest(new { message = "Invalid blood stock ID" });

                var stock = await _bloodStockService.GetBloodStockById(id);
                return Ok(stock);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", details = ex.Message });
            }
        }

        [HttpGet("blood-group/{bloodGroup}")]
        [Authorize(Roles = "0,1")]
        public async Task<ActionResult<IEnumerable<BloodStockResponseDto>>> GetBloodStocksByBloodGroup(string bloodGroup)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(bloodGroup))
                    return BadRequest(new { message = "Blood group cannot be empty" });

                var stocks = await _bloodStockService.GetBloodStocksByBloodGroup(bloodGroup);
                return Ok(stocks);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", details = ex.Message });
            }
        }

        [HttpPost]
        [Authorize(Roles = "0")]
        public async Task<ActionResult<BloodStockResponseDto>> CreateBloodStock([FromBody] BloodStockCreateDto stockDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var created = await _bloodStockService.CreateBloodStock(stockDto);
                return CreatedAtAction(nameof(GetBloodStockById), new { id = created.Id }, created);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", details = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "0")]
        public async Task<ActionResult<BloodStockResponseDto>> UpdateBloodStock(int id, [FromBody] BloodStockUpdateDto stockDto)
        {
            try
            {
                if (id <= 0)
                    return BadRequest(new { message = "Invalid blood stock ID" });

                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var updated = await _bloodStockService.UpdateBloodStock(id, stockDto);
                return Ok(updated);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", details = ex.Message });
            }
        }
    }
}
