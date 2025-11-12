using System.ComponentModel.DataAnnotations;
using BloodBankSystem.Models;

namespace BloodDonationSystem.Dtos
{
    public class UserCreateDto
    {
        [Required(ErrorMessage = "First Name is required")]
        [StringLength(50, ErrorMessage = "First Name cannot exceed 50 characters")]
        public string FirstName { get; set; } = null!;

        [StringLength(50, ErrorMessage = "Last Name cannot exceed 50 characters")]
        public string? LastName { get; set; }

        [Required(ErrorMessage = "Username is required")]
        [StringLength(50, ErrorMessage = "Username cannot exceed 50 characters")]
        public string Username { get; set; } = null!;

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid Email format")]
        [StringLength(100, ErrorMessage = "Email cannot exceed 100 characters")]
        public string Email { get; set; } = null!;

        [Phone(ErrorMessage = "Invalid phone number format")]
        [StringLength(15, ErrorMessage = "Phone cannot exceed 15 digits")]
        public string? Phone { get; set; }

        [Required(ErrorMessage = "Password is required")]
        [StringLength(255, MinimumLength = 6, ErrorMessage = "Password must be between 6 and 255 characters")]
        public string Password { get; set; } = null!;

        [Required(ErrorMessage = "Role is required")]
        public UserRole Role { get; set; }
    }

    public class UserUpdateDto
    {
        [StringLength(50, ErrorMessage = "First Name cannot exceed 50 characters")]
        public string? FirstName { get; set; }

        [StringLength(50, ErrorMessage = "Last Name cannot exceed 50 characters")]
        public string? LastName { get; set; }

        [Phone(ErrorMessage = "Invalid phone number format")]
        [StringLength(15, ErrorMessage = "Phone cannot exceed 15 digits")]
        public string? Phone { get; set; }

        [Url(ErrorMessage = "Invalid URL format")]
        public string? ProfileImageUrl { get; set; }
    }

    public class UserResponseDto
    {
        public int Id { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string Username { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string? Phone { get; set; }
        public UserRole Role { get; set; }
        public string? ProfileImageUrl { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}