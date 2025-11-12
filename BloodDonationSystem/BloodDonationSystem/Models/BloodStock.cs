using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BloodBankSystem.Models
{
    public class BloodStock
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "BloodBankId is required")]
        [ForeignKey("BloodBank")]
        public int BloodBankId { get; set; }

        [Required(ErrorMessage = "Blood group is required")]
        [StringLength(5, ErrorMessage = "Blood group cannot exceed 5 characters")]
        public string BloodGroup { get; set; } = null!;

        [Required(ErrorMessage = "Units available is required")]
        [Range(0, 500, ErrorMessage = "Units available must be between 0 and 500")]
        public int UnitsAvailable { get; set; }

        [Required]
        public DateTime LastUpdated { get; set; } = DateTime.Now;

        // Navigation property
        public BloodBank? BloodBank { get; set; }
    }
}
