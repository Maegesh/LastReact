using BloodBankSystem.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BloodDonationSystem.Interfaces
{
    public interface IDonorProfile
    {
        Task<IEnumerable<DonorProfile>> GetAllDonors();
        Task<DonorProfile> GetDonorById(int id);
        Task<User> CreateUser(User user);
        Task<User> UpdateUser(int userId, User user);
        Task<DonorProfile> CreateDonor(DonorProfile donor);
        Task<DonorProfile> UpdateDonor(int id, DonorProfile donor);
        Task<DonorProfile> DeleteDonor(int id);
    }
}
