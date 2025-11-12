using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BloodBankSystem.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "First Name is required")]
        [StringLength(50)]
        public string? FirstName { get; set; }

        [StringLength(50, ErrorMessage = "Last Name cannot exceed 50 characters")]
        public string? LastName { get; set; }

        [Required(ErrorMessage = "Username is required")]
        [StringLength(50)]
        public string Username { get; set; } = null!;

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid Email Address format")]
        [StringLength(100)]
        public string Email { get; set; } = null!;

        [Phone(ErrorMessage = "Invalid phone number format")]
        [StringLength(15, ErrorMessage = "Phone number cannot exceed 15 digits")]
        public string? Phone { get; set; }

        [Required(ErrorMessage = "Password is required")]
        [StringLength(255)]
        public string PasswordHash { get; set; } = null!;

        [Required(ErrorMessage = "Role is required")]
        public UserRole Role { get; set; }

        [Url(ErrorMessage = "Invalid URL format for Profile Image")]
        public string? ProfileImageUrl { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // Navigation Properties
        public DonorProfile? DonorProfile { get; set; }
        public RecipientProfile? RecipientProfile { get; set; }
        public ICollection<NotificationLog>? Notifications { get; set; }
    }
}
