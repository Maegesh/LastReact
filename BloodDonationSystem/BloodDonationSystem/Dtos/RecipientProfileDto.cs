using System.ComponentModel.DataAnnotations;

namespace BloodDonationSystem.Dtos
{
    public class RecipientProfileCreateDto
    {
        [Required(ErrorMessage = "User ID is required")]
        public int UserId { get; set; }

        [Required(ErrorMessage = "Hospital Name is required")]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "Hospital Name must be between 3 and 100 characters")]
        public string HospitalName { get; set; } = null!;

        [Required(ErrorMessage = "Patient Name is required")]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "Patient Name must be between 2 and 100 characters")]
        public string PatientName { get; set; } = null!;

        [Required(ErrorMessage = "Blood Group is required")]
        [StringLength(5, ErrorMessage = "Blood Group cannot exceed 5 characters")]
        [RegularExpression("^(A|B|AB|O)[+-]$", ErrorMessage = "Invalid Blood Group format (e.g., A+, O-, AB+)")]
        public string RequiredBloodGroup { get; set; } = null!;

        [Required(ErrorMessage = "Contact Number is required")]
        [RegularExpression(@"^\d{10,15}$", ErrorMessage = "Contact number must be between 10 to 15 digits only")]
        public string ContactNumber { get; set; } = null!;
    }

    public class RecipientSignupDto
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

        [Required(ErrorMessage = "Hospital Name is required")]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "Hospital Name must be between 3 and 100 characters")]
        public string HospitalName { get; set; } = null!;

        [Required(ErrorMessage = "Blood Group is required")]
        [StringLength(5, ErrorMessage = "Blood Group cannot exceed 5 characters")]
        [RegularExpression("^(A|B|AB|O)[+-]$", ErrorMessage = "Invalid Blood Group format (e.g., A+, O-, AB+)")]
        public string RequiredBloodGroup { get; set; } = null!;

        [Required(ErrorMessage = "Contact Number is required")]
        [RegularExpression(@"^\d{10,15}$", ErrorMessage = "Contact number must be between 10 to 15 digits only")]
        public string ContactNumber { get; set; } = null!;
    }

    public class RecipientProfileUpdateDto
    {
        [StringLength(100, MinimumLength = 3, ErrorMessage = "Hospital Name must be between 3 and 100 characters")]
        public string? HospitalName { get; set; }

        [StringLength(100, MinimumLength = 2, ErrorMessage = "Patient Name must be between 2 and 100 characters")]
        public string? PatientName { get; set; }

        [StringLength(5, ErrorMessage = "Blood Group cannot exceed 5 characters")]
        [RegularExpression("^(A|B|AB|O)[+-]$", ErrorMessage = "Invalid Blood Group format")]
        public string? RequiredBloodGroup { get; set; }

        [RegularExpression(@"^\d{10,15}$", ErrorMessage = "Contact number must be between 10 to 15 digits only")]
        public string? ContactNumber { get; set; }
    }

    public class RecipientProfileResponseDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; } = null!;
        public string HospitalName { get; set; } = null!;
        public string PatientName { get; set; } = null!;
        public string RequiredBloodGroup { get; set; } = null!;
        public string ContactNumber { get; set; } = null!;
        public int TotalBloodRequests { get; set; }
    }
}