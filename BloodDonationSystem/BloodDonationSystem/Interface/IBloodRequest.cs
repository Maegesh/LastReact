using BloodBankSystem.Models;

namespace BloodDonationSystem.Interfaces
{
    public interface IBloodRequest
    {
        Task<IEnumerable<BloodRequest>> GetAllBloodRequests();
        Task<BloodRequest?> GetBloodRequestById(int id);
        Task<IEnumerable<BloodRequest>> GetBloodRequestsByRecipient(int recipientId);
        Task<IEnumerable<BloodRequest>> GetBloodRequestsByBloodGroup(string bloodGroup);
        Task<IEnumerable<BloodRequest>> GetPendingBloodRequests();
        Task<BloodRequest> CreateBloodRequest(BloodRequest bloodRequest);
        Task<BloodRequest> UpdateBloodRequest(int id, BloodRequest bloodRequest);
        Task<BloodRequest> DeleteBloodRequest(int id);
    }
}