using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BloodBankSystem.Models
{
    public class RecipientProfile
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "UserId is required")]
        [ForeignKey("User")]
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
        [Phone(ErrorMessage = "Invalid phone number format")]
        [StringLength(15, ErrorMessage = "Contact number cannot exceed 15 digits")]
        public string ContactNumber { get; set; } = null!;

        // Navigation
        public User? User { get; set; }
        public ICollection<BloodRequest>? BloodRequests { get; set; }
    }
}
