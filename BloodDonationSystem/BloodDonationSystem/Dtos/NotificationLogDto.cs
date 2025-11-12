using System.ComponentModel.DataAnnotations;

namespace BloodDonationSystem.Dtos
{
    public class NotificationLogCreateDto
    {
        [Required(ErrorMessage = "UserId is required")]
        public int UserId { get; set; }

        [Required(ErrorMessage = "Message is required")]
        [StringLength(250, MinimumLength = 5, ErrorMessage = "Message must be between 5 and 250 characters")]
        public string Message { get; set; } = null!;
    }

    public class NotificationLogResponseDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; } = null!;
        public string Message { get; set; } = null!;
        public bool IsRead { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}