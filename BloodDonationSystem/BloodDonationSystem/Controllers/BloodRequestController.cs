using BloodDonationSystem.Dtos;
using BloodDonationSystem.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace BloodDonationSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BloodRequestController : ControllerBase
    {
        private readonly BloodRequestService _bloodRequestService;

        public BloodRequestController(BloodRequestService bloodRequestService)
        {
            _bloodRequestService = bloodRequestService;
        }

        [HttpGet]
        [Authorize(Roles = "0")]
        public async Task<ActionResult<IEnumerable<BloodRequestResponseDto>>> GetAllBloodRequests()
        {
            try
            {
                var requests = await _bloodRequestService.GetAllBloodRequests();
                return Ok(requests);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", details = ex.Message });
            }
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<BloodRequestResponseDto>> GetBloodRequestById(int id)
        {
            try
            {
                if (id <= 0)
                    return BadRequest(new { message = "Invalid blood request ID" });

                var request = await _bloodRequestService.GetBloodRequestById(id);
                return Ok(request);
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

        [HttpGet("recipient/{recipientId}")]
        [Authorize(Roles = "0,2")]
        public async Task<ActionResult<IEnumerable<BloodRequestResponseDto>>> GetBloodRequestsByRecipient(int recipientId)
        {
            try
            {
                if (recipientId <= 0)
                    return BadRequest(new { message = "Invalid recipient ID" });

                var requests = await _bloodRequestService.GetBloodRequestsByRecipient(recipientId);
                return Ok(requests);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", details = ex.Message });
            }
        }

        [HttpGet("blood-group/{bloodGroup}")]
        [Authorize(Roles = "0,1")]
        public async Task<ActionResult<IEnumerable<BloodRequestResponseDto>>> GetBloodRequestsByBloodGroup(string bloodGroup)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(bloodGroup))
                    return BadRequest(new { message = "Blood group cannot be empty" });

                var requests = await _bloodRequestService.GetBloodRequestsByBloodGroup(bloodGroup);
                return Ok(requests);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", details = ex.Message });
            }
        }

        [HttpGet("pending")]
        [Authorize(Roles = "0")]
        public async Task<ActionResult<IEnumerable<BloodRequestResponseDto>>> GetPendingBloodRequests()
        {
            try
            {
                var requests = await _bloodRequestService.GetPendingBloodRequests();
                return Ok(requests);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", details = ex.Message });
            }
        }

        [HttpPost]
        [Authorize(Roles = "2")]
        public async Task<ActionResult<BloodRequestResponseDto>> CreateBloodRequest([FromBody] BloodRequestCreateDto requestDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var created = await _bloodRequestService.CreateBloodRequest(requestDto);
                return CreatedAtAction(nameof(GetBloodRequestById), new { id = created.Id }, created);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", details = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "0,2")]
        public async Task<ActionResult<BloodRequestResponseDto>> UpdateBloodRequest(int id, [FromBody] BloodRequestUpdateDto requestDto)
        {
            try
            {
                if (id <= 0)
                    return BadRequest(new { message = "Invalid blood request ID" });

                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var updated = await _bloodRequestService.UpdateBloodRequest(id, requestDto);
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
        public async Task<ActionResult<BloodRequestResponseDto>> DeleteBloodRequest(int id)
        {
            try
            {
                if (id <= 0)
                    return BadRequest(new { message = "Invalid blood request ID" });

                var deleted = await _bloodRequestService.DeleteBloodRequest(id);
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

        [HttpPost("{id}/fulfill")]
        [Authorize(Roles = "0")]
        public async Task<ActionResult<BloodRequestResponseDto>> FulfillBloodRequest(int id, [FromBody] FulfillBloodRequestDto fulfillDto)
        {
            try
            {
                if (id <= 0)
                    return BadRequest(new { message = "Invalid blood request ID" });

                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var fulfilled = await _bloodRequestService.FulfillBloodRequest(id, fulfillDto.DonorId);
                return Ok(fulfilled);
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
