using BloodDonationSystem.Dtos;
using BloodDonationSystem.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace BloodDonationSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecipientProfileController : ControllerBase
    {
        private readonly RecipientProfileService _recipientService;

        public RecipientProfileController(RecipientProfileService recipientService)
        {
            _recipientService = recipientService;
        }

        [HttpGet]
        [Authorize(Roles = "0")]
        public async Task<ActionResult<IEnumerable<RecipientProfileResponseDto>>> GetAllRecipients()
        {
            try
            {
                var recipients = await _recipientService.GetAllRecipients();
                return Ok(recipients);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", details = ex.Message });
            }
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<RecipientProfileResponseDto>> GetRecipientById(int id)
        {
            try
            {
                if (id <= 0)
                    return BadRequest(new { message = "Invalid recipient ID" });

                var recipient = await _recipientService.GetRecipientById(id);
                return Ok(recipient);
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

        [HttpPost]
        [Authorize(Roles = "2")] 
        public async Task<ActionResult<RecipientProfileResponseDto>> CreateRecipient([FromBody] RecipientProfileCreateDto recipientDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var created = await _recipientService.CreateRecipient(recipientDto);
                return CreatedAtAction(nameof(GetRecipientById), new { id = created.Id }, created);
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

        [HttpGet("user/{userId}")]
        [Authorize(Roles = "2")] // Recipients only
        public async Task<ActionResult<RecipientProfileResponseDto>> GetRecipientByUserId(int userId)
        {
            try
            {
                if (userId <= 0)
                    return BadRequest(new { message = "Invalid user ID" });

                var recipient = await _recipientService.GetRecipientByUserId(userId);
                return Ok(recipient);
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

        [HttpPut("{id}")]
        [Authorize(Roles = "0,2")] // Admin or Recipient (with validation)
        public async Task<ActionResult<RecipientProfileResponseDto>> UpdateRecipient(int id, [FromBody] RecipientProfileUpdateDto recipientDto)
        {
            try
            {
                if (id <= 0)
                    return BadRequest(new { message = "Invalid recipient ID" });

                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var updated = await _recipientService.UpdateRecipient(id, recipientDto);
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
