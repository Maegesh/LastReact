using BloodBankSystem.Models;
using BloodDonationSystem.Dtos;
using BloodDonationSystem.Interfaces;

namespace BloodDonationSystem.Services
{
    public class BloodStockService
    {
        private readonly IBloodStock _bloodStockRepo;

        public BloodStockService(IBloodStock bloodStockRepo)
        {
            _bloodStockRepo = bloodStockRepo;
        }

        public async Task<IEnumerable<BloodStockResponseDto>> GetAllBloodStocks()
        {
            var stocks = await _bloodStockRepo.GetAllBloodStocks();
            return stocks.Select(MapToResponseDto);
        }

        public async Task<BloodStockResponseDto> GetBloodStockById(int id)
        {
            var stock = await _bloodStockRepo.GetBloodStockById(id);
            if (stock == null)
                throw new KeyNotFoundException($"Blood Stock with Id {id} not found");

            return MapToResponseDto(stock);
        }

        public async Task<IEnumerable<BloodStockResponseDto>> GetBloodStocksByBloodGroup(string bloodGroup)
        {
            var stocks = await _bloodStockRepo.GetBloodStocksByBloodGroup(bloodGroup);
            return stocks.Select(MapToResponseDto);
        }

        public async Task<BloodStockResponseDto> CreateBloodStock(BloodStockCreateDto stockDto)
        {
            var bloodStock = new BloodStock
            {
                BloodBankId = stockDto.BloodBankId,
                BloodGroup = stockDto.BloodGroup,
                UnitsAvailable = stockDto.UnitsAvailable
            };

            var created = await _bloodStockRepo.CreateBloodStock(bloodStock);
            return MapToResponseDto(created);
        }

        public async Task<BloodStockResponseDto> UpdateBloodStock(int id, BloodStockUpdateDto stockDto)
        {
            var bloodStock = new BloodStock
            {
                UnitsAvailable = stockDto.UnitsAvailable ?? 0
            };

            var updated = await _bloodStockRepo.UpdateBloodStock(id, bloodStock);
            return MapToResponseDto(updated);
        }

        private BloodStockResponseDto MapToResponseDto(BloodStock stock)
        {
            return new BloodStockResponseDto
            {
                Id = stock.Id,
                BloodBankId = stock.BloodBankId,
                BloodBankName = stock.BloodBank?.Name ?? "Unknown",
                BloodGroup = stock.BloodGroup,
                UnitsAvailable = stock.UnitsAvailable,
                LastUpdated = stock.LastUpdated,
                AvailabilityStatus = GetAvailabilityStatus(stock.UnitsAvailable)
            };
        }

        private string GetAvailabilityStatus(int units)
        {
            return units switch
            {
                0 => "Out of Stock",
                <= 5 => "Low Stock",
                <= 20 => "Moderate Stock",
                _ => "Good Stock"
            };
        }
    }
}