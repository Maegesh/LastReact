using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BloodBankSystem.Models
{
    public class BloodRequest
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Recipient ID is required")]
        [ForeignKey("Recipient")]
        public int RecipientId { get; set; }

        [Required(ErrorMessage = "Blood group is required")]
        [StringLength(5, ErrorMessage = "Blood group cannot exceed 5 characters")]
        public string BloodGroupNeeded { get; set; } = null!;

        [Required(ErrorMessage = "Quantity is required")]
        [Range(1, 10, ErrorMessage = "Quantity must be between 1 and 10 units")]
        public int Quantity { get; set; }

        [Required(ErrorMessage = "Request date is required")]
        public DateTime RequestDate { get; set; } = DateTime.Now;

        [Required(ErrorMessage = "Status is required")]
        [StringLength(20, ErrorMessage = "Status cannot exceed 20 characters")]
        public string Status { get; set; } = "Pending";

        // Navigation properties
        public RecipientProfile? Recipient { get; set; }

        public ICollection<DonorRequestLink>? DonorRequestLinks { get; set; }
    }
}
