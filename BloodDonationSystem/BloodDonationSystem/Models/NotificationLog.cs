using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BloodBankSystem.Models
{
    public class NotificationLog
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "UserId is required")]
        [ForeignKey("User")]
        public int UserId { get; set; }

        [Required(ErrorMessage = "Message content is required")]
        [StringLength(250, MinimumLength = 5, ErrorMessage = "Message must be between 5 and 250 characters")]
        public string Message { get; set; } = null!;

        [Required]
        public bool IsRead { get; set; } = false;

        [Required]
        [DataType(DataType.DateTime)]
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // Navigation property
        public User? User { get; set; }
    }
}
