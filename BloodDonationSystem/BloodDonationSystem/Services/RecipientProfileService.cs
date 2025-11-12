using BloodBankSystem.Models;
using BloodDonationSystem.Dtos;
using BloodDonationSystem.Interfaces;

namespace BloodDonationSystem.Services
{
    public class RecipientProfileService
    {
        private readonly IRecipientProfile _recipientRepo;

        public RecipientProfileService(IRecipientProfile recipientRepo)
        {
            _recipientRepo = recipientRepo;
        }

        public async Task<IEnumerable<RecipientProfileResponseDto>> GetAllRecipients()
        {
            var recipients = await _recipientRepo.GetAllRecipients();
            return recipients.Select(MapToResponseDto);
        }

        public async Task<RecipientProfileResponseDto> GetRecipientById(int id)
        {
            var recipient = await _recipientRepo.GetRecipientById(id);
            if (recipient == null)
                throw new KeyNotFoundException($"Recipient with Id {id} not found");

            return MapToResponseDto(recipient);
        }

        public async Task<RecipientProfileResponseDto> GetRecipientByUserId(int userId)
        {
            var recipient = await _recipientRepo.GetRecipientByUserId(userId);
            if (recipient == null)
                throw new KeyNotFoundException($"Recipient profile for user {userId} not found");

            return MapToResponseDto(recipient);
        }

        public async Task<RecipientProfileResponseDto> CreateRecipient(RecipientProfileCreateDto recipientDto)
        {
            // Create recipient profile for existing user
            var recipient = new RecipientProfile
            {
                UserId = recipientDto.UserId,
                HospitalName = recipientDto.HospitalName,
                PatientName = recipientDto.PatientName,
                RequiredBloodGroup = recipientDto.RequiredBloodGroup,
                ContactNumber = recipientDto.ContactNumber
            };

            var created = await _recipientRepo.CreateRecipient(recipient);
            return MapToResponseDto(created);
        }

        public async Task<RecipientProfileResponseDto> SignupRecipient(RecipientSignupDto recipientDto)
        {
            // Create user first
            var user = new User
            {
                FirstName = recipientDto.FirstName,
                LastName = recipientDto.LastName,
                Username = $"{recipientDto.FirstName.ToLower()}{recipientDto.LastName.ToLower()}",
                Email = recipientDto.Email,
                Phone = recipientDto.ContactNumber,
                PasswordHash = PasswordHasher.HashPassword(recipientDto.Password),
                Role = UserRole.Recipient,
                CreatedAt = DateTime.Now
            };

            var createdUser = await _recipientRepo.CreateUser(user);

            // Create recipient profile
            var recipient = new RecipientProfile
            {
                UserId = createdUser.Id,
                HospitalName = recipientDto.HospitalName,
                PatientName = $"{recipientDto.FirstName} {recipientDto.LastName}".Trim(),
                RequiredBloodGroup = recipientDto.RequiredBloodGroup,
                ContactNumber = recipientDto.ContactNumber
            };

            var created = await _recipientRepo.CreateRecipient(recipient);
            return MapToResponseDto(created);
        }

        public async Task<RecipientProfileResponseDto> UpdateRecipient(int id, RecipientProfileUpdateDto recipientDto)
        {
            var existing = await _recipientRepo.GetRecipientById(id);
            if (existing == null)
                throw new KeyNotFoundException($"Recipient with Id {id} not found");

            var recipient = new RecipientProfile
            {
                HospitalName = recipientDto.HospitalName,
                PatientName = recipientDto.PatientName,
                RequiredBloodGroup = recipientDto.RequiredBloodGroup,
                ContactNumber = recipientDto.ContactNumber
            };

            var updated = await _recipientRepo.UpdateRecipient(id, recipient);
            return MapToResponseDto(updated);
        }

        private RecipientProfileResponseDto MapToResponseDto(RecipientProfile recipient)
        {
            return new RecipientProfileResponseDto
            {
                Id = recipient.Id,
                UserId = recipient.UserId,
                UserName = $"{recipient.User?.FirstName} {recipient.User?.LastName}".Trim(),
                HospitalName = recipient.HospitalName,
                PatientName = recipient.PatientName,
                RequiredBloodGroup = recipient.RequiredBloodGroup,
                ContactNumber = recipient.ContactNumber,
                TotalBloodRequests = recipient.BloodRequests?.Count ?? 0
            };
        }
    }
}