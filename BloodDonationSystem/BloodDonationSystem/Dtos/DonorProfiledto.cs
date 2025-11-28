using System.ComponentModel.DataAnnotations;
using BloodDonationSystem.Attributes;

namespace BloodDonationSystem.Dtos
{
    public class DonorProfileCreateDto
    {
        [Required(ErrorMessage = "First Name is required")]
        [StringLength(50, MinimumLength = 2, ErrorMessage = "First Name must be between 2 and 50 characters")]
        public string FirstName { get; set; } = null!;

        [Required(ErrorMessage = "Last Name is required")]
        [StringLength(50, MinimumLength = 2, ErrorMessage = "Last Name must be between 2 and 50 characters")]
        public string LastName { get; set; } = null!;

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string Email { get; set; } = null!;

        [Required(ErrorMessage = "Password is required")]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "Password must be at least 6 characters")]
        public string Password { get; set; } = null!;

        [Required(ErrorMessage = "Contact Number is required")]
        [RegularExpression(@"^[0-9]{10,15}$", ErrorMessage = "Contact number must be 10-15 digits only")]
        public string ContactNumber { get; set; } = null!;

        [Required(ErrorMessage = "Blood group is required")]
        [StringLength(5, ErrorMessage = "Blood group must be 5 characters or less")]
        [RegularExpression("^(A|B|AB|O)[+-]$", ErrorMessage = "Invalid Blood Group format (e.g., A+, O-, AB+)")]
        public string BloodGroup { get; set; } = null!;

        [Required(ErrorMessage = "Age is required")]
        [Range(18, 65, ErrorMessage = "Donor age must be between 18 and 65 years")]
        public int Age { get; set; }

        [Required(ErrorMessage = "Gender is required")]
        [RegularExpression("^(Male|Female|Other)$", ErrorMessage = "Gender must be Male, Female, or Other")]
        public string Gender { get; set; } = null!;

        [DataType(DataType.Date)]
        [DateNotInFuture(ErrorMessage = "Last donation date cannot be in the future")]
        public DateTime? LastDonationDate { get; set; }
    }

    public class DonorProfileUpdateDto
    {
        [StringLength(50, MinimumLength = 2, ErrorMessage = "First Name must be between 2 and 50 characters")]
        public string? FirstName { get; set; }

        [StringLength(50, MinimumLength = 2, ErrorMessage = "Last Name must be between 2 and 50 characters")]
        public string? LastName { get; set; }

        [EmailAddress(ErrorMessage = "Invalid email format")]
        public string? Email { get; set; }

        [RegularExpression(@"^[0-9]{10,15}$", ErrorMessage = "Contact number must be 10-15 digits only")]
        public string? ContactNumber { get; set; }

        [StringLength(5, ErrorMessage = "Blood group must be 5 characters or less")]
        [RegularExpression("^(A|B|AB|O)[+-]$", ErrorMessage = "Invalid Blood Group format")]
        public string? BloodGroup { get; set; }

        [Range(18, 65, ErrorMessage = "Donor age must be between 18 and 65 years")]
        public int? Age { get; set; }

        [MaxLength(10, ErrorMessage = "Gender cannot exceed 10 characters")]
        public string? Gender { get; set; }

        [DataType(DataType.Date)]
        [DateNotInFuture(ErrorMessage = "Last donation date cannot be in the future")]
        public DateTime? LastDonationDate { get; set; }
    }

    public class DonorProfileResponseDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; } = null!;
        public string BloodGroup { get; set; } = null!;
        public int Age { get; set; }
        public string Gender { get; set; } = null!;
        public DateTime? LastDonationDate { get; set; }
        public bool EligibilityStatus { get; set; }
        public int TotalDonations { get; set; }
        public int UpcomingAppointments { get; set; }
    }
}
