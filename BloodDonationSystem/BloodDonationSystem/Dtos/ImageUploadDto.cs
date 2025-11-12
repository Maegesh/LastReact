using System.ComponentModel.DataAnnotations;

namespace BloodDonationSystem.Dtos
{
    public class ImageUploadDto
    {
        [Required]
        public string FileName { get; set; } = string.Empty;
        
        [Required]
        public string FileType { get; set; } = string.Empty;
        
        [Required]
        public long FileSize { get; set; }
        
        [Required]
        public byte[] ImageBytes { get; set; } = Array.Empty<byte>();
    }
}