using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BloodBankSystem.Models
{
    public class BloodBank
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Blood bank name is required.")]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "Name must be between 3 and 100 characters.")]
        [RegularExpression(@"^[A-Za-z\s]+$", ErrorMessage = "Name should only contain letters and spaces.")]
        public string Name { get; set; } = null!;

        [Required(ErrorMessage = "Location is required.")]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "Location must be between 3 and 100 characters.")]
        public string Location { get; set; } = null!;

        [Required(ErrorMessage = "Contact number is required.")]
        [Phone(ErrorMessage = "Invalid contact number format.")]
        [RegularExpression(@"^[6-9]\d{9}$", ErrorMessage = "Contact number must be a valid 10-digit Indian number.")]
        public string ContactNumber { get; set; } = null!;

        [Required(ErrorMessage = "Email address is required.")]
        [EmailAddress(ErrorMessage = "Invalid email format.")]
        [StringLength(100, ErrorMessage = "Email address can't exceed 100 characters.")]
        public string Email { get; set; } = null!;

        [Range(1, 10000, ErrorMessage = "Capacity must be between 1 and 10,000 units.")]
        public int Capacity { get; set; }

        [StringLength(50, ErrorMessage = "Manager name can't exceed 50 characters.")]
        [RegularExpression(@"^[A-Za-z\s]*$", ErrorMessage = "Manager name should contain only letters and spaces.")]
        public string? ManagedBy { get; set; }

        // Navigation properties
        public ICollection<BloodStock>? BloodStocks { get; set; }
        public ICollection<DonationRecord>? DonationRecords { get; set; }
        public ICollection<Appointment>? Appointments { get; set; }
    }
}
