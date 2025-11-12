using BloodBankSystem.Models;
using BloodDonationSystem.Dtos;
using BloodDonationSystem.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BloodDonationSystem.Services
{
    public class DonorProfileService
    {
        private readonly IDonorProfile _donorRepo;

        public DonorProfileService(IDonorProfile donorRepo)
        {
            _donorRepo = donorRepo;
        }

        public async Task<List<DonorProfileResponseDto>> GetAllDonors()
        {
            var donors = await _donorRepo.GetAllDonors();
            return donors.Select(MapToResponseDto).ToList();
        }

        public async Task<DonorProfileResponseDto> GetDonorById(int id)
        {
            var donor = await _donorRepo.GetDonorById(id);
            if (donor == null)
                throw new KeyNotFoundException($"Donor with Id {id} not found");
            
            return MapToResponseDto(donor);
        }

        public async Task<DonorProfileResponseDto> CreateDonor(DonorProfileCreateDto donorDto)
        {
            
            var user = new User
            {
                FirstName = donorDto.FirstName,
                LastName = donorDto.LastName,
                Username = $"{donorDto.FirstName.ToLower()}{donorDto.LastName.ToLower()}",
                Email = donorDto.Email,
                Phone = donorDto.ContactNumber,
                PasswordHash = PasswordHasher.HashPassword(donorDto.Password),
                Role = UserRole.Donor,
                CreatedAt = DateTime.Now
            };

            var createdUser = await _donorRepo.CreateUser(user);

            // Create donor profile
            var isEligible = true;
            if (donorDto.LastDonationDate.HasValue)
            {
                // Must wait 3 months (90 days) between donations
                var daysSinceLastDonation = (DateTime.Now - donorDto.LastDonationDate.Value).Days;
                isEligible = daysSinceLastDonation >= 90;
            }

            var donor = new DonorProfile
            {
                UserId = createdUser.Id,
                BloodGroup = donorDto.BloodGroup,
                Age = donorDto.Age,
                Gender = donorDto.Gender,
                LastDonationDate = donorDto.LastDonationDate,
                EligibilityStatus = isEligible
            };

            var created = await _donorRepo.CreateDonor(donor);
            return MapToResponseDto(created);
        }

        public async Task<DonorProfileResponseDto> UpdateDonor(int id, DonorProfileUpdateDto donorDto)
        {
            // Get existing donor to get userId
            var existing = await _donorRepo.GetDonorById(id);
            if (existing == null)
                throw new KeyNotFoundException($"Donor with Id {id} not found");

            // Update user information if provided
            if (!string.IsNullOrEmpty(donorDto.FirstName) || !string.IsNullOrEmpty(donorDto.LastName) || 
                !string.IsNullOrEmpty(donorDto.Email) || !string.IsNullOrEmpty(donorDto.ContactNumber))
            {
                var firstName = donorDto.FirstName ?? existing.User?.FirstName ?? "";
                var lastName = donorDto.LastName ?? existing.User?.LastName ?? "";
                
                var user = new User
                {
                    FirstName = donorDto.FirstName ?? existing.User?.FirstName,
                    LastName = donorDto.LastName ?? existing.User?.LastName,
                    Username = $"{firstName.ToLower()}{lastName.ToLower()}",
                    Email = donorDto.Email ?? existing.User?.Email,
                    Phone = donorDto.ContactNumber ?? existing.User?.Phone
                };
                await _donorRepo.UpdateUser(existing.UserId, user);
            }

            // Update donor profile
            // Auto-calculate eligibility if lastDonationDate is being updated
            var eligibilityStatus = existing.EligibilityStatus; // Keep existing by default
            if (donorDto.LastDonationDate.HasValue)
            {
                var daysSinceLastDonation = (DateTime.Now - donorDto.LastDonationDate.Value).Days;
                eligibilityStatus = daysSinceLastDonation >= 90;
            }

            var donor = new DonorProfile
            {
                BloodGroup = donorDto.BloodGroup ?? existing.BloodGroup,
                Age = donorDto.Age ?? existing.Age,
                Gender = donorDto.Gender ?? existing.Gender,
                LastDonationDate = donorDto.LastDonationDate ?? existing.LastDonationDate,
                EligibilityStatus = eligibilityStatus
            };

            var updated = await _donorRepo.UpdateDonor(id, donor);
            return MapToResponseDto(updated);
        }

        private DonorProfileResponseDto MapToResponseDto(DonorProfile donor)
        {
            return new DonorProfileResponseDto
            {
                Id = donor.Id,
                UserId = donor.UserId,
                UserName = $"{donor.User?.FirstName} {donor.User?.LastName}".Trim(),
                BloodGroup = donor.BloodGroup,
                Age = donor.Age,
                Gender = donor.Gender,
                LastDonationDate = donor.LastDonationDate,
                EligibilityStatus = donor.EligibilityStatus,
                TotalDonations = donor.DonationRecords?.Count ?? 0,
                UpcomingAppointments = donor.Appointments?.Count(a => a.Status == "Scheduled") ?? 0
            };
        }
    }
}
