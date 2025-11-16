using System.ComponentModel.DataAnnotations;

namespace BloodDonationSystem.Dtos
{
    public class BloodRequestCreateDto
    {
        [Required(ErrorMessage = "Recipient ID is required")]
        public int RecipientId { get; set; }

        [Required(ErrorMessage = "Blood group is required")]
        [StringLength(5, ErrorMessage = "Blood group cannot exceed 5 characters")]
        [RegularExpression("^(A|B|AB|O)[+-]$", ErrorMessage = "Invalid Blood Group format (e.g., A+, O-, AB+)")]
        public string BloodGroupNeeded { get; set; } = null!;

        [Required(ErrorMessage = "Quantity is required")]
        [Range(1, 10, ErrorMessage = "Quantity must be between 1 and 10 units")]
        public int Quantity { get; set; }
    }

    public class BloodRequestUpdateDto
    {
        [Required(ErrorMessage = "Status is required")]
        [StringLength(20, ErrorMessage = "Status cannot exceed 20 characters")]
        [RegularExpression("^(Pending|Approved|Fulfilled|Cancelled)$", ErrorMessage = "Status must be Pending, Approved, Fulfilled, or Cancelled")]
        public string Status { get; set; } = null!;
    }

    public class BloodRequestResponseDto
    {
        public int Id { get; set; }
        public int RecipientId { get; set; }
        public string RecipientName { get; set; } = null!;
        public string HospitalName { get; set; } = null!;
        public string BloodGroupNeeded { get; set; } = null!;
        public int Quantity { get; set; }
        public DateTime RequestDate { get; set; }
        public string Status { get; set; } = null!;
        public int LinkedDonorsCount { get; set; }
    }

    public class FulfillBloodRequestDto
    {
        [Required(ErrorMessage = "Donor ID is required")]
        public int DonorId { get; set; }
    }

    public class DonorResponseDto
    {
        [Required(ErrorMessage = "Donor ID is required")]
        public int DonorId { get; set; }

        [Required(ErrorMessage = "Response is required")]
        [RegularExpression("^(accept|decline)$", ErrorMessage = "Response must be 'accept' or 'decline'")]
        public string Response { get; set; } = null!;
    }
}