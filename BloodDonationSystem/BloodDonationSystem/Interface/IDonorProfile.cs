using BloodBankSystem.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BloodDonationSystem.Interfaces
{
    public interface IDonorProfile
    {
        Task<IEnumerable<DonorProfile>> GetAllDonors();
        Task<DonorProfile> GetDonorById(int id);
        Task<DonorProfile> GetDonorByUserId(int userId);
        Task<User> CreateUser(User user);
        Task<User> UpdateUser(int userId, User user);
        Task<User> GetUserById(int userId);
        Task<DonorProfile> CreateDonor(DonorProfile donor);
        Task<DonorProfile> UpdateDonor(int id, DonorProfile donor);
        Task<DonorProfile> DeleteDonor(int id);
        Task<IEnumerable<BloodRequest>> GetBloodRequestsByBloodGroup(string bloodGroup);
        Task<IEnumerable<Appointment>> GetAppointmentsByDonor(int donorId);
        Task<IEnumerable<DonationRecord>> GetDonationsByDonor(int donorId);
        Task<IEnumerable<BloodBank>> GetAllBloodBanks();
    }
}
