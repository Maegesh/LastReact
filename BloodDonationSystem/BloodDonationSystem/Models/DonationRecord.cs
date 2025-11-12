using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BloodBankSystem.Models
{
    public class DonationRecord
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "DonorId is required")]
        [ForeignKey("Donor")]
        public int DonorId { get; set; }

        [Required(ErrorMessage = "BloodBankId is required")]
        [ForeignKey("BloodBank")]
        public int BloodBankId { get; set; }

        [Required(ErrorMessage = "Donation date is required")]
        [DataType(DataType.Date)]
        public DateTime DonationDate { get; set; }

        [Required(ErrorMessage = "Quantity is required")]
        [Range(1, 5, ErrorMessage = "Quantity must be between 1 and 5 units")]
        public int Quantity { get; set; }

        [Required(ErrorMessage = "Status is required")]
        [StringLength(50, ErrorMessage = "Status cannot exceed 50 characters")]
        public string Status { get; set; } = null!;

        // Navigation properties
        public DonorProfile? Donor { get; set; }
        public BloodBank? BloodBank { get; set; }
    }
}
