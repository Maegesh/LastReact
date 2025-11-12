using System.ComponentModel.DataAnnotations;

namespace BloodDonationSystem.Dtos
{
    public class BloodStockCreateDto
    {
        [Required(ErrorMessage = "BloodBankId is required")]
        public int BloodBankId { get; set; }

        [Required(ErrorMessage = "Blood group is required")]
        [StringLength(5, ErrorMessage = "Blood group cannot exceed 5 characters")]
        [RegularExpression("^(A|B|AB|O)[+-]$", ErrorMessage = "Invalid Blood Group format (e.g., A+, O-, AB+)")]
        public string BloodGroup { get; set; } = null!;

        [Required(ErrorMessage = "Units available is required")]
        [Range(0, 500, ErrorMessage = "Units available must be between 0 and 500")]
        public int UnitsAvailable { get; set; }
    }

    public class BloodStockUpdateDto
    {
        [Range(0, 500, ErrorMessage = "Units available must be between 0 and 500")]
        public int? UnitsAvailable { get; set; }
    }

    public class BloodStockResponseDto
    {
        public int Id { get; set; }
        public int BloodBankId { get; set; }
        public string BloodBankName { get; set; } = null!;
        public string BloodGroup { get; set; } = null!;
        public int UnitsAvailable { get; set; }
        public DateTime LastUpdated { get; set; }
        public string AvailabilityStatus { get; set; } = null!;
    }
}