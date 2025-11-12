using System.ComponentModel.DataAnnotations;

namespace BloodDonationSystem.Dtos
{
    public class DonorRequestLinkCreateDto
    {
        [Required(ErrorMessage = "DonorId is required")]
        public int DonorId { get; set; }

        [Required(ErrorMessage = "RequestId is required")]
        public int RequestId { get; set; }
    }

    public class DonorRequestLinkResponseDto
    {
        public int Id { get; set; }
        public int DonorId { get; set; }
        public string DonorName { get; set; } = null!;
        public string BloodGroup { get; set; } = null!;
        public int RequestId { get; set; }
        public string RecipientName { get; set; } = null!;
        public string HospitalName { get; set; } = null!;
        public int QuantityNeeded { get; set; }
        public DateTime LinkedAt { get; set; }
        public string RequestStatus { get; set; } = null!;
        public string ResponseStatus { get; set; } = "Pending";
        public DateTime? ResponseDate { get; set; }
    }
}