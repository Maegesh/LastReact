using BloodBankSystem.Data;
using BloodBankSystem.Models;
using BloodDonationSystem.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BloodDonationSystem.Repositories
{
    public class RecipientProfileRepo : IRecipientProfile
    {
        private readonly BloodContext _context;

        public RecipientProfileRepo(BloodContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<RecipientProfile>> GetAllRecipients()
        {
            return await _context.RecipientProfiles
                .Include(r => r.User)
                .Include(r => r.BloodRequests)
                .ToListAsync();
        }

        public async Task<RecipientProfile?> GetRecipientById(int id)
        {
            return await _context.RecipientProfiles
                .Include(r => r.User)
                .Include(r => r.BloodRequests)
                .FirstOrDefaultAsync(r => r.Id == id);
        }

        public async Task<RecipientProfile?> GetRecipientByUserId(int userId)
        {
            return await _context.RecipientProfiles
                .Include(r => r.User)
                .Include(r => r.BloodRequests)
                .FirstOrDefaultAsync(r => r.UserId == userId);
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

        public async Task<RecipientProfile> CreateRecipient(RecipientProfile recipient)
        {
            await _context.RecipientProfiles.AddAsync(recipient);
            await _context.SaveChangesAsync();
            
            // Reload with navigation properties
            return await _context.RecipientProfiles
                .Include(r => r.User)
                .Include(r => r.BloodRequests)
                .FirstAsync(r => r.Id == recipient.Id);
        }

        public async Task<RecipientProfile> UpdateRecipient(int id, RecipientProfile recipient)
        {
            var existing = await _context.RecipientProfiles.FindAsync(id);
            if (existing == null)
                throw new KeyNotFoundException($"Recipient with Id {id} not found");

            existing.HospitalName = recipient.HospitalName ?? existing.HospitalName;
            existing.PatientName = recipient.PatientName ?? existing.PatientName;
            existing.RequiredBloodGroup = recipient.RequiredBloodGroup ?? existing.RequiredBloodGroup;
            existing.ContactNumber = recipient.ContactNumber ?? existing.ContactNumber;

            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<RecipientProfile> DeleteRecipient(int id)
        {
            var recipient = await _context.RecipientProfiles.FindAsync(id);
            if (recipient == null)
                throw new KeyNotFoundException($"Recipient with Id {id} not found");

            _context.RecipientProfiles.Remove(recipient);
            await _context.SaveChangesAsync();
            return recipient;
        }
    }
}