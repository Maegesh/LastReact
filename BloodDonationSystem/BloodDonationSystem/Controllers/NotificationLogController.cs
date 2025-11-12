using BloodDonationSystem.Dtos;
using BloodDonationSystem.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace BloodDonationSystem.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationLogController : ControllerBase
    {
        private readonly NotificationLogService _notificationService;

        public NotificationLogController(NotificationLogService notificationService)
        {
            _notificationService = notificationService;
        }

        [HttpGet]
        [Authorize(Roles = "0")]
        public async Task<ActionResult<IEnumerable<NotificationLogResponseDto>>> GetAllNotifications()
        {
            try
            {
                var notifications = await _notificationService.GetAllNotifications();
                return Ok(notifications);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", details = ex.Message });
            }
        }

        [HttpGet("user/{userId}")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<NotificationLogResponseDto>>> GetNotificationsByUserId(int userId)
        {
            try
            {
                if (userId <= 0)
                    return BadRequest(new { message = "Invalid user ID" });

                // Validate user can only access their own notifications or admin can access all
                var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
                
                if (userId != currentUserId && userRole != "0")
                    return Forbid("You can only access your own notifications");

                var notifications = await _notificationService.GetNotificationsByUserId(userId);
                return Ok(notifications);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", details = ex.Message });
            }
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<NotificationLogResponseDto>> GetNotificationById(int id)
        {
            try
            {
                if (id <= 0)
                    return BadRequest(new { message = "Invalid notification ID" });

                var notification = await _notificationService.GetNotificationById(id);
                return Ok(notification);
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
        public async Task<ActionResult<NotificationLogResponseDto>> CreateNotification([FromBody] NotificationLogCreateDto notificationDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var created = await _notificationService.CreateNotification(notificationDto);
                return CreatedAtAction(nameof(GetNotificationById), new { id = created.Id }, created);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", details = ex.Message });
            }
        }

        [HttpPut("{id}/read")]
        [Authorize]
        public async Task<ActionResult<NotificationLogResponseDto>> MarkAsRead(int id)
        {
            try
            {
                if (id <= 0)
                    return BadRequest(new { message = "Invalid notification ID" });

                var updated = await _notificationService.MarkAsRead(id);
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

        [HttpGet("unread/{userId}")]
        [Authorize]
        public async Task<ActionResult<int>> GetUnreadCount(int userId)
        {
            try
            {
                if (userId <= 0)
                    return BadRequest(new { message = "Invalid user ID" });

                // Validate user can only access their own unread count or admin can access all
                var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
                var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
                
                if (userId != currentUserId && userRole != "0")
                    return Forbid("You can only access your own unread count");

                var count = await _notificationService.GetUnreadCount(userId);
                return Ok(new { unreadCount = count });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error", details = ex.Message });
            }
        }
    }
}
