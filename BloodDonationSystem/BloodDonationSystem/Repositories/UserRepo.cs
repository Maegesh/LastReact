using BloodBankSystem.Data;
using BloodBankSystem.Models;
using BloodDonationSystem.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BloodDonationSystem.Repositories
{
    public class UserRepo : IUser
    {
        private readonly BloodContext _context;

        public UserRepo(BloodContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<User>> GetAllUsers()
        {
            return await _context.Users
                .Include(u => u.DonorProfile)
                .Include(u => u.RecipientProfile)
                .ToListAsync();
        }

        public async Task<User?> GetUserById(int id)
        {
            return await _context.Users
                .Include(u => u.DonorProfile)
                .Include(u => u.RecipientProfile)
                .Include(u => u.Notifications)
                .FirstOrDefaultAsync(u => u.Id == id);
        }

        public async Task<User?> GetUserByEmail(string email)
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<User> CreateUser(User user)
        {
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<User> UpdateUser(int id, User user)
        {
            var existing = await _context.Users.FindAsync(id);
            if (existing == null)
                throw new KeyNotFoundException($"User with Id {id} not found");

            existing.FirstName = user.FirstName ?? existing.FirstName;
            existing.LastName = user.LastName ?? existing.LastName;
            existing.Phone = user.Phone ?? existing.Phone;
            existing.ProfileImageUrl = user.ProfileImageUrl ?? existing.ProfileImageUrl;

            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<User> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                throw new KeyNotFoundException($"User with Id {id} not found");

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<bool> UserExists(string email, string username)
        {
            return await _context.Users
                .AnyAsync(u => u.Email == email || u.Username == username);
        }
    }
}