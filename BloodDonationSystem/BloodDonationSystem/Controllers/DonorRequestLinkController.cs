using BloodDonationSystem.Dtos;
using BloodDonationSystem.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.ComponentModel.DataAnnotations;

namespace BloodDonationSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DonorRequestLinkController : ControllerBase
    {
        private readonly DonorRequestLinkService _linkService;

        public DonorRequestLinkController(DonorRequestLinkService linkService)
        {
            _linkService = linkService;
        }

        [HttpGet("donor/{donorId}")]
        [Authorize(Roles = "0,1")] 
        public async Task<ActionResult<IEnumerable<DonorRequestLinkResponseDto>>> GetLinksByDonor(int donorId)
        {
            try
            {
                if (donorId <= 0)
                    return BadRequest(new { message = "Invalid donor ID" });

                var links = await _linkService.GetLinksByDonor(donorId);
                return Ok(links);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", details = ex.Message });
            }
        }

        [HttpGet("request/{requestId}")]
        [Authorize(Roles = "0,2")] 
        public async Task<ActionResult<IEnumerable<DonorRequestLinkResponseDto>>> GetLinksByRequest(int requestId)
        {
            try
            {
                if (requestId <= 0)
                    return BadRequest(new { message = "Invalid request ID" });

                var links = await _linkService.GetLinksByRequest(requestId);
                return Ok(links);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", details = ex.Message });
            }
        }

        [HttpPost]
        [Authorize(Roles = "0")]
        public async Task<ActionResult<DonorRequestLinkResponseDto>> CreateLink([FromBody] DonorRequestLinkCreateDto linkDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var created = await _linkService.CreateLink(linkDto);
                return Ok(created);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", details = ex.Message });
            }
        }

        [HttpPost("{linkId}/respond")]
        [Authorize(Roles = "1")]
        public async Task<ActionResult> RespondToRequest(int linkId, [FromBody] DonorResponseDto responseDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                await _linkService.RespondToRequest(linkId, responseDto.ResponseStatus);
                return Ok(new { message = $"Response '{responseDto.ResponseStatus}' recorded successfully" });
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

        [HttpGet("donor/{donorId}/pending")]
        [Authorize(Roles = "1")]
        public async Task<ActionResult> GetPendingRequests(int donorId)
        {
            try
            {
                var pendingRequests = await _linkService.GetPendingRequestsForDonor(donorId);
                return Ok(pendingRequests);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", details = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "0")]
        public async Task<ActionResult<DonorRequestLinkResponseDto>> DeleteLink(int id)
        {
            try
            {
                if (id <= 0)
                    return BadRequest(new { message = "Invalid link ID" });

                var deleted = await _linkService.DeleteLink(id);
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

    public class DonorResponseDto
    {
        [Required]
        [RegularExpression("^(Accepted|Declined)$", ErrorMessage = "Response must be 'Accepted' or 'Declined'")]
        public string ResponseStatus { get; set; } = null!;
    }
}
