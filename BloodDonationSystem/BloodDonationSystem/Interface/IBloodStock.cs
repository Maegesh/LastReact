using BloodBankSystem.Models;

namespace BloodDonationSystem.Interfaces
{
    public interface IBloodStock
    {
        Task<IEnumerable<BloodStock>> GetAllBloodStocks();
        Task<BloodStock?> GetBloodStockById(int id);
        Task<IEnumerable<BloodStock>> GetBloodStocksByBloodBank(int bloodBankId);
        Task<IEnumerable<BloodStock>> GetBloodStocksByBloodGroup(string bloodGroup);
        Task<BloodStock> CreateBloodStock(BloodStock bloodStock);
        Task<BloodStock> UpdateBloodStock(int id, BloodStock bloodStock);
        Task<BloodStock> UpdateStockQuantity(int id, int quantity);
    }
}