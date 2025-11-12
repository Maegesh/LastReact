using System.ComponentModel.DataAnnotations;

namespace BloodDonationSystem.Dtos
{
    public class DonationRecordCreateDto
    {
        [Required(ErrorMessage = "DonorId is required")]
        public int DonorId { get; set; }

        [Required(ErrorMessage = "BloodBankId is required")]
        public int BloodBankId { get; set; }

        [Required(ErrorMessage = "Quantity is required")]
        [Range(1, 5, ErrorMessage = "Quantity must be between 1 and 5 units")]
        public int Quantity { get; set; }
    }

    public class DonationRecordResponseDto
    {
        public int Id { get; set; }
        public int DonorId { get; set; }
        public string DonorName { get; set; } = null!;
        public string BloodGroup { get; set; } = null!;
        public int BloodBankId { get; set; }
        public string BloodBankName { get; set; } = null!;
        public DateTime DonationDate { get; set; }
        public int Quantity { get; set; }
        public string Status { get; set; } = null!;
    }
}