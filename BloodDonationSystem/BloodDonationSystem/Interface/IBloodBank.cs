using BloodBankSystem.Models;

namespace BloodDonationSystem.Interfaces
{
    public interface IBloodBank
    {
        Task<IEnumerable<BloodBank>> GetAllBloodBanks();
        Task<BloodBank?> GetBloodBankById(int id);
        Task<IEnumerable<BloodBank>> GetBloodBanksByLocation(string location);
        Task<BloodBank> CreateBloodBank(BloodBank bloodBank);
        Task<BloodBank> UpdateBloodBank(int id, BloodBank bloodBank);
        Task<BloodBank> DeleteBloodBank(int id);
        Task<bool> BloodBankExists(string name, string location);
    }
}