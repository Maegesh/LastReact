using BloodBankSystem.Models;

namespace BloodDonationSystem.Interfaces
{
    public interface IDonorRequestLink
    {
        Task<IEnumerable<DonorRequestLink>> GetAllLinks();
        Task<IEnumerable<DonorRequestLink>> GetLinksByDonor(int donorId);
        Task<IEnumerable<DonorRequestLink>> GetLinksByRequest(int requestId);
        Task<DonorRequestLink> CreateLink(DonorRequestLink link);
        Task<DonorRequestLink> DeleteLink(int id);
    }
}