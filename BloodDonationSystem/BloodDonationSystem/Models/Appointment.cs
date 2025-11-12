using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BloodBankSystem.Models
{
    public class Appointment
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("Donor")]
        [Required(ErrorMessage = "Donor ID is required.")]
        public int DonorId { get; set; }

        [ForeignKey("BloodBank")]
        [Required(ErrorMessage = "Blood Bank ID is required.")]
        public int BloodBankId { get; set; }

        [Required(ErrorMessage = "Appointment date is required.")]
        [DataType(DataType.DateTime)]
        [FutureDate(ErrorMessage = "Appointment date must be in the future.")]
        public DateTime AppointmentDate { get; set; }

        [Required(ErrorMessage = "Status is required.")]
        [StringLength(50, MinimumLength = 3, ErrorMessage = "Status must be between 3 and 50 characters.")]
        [RegularExpression(@"^(Scheduled|Completed|Cancelled|Pending)$",
            ErrorMessage = "Status must be one of: Scheduled, Completed, Cancelled, or Pending.")]
        public string Status { get; set; } = "Scheduled";

        [StringLength(200, ErrorMessage = "Remarks cannot exceed 200 characters.")]
        public string? Remarks { get; set; }

        // Navigation properties
        public DonorProfile? Donor { get; set; }
        public BloodBank? BloodBank { get; set; }
    }
    public class FutureDateAttribute : ValidationAttribute
    {
        public override bool IsValid(object? value)
        {
            if (value is DateTime date)
            {
                return date >= DateTime.Now.AddMinutes(-1);
            }
            return false;
        }
    }
}