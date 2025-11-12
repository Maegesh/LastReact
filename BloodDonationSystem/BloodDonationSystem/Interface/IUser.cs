using BloodBankSystem.Models;

namespace BloodDonationSystem.Interfaces
{
    public interface IUser
    {
        Task<IEnumerable<User>> GetAllUsers();
        Task<User?> GetUserById(int id);
        Task<User?> GetUserByEmail(string email);
        Task<User> CreateUser(User user);
        Task<User> UpdateUser(int id, User user);
        Task<User> DeleteUser(int id);
        Task<bool> UserExists(string email, string username);
    }
}