using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BloodBankSystem.Models
{
    public class DonorProfile
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "UserId is required")]
        [ForeignKey("User")]
        public int UserId { get; set; }

        [Required(ErrorMessage = "Blood group is required")]
        [StringLength(5, ErrorMessage = "Blood group must be 5 characters or less")]
        public string BloodGroup { get; set; } = null!;

        [Required(ErrorMessage = "Age is required")]
        [Range(18, 65, ErrorMessage = "Donor age must be between 18 and 65 years")]
        public int Age { get; set; }

        [Required(ErrorMessage = "Gender is required")]
        [MaxLength(10, ErrorMessage = "Gender cannot exceed 10 characters")]
        public string Gender { get; set; } = null!;

        [DataType(DataType.Date)]
        public DateTime? LastDonationDate { get; set; }

        [Required(ErrorMessage = "Eligibility status is required")]
        public bool EligibilityStatus { get; set; }

        // Navigation Properties
        public User? User { get; set; }

        public ICollection<DonationRecord>? DonationRecords { get; set; }
        public ICollection<Appointment>? Appointments { get; set; }
        public ICollection<DonorRequestLink>? DonorRequestLinks { get; set; }
    }
}
