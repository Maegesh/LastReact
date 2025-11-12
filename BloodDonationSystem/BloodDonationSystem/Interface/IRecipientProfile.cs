using BloodBankSystem.Models;

namespace BloodDonationSystem.Interfaces
{
    public interface IRecipientProfile
    {
        Task<IEnumerable<RecipientProfile>> GetAllRecipients();
        Task<RecipientProfile?> GetRecipientById(int id);
        Task<RecipientProfile?> GetRecipientByUserId(int userId);
        Task<User> CreateUser(User user);
        Task<User> UpdateUser(int userId, User user);
        Task<RecipientProfile> CreateRecipient(RecipientProfile recipient);
        Task<RecipientProfile> UpdateRecipient(int id, RecipientProfile recipient);
        Task<RecipientProfile> DeleteRecipient(int id);
    }
}