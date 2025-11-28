using System.ComponentModel.DataAnnotations;

namespace BloodDonationSystem.Dtos
{
    public class IdPayload
    {
        [Required]
        public int Id { get; set; }
    }

    public class UserIdPayload
    {
        [Required]
        public int UserId { get; set; }
    }

    public class RecipientIdPayload
    {
        [Required]
        public int RecipientId { get; set; }
    }

    public class DonorIdPayload
    {
        [Required]
        public int DonorId { get; set; }
    }

    public class BloodGroupPayload
    {
        [Required]
        public string BloodGroup { get; set; } = null!;
    }
}