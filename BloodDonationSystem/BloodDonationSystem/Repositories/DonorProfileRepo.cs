using BloodBankSystem.Data;
using BloodBankSystem.Models;
using BloodDonationSystem.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BloodDonationSystem.Repositories
{
    public class DonorProfileRepo : IDonorProfile
    {
        private readonly BloodContext _context;

        public DonorProfileRepo(BloodContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<DonorProfile>> GetAllDonors()
        {
            return await _context.DonorProfiles
                .Include(d => d.User)
                .Include(d => d.DonationRecords)
                .Include(d => d.Appointments)
                .ToListAsync();
        }

        public async Task<DonorProfile> GetDonorById(int id)
        {
            var donor = await _context.DonorProfiles
                .Include(d => d.User)
                .Include(d => d.DonationRecords)
                .Include(d => d.Appointments)
                .FirstOrDefaultAsync(d => d.Id == id);

            if (donor == null)
                throw new KeyNotFoundException($"Donor with Id {id} not found");

            return donor;
        }

        public async Task<User> CreateUser(User user)
        {
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<User> UpdateUser(int userId, User user)
        {
            var existing = await _context.Users.FindAsync(userId);
            if (existing == null)
                throw new KeyNotFoundException($"User with Id {userId} not found");

            existing.FirstName = user.FirstName ?? existing.FirstName;
            existing.LastName = user.LastName ?? existing.LastName;
            existing.Username = user.Username ?? existing.Username;
            existing.Email = user.Email ?? existing.Email;
            existing.Phone = user.Phone ?? existing.Phone;

            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<DonorProfile> CreateDonor(DonorProfile donor)
        {
            await _context.DonorProfiles.AddAsync(donor);
            await _context.SaveChangesAsync();
            
            // Reload with navigation properties
            return await _context.DonorProfiles
                .Include(d => d.User)
                .Include(d => d.DonationRecords)
                .Include(d => d.Appointments)
                .FirstAsync(d => d.Id == donor.Id);
        }

        public async Task<DonorProfile> UpdateDonor(int id, DonorProfile donor)
        {
            var existing = await _context.DonorProfiles.FindAsync(id);
            if (existing == null)
                throw new KeyNotFoundException($"Donor with Id {id} not found");

            existing.BloodGroup = donor.BloodGroup ?? existing.BloodGroup;
            existing.Age = donor.Age != 0 ? donor.Age : existing.Age;
            existing.Gender = donor.Gender ?? existing.Gender;
            existing.LastDonationDate = donor.LastDonationDate ?? existing.LastDonationDate;
            existing.EligibilityStatus = donor.EligibilityStatus;

            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<DonorProfile> DeleteDonor(int id)
        {
            var donor = await _context.DonorProfiles.FirstOrDefaultAsync(d => d.Id == id);
            if (donor == null)
                throw new KeyNotFoundException($"Donor with Id {id} not found");

            _context.DonorProfiles.Remove(donor);
            await _context.SaveChangesAsync();
            return donor;
        }
    }
}
