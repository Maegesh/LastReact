using BloodBankSystem.Models;
using BloodDonationSystem.Dtos;
using BloodDonationSystem.Interfaces;

namespace BloodDonationSystem.Services
{
    public class BloodBankService
    {
        private readonly IBloodBank _bloodBankRepo;

        public BloodBankService(IBloodBank bloodBankRepo)
        {
            _bloodBankRepo = bloodBankRepo;
        }

        public async Task<IEnumerable<BloodBankResponseDto>> GetAllBloodBanks()
        {
            var bloodBanks = await _bloodBankRepo.GetAllBloodBanks();
            return bloodBanks.Select(MapToResponseDto);
        }

        public async Task<BloodBankResponseDto> GetBloodBankById(int id)
        {
            var bloodBank = await _bloodBankRepo.GetBloodBankById(id);
            if (bloodBank == null)
                throw new KeyNotFoundException($"Blood Bank with Id {id} not found");

            return MapToResponseDto(bloodBank);
        }

        public async Task<IEnumerable<BloodBankResponseDto>> GetBloodBanksByLocation(string location)
        {
            var bloodBanks = await _bloodBankRepo.GetBloodBanksByLocation(location);
            return bloodBanks.Select(MapToResponseDto);
        }

        public async Task<BloodBankResponseDto> CreateBloodBank(BloodBankCreateDto bloodBankDto)
        {
            if (await _bloodBankRepo.BloodBankExists(bloodBankDto.Name, bloodBankDto.Location))
                throw new InvalidOperationException("Blood Bank with this name already exists in this location");

            var bloodBank = new BloodBank
            {
                Name = bloodBankDto.Name,
                Location = bloodBankDto.Location,
                ContactNumber = bloodBankDto.ContactNumber,
                Email = bloodBankDto.Email,
                Capacity = bloodBankDto.Capacity
            };

            var created = await _bloodBankRepo.CreateBloodBank(bloodBank);
            return MapToResponseDto(created);
        }

        public async Task<BloodBankResponseDto> UpdateBloodBank(int id, BloodBankUpdateDto bloodBankDto)
        {
            var bloodBank = new BloodBank
            {
                Capacity = bloodBankDto.Capacity
            };

            var updated = await _bloodBankRepo.UpdateBloodBank(id, bloodBank);
            return MapToResponseDto(updated);
        }

        public async Task<BloodBankResponseDto> DeleteBloodBank(int id)
        {
            var deleted = await _bloodBankRepo.DeleteBloodBank(id);
            return MapToResponseDto(deleted);
        }

        private BloodBankResponseDto MapToResponseDto(BloodBank bloodBank)
        {
            return new BloodBankResponseDto
            {
                Id = bloodBank.Id,
                Name = bloodBank.Name,
                Location = bloodBank.Location,
                ContactNumber = bloodBank.ContactNumber,
                Email = bloodBank.Email,
                Capacity = bloodBank.Capacity,
                TotalBloodStocks = bloodBank.BloodStocks?.Count ?? 0,
                TotalDonations = bloodBank.DonationRecords?.Count ?? 0
            };
        }
    }
}