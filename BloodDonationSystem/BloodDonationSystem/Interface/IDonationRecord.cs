using BloodBankSystem.Models;

namespace BloodDonationSystem.Interfaces
{
    public interface IDonationRecord
    {
        Task<IEnumerable<DonationRecord>> GetAllDonations();
        Task<DonationRecord?> GetDonationById(int id);
        Task<IEnumerable<DonationRecord>> GetDonationsByDonor(int donorId);
        Task<IEnumerable<DonationRecord>> GetDonationsByBloodBank(int bloodBankId);
        Task<DonationRecord> CreateDonation(DonationRecord donation);
        Task<DonationRecord> UpdateDonationStatus(int id, string status);
    }
}