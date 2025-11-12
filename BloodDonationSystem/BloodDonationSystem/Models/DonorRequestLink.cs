using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BloodBankSystem.Models
{
    public class DonorRequestLink
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "DonorId is required")]
        [ForeignKey("Donor")]
        public int DonorId { get; set; }

        [Required(ErrorMessage = "RequestId is required")]
        [ForeignKey("Request")]
        public int RequestId { get; set; }

        [Required(ErrorMessage = "Linked date is required")]
        [DataType(DataType.DateTime)]
        public DateTime LinkedAt { get; set; } = DateTime.Now;

        // Navigation properties
        public DonorProfile? Donor { get; set; }
        public BloodRequest? Request { get; set; }
    }
}
