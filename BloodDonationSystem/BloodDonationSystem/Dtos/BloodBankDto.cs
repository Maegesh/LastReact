using System.ComponentModel.DataAnnotations;

namespace BloodDonationSystem.Dtos
{
    public class BloodBankCreateDto
    {
        [Required(ErrorMessage = "Blood bank name is required")]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "Name must be between 3 and 100 characters")]
        public string Name { get; set; } = null!;

        [Required(ErrorMessage = "Location is required")]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "Location must be between 3 and 100 characters")]
        public string Location { get; set; } = null!;

        [Required(ErrorMessage = "Contact number is required")]
        [Phone(ErrorMessage = "Invalid contact number format")]
        public string ContactNumber { get; set; } = null!;

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        [StringLength(100, ErrorMessage = "Email cannot exceed 100 characters")]
        public string Email { get; set; } = null!;

        [Required(ErrorMessage = "Capacity is required")]
        [Range(1, 10000, ErrorMessage = "Capacity must be between 1 and 10,000 units")]
        public int Capacity { get; set; }
    }

    public class BloodBankUpdateDto
    {
        [Required(ErrorMessage = "Capacity is required")]
        [Range(1, 10000, ErrorMessage = "Capacity must be between 1 and 10,000 units")]
        public int Capacity { get; set; }
    }

    public class BloodBankResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Location { get; set; } = null!;
        public string ContactNumber { get; set; } = null!;
        public string Email { get; set; } = null!;
        public int Capacity { get; set; }
        public int TotalBloodStocks { get; set; }
        public int TotalDonations { get; set; }
    }
}