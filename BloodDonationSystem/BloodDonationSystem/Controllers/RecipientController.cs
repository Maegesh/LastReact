using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using BloodDonationSystem.Services;

namespace BloodDonationSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecipientController : ControllerBase
    {
        private readonly RecipientProfileService _recipientService;
        private readonly BloodRequestService _bloodRequestService;
        private readonly UserService _userService;

        public RecipientController(
            RecipientProfileService recipientService,
            BloodRequestService bloodRequestService,
            UserService userService)
        {
            _recipientService = recipientService;
            _bloodRequestService = bloodRequestService;
            _userService = userService;
        }

        [HttpPost("overview")]
        [Authorize(Roles = "2")]
        public async Task<ActionResult> GetRecipientOverview([FromBody] UserIdPayload payload)
        {
            try
            {
                if (payload.UserId <= 0)
                    return BadRequest(new { message = "Invalid user ID" });

                // Get recipient profile
                var recipients = await _recipientService.GetAllRecipients();
                var recipient = recipients.FirstOrDefault(r => r.UserId == payload.UserId);
                
                if (recipient == null)
                    return NotFound(new { message = "Recipient profile not found" });

                // Get blood requests for this recipient
                var allRequests = await _bloodRequestService.GetAllBloodRequests();
                var userRequests = allRequests.Where(r => r.RecipientId == recipient.Id).ToList();

                // Get updated user data
                var user = await _userService.GetUserById(payload.UserId);

                var overview = new
                {
                    profile = recipient,
                    user = user,
                    stats = new
                    {
                        totalRequests = userRequests.Count(),
                        pendingRequests = userRequests.Count(r => r.Status == "Pending"),
                        completedRequests = userRequests.Count(r => r.Status == "Fulfilled")
                    },
                    bloodRequests = userRequests
                };

                return Ok(overview);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", details = ex.Message });
            }
        }
    }

    public class UserIdPayload
    {
        public int UserId { get; set; }
    }
}