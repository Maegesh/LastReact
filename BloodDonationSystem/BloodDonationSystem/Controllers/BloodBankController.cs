using BloodDonationSystem.Dtos;
using BloodDonationSystem.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace BloodDonationSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BloodBankController : ControllerBase
    {
        private readonly BloodBankService _bloodBankService;

        public BloodBankController(BloodBankService bloodBankService)
        {
            _bloodBankService = bloodBankService;
        }

        [HttpGet]
        [Authorize(Roles = "0,1")] 
        public async Task<ActionResult<IEnumerable<BloodBankResponseDto>>> GetAllBloodBanks()
        {
            try
            {
                var bloodBanks = await _bloodBankService.GetAllBloodBanks();
                return Ok(bloodBanks);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", details = ex.Message });
            }
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<BloodBankResponseDto>> GetBloodBankById(int id)
        {
            try
            {
                if (id <= 0)
                    return BadRequest(new { message = "Invalid blood bank ID" });

                var bloodBank = await _bloodBankService.GetBloodBankById(id);
                return Ok(bloodBank);
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

        [HttpGet("location/{location}")]
        public async Task<ActionResult<IEnumerable<BloodBankResponseDto>>> GetBloodBanksByLocation(string location)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(location))
                    return BadRequest(new { message = "Location cannot be empty" });

                var bloodBanks = await _bloodBankService.GetBloodBanksByLocation(location);
                return Ok(bloodBanks);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", details = ex.Message });
            }
        }

        [HttpPost]
        [Authorize(Roles = "0")]
        public async Task<ActionResult<BloodBankResponseDto>> CreateBloodBank([FromBody] BloodBankCreateDto bloodBankDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var created = await _bloodBankService.CreateBloodBank(bloodBankDto);
                return CreatedAtAction(nameof(GetBloodBankById), new { id = created.Id }, created);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", details = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "0")]
        public async Task<ActionResult<BloodBankResponseDto>> UpdateBloodBank(int id, [FromBody] BloodBankUpdateDto bloodBankDto)
        {
            try
            {
                if (id <= 0)
                    return BadRequest(new { message = "Invalid blood bank ID" });

                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var updated = await _bloodBankService.UpdateBloodBank(id, bloodBankDto);
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

        [HttpDelete("{id}")]
        [Authorize(Roles = "0")]
        public async Task<ActionResult<BloodBankResponseDto>> DeleteBloodBank(int id)
        {
            try
            {
                if (id <= 0)
                    return BadRequest(new { message = "Invalid blood bank ID" });

                var deleted = await _bloodBankService.DeleteBloodBank(id);
                return Ok(deleted);
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
