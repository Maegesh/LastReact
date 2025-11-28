using BloodDonationSystem.Dtos;
using BloodDonationSystem.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace BloodDonationSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DonorProfileController : ControllerBase
    {
        private readonly DonorProfileService _donorService;

        public DonorProfileController(DonorProfileService donorService)
        {
            _donorService = donorService;
        }

        [HttpGet]
        [Authorize(Roles = "0")]
        public async Task<ActionResult<List<DonorProfileResponseDto>>> GetAllDonors()
        {
            try
            {
                var donors = await _donorService.GetAllDonors();
                return Ok(donors);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", details = ex.Message });
            }
        }

        [HttpGet("{id}")] 
        [Authorize]
        public async Task<ActionResult<DonorProfileResponseDto>> GetDonorById(int id)
        {
            try
            {
                if (id <= 0)
                    return BadRequest(new { message = "Invalid donor ID" });

                var donor = await _donorService.GetDonorById(id);
                return Ok(donor);
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
        [Authorize(Roles = "0")]
        public async Task<ActionResult<DonorProfileResponseDto>> CreateDonor([FromBody] DonorProfileCreateDto donorDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var created = await _donorService.CreateDonor(donorDto);
                return CreatedAtAction(nameof(GetDonorById), new { id = created.Id }, created);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", details = ex.Message });
            }
        }

        [HttpGet("user/{userId}")]
        [Authorize(Roles = "1")] // Only donors can access
        public async Task<ActionResult<DonorProfileResponseDto>> GetDonorByUserId(int userId)
        {
            try
            {
                if (userId <= 0)
                    return BadRequest(new { message = "Invalid user ID" });

                var donors = await _donorService.GetAllDonors();
                var donor = donors.FirstOrDefault(d => d.UserId == userId);
                
                if (donor == null)
                    return NotFound(new { message = "Donor profile not found" });
                    
                return Ok(donor);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", details = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "0,1")] 
        public async Task<ActionResult<DonorProfileResponseDto>> UpdateDonor(int id, [FromBody] DonorProfileUpdateDto donorDto)
        {
            try
            {
                if (id <= 0)
                    return BadRequest(new { message = "Invalid donor ID" });

                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var updated = await _donorService.UpdateDonor(id, donorDto);
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

        [HttpPost("get-by-user")]
        [Authorize(Roles = "1")] // Only donors can access
        public async Task<ActionResult<DonorProfileResponseDto>> GetDonorByUserIdPayload([FromBody] UserIdPayload payload)
        {
            try
            {
                if (payload.UserId <= 0)
                    return BadRequest(new { message = "Invalid user ID" });

                var donors = await _donorService.GetAllDonors();
                var donor = donors.FirstOrDefault(d => d.UserId == payload.UserId);
                
                if (donor == null)
                    return NotFound(new { message = "Donor profile not found" });
                    
                return Ok(donor);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", details = ex.Message });
            }
        }

        [HttpPost("overview")]
        [Authorize(Roles = "1")] // Only donors can access
        public async Task<ActionResult> GetDonorOverview([FromBody] UserIdPayload payload)
        {
            try
            {
                if (payload.UserId <= 0)
                    return BadRequest(new { message = "Invalid user ID" });

                var overview = await _donorService.GetDonorOverview(payload.UserId);
                return Ok(overview);
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
