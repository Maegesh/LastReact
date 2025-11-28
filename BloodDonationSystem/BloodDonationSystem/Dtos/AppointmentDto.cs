using System.ComponentModel.DataAnnotations;

namespace BloodDonationSystem.Dtos
{
    public class AppointmentCreateDto
    {
        [Required(ErrorMessage = "Donor ID is required")]
        public int DonorId { get; set; }

        [Required(ErrorMessage = "Blood Bank ID is required")]
        public int BloodBankId { get; set; }

        [Required(ErrorMessage = "Appointment date is required")]
        [DataType(DataType.DateTime)]
        public DateTime AppointmentDate { get; set; }

        [StringLength(200, ErrorMessage = "Remarks cannot exceed 200 characters")]
        public string? Remarks { get; set; }
        
        public int? BloodRequestId { get; set; }
    }

    public class AppointmentUpdateDto
    {
        [DataType(DataType.DateTime)]
        public DateTime? AppointmentDate { get; set; }

        [StringLength(50, ErrorMessage = "Status cannot exceed 50 characters")]
        [RegularExpression("^(Scheduled|Completed|Cancelled|Pending)$", ErrorMessage = "Status must be Scheduled, Completed, Cancelled, or Pending")]
        public string? Status { get; set; }

        [StringLength(200, ErrorMessage = "Remarks cannot exceed 200 characters")]
        public string? Remarks { get; set; }
    }

    public class AppointmentResponseDto
    {
        public int Id { get; set; }
        public int DonorId { get; set; }
        public string DonorName { get; set; } = null!;
        public string BloodGroup { get; set; } = null!;
        public int BloodBankId { get; set; }
        public string BloodBankName { get; set; } = null!;
        public DateTime AppointmentDate { get; set; }
        public string Status { get; set; } = null!;
        public string? Remarks { get; set; }
    }

    public class AppointmentStatusUpdatePayload
    {
        [Required(ErrorMessage = "Appointment ID is required")]
        public int Id { get; set; }

        [Required(ErrorMessage = "Status is required")]
        [StringLength(50, ErrorMessage = "Status cannot exceed 50 characters")]
        [RegularExpression("^(Scheduled|Completed|Cancelled|Pending)$", ErrorMessage = "Status must be Scheduled, Completed, Cancelled, or Pending")]
        public string Status { get; set; } = null!;
    }
}