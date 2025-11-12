using BloodDonationSystem.Dtos;
using BloodDonationSystem.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace BloodDonationSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DonationRecordController : ControllerBase
    {
        private readonly DonationRecordService _donationService;

        public DonationRecordController(DonationRecordService donationService)
        {
            _donationService = donationService;
        }

        [HttpGet]
        [Authorize(Roles = "0")]
        public async Task<ActionResult<IEnumerable<DonationRecordResponseDto>>> GetAllDonations()
        {
            try
            {
                var donations = await _donationService.GetAllDonations();
                return Ok(donations);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", details = ex.Message });
            }
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<DonationRecordResponseDto>> GetDonationById(int id)
        {
            try
            {
                if (id <= 0)
                    return BadRequest(new { message = "Invalid donation ID" });

                var donation = await _donationService.GetDonationById(id);
                return Ok(donation);
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

        [HttpGet("donor/{donorId}")]
        [Authorize(Roles = "0,1")] // Admin or Donor
        public async Task<ActionResult<IEnumerable<DonationRecordResponseDto>>> GetDonationsByDonor(int donorId)
        {
            try
            {
                if (donorId <= 0)
                    return BadRequest(new { message = "Invalid donor ID" });

                var donations = await _donationService.GetDonationsByDonor(donorId);
                return Ok(donations);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", details = ex.Message });
            }
        }

        [HttpPost]
        [Authorize(Roles = "0")] 
        public async Task<ActionResult<DonationRecordResponseDto>> CreateDonation([FromBody] DonationRecordCreateDto donationDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var created = await _donationService.CreateDonation(donationDto);
                return CreatedAtAction(nameof(GetDonationById), new { id = created.Id }, created);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", details = ex.Message });
            }
        }
    }
}
