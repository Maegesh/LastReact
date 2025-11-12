using BloodBankSystem.Data;
using BloodBankSystem.Models;
using BloodDonationSystem.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BloodDonationSystem.Repositories
{
    public class BloodBankRepo : IBloodBank
    {
        private readonly BloodContext _context;

        public BloodBankRepo(BloodContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<BloodBank>> GetAllBloodBanks()
        {
            return await _context.BloodBanks
                .Include(b => b.BloodStocks)
                .Include(b => b.DonationRecords)
                .ToListAsync();
        }

        public async Task<BloodBank?> GetBloodBankById(int id)
        {
            return await _context.BloodBanks
                .Include(b => b.BloodStocks)
                .Include(b => b.DonationRecords)
                .Include(b => b.Appointments)
                .FirstOrDefaultAsync(b => b.Id == id);
        }

        public async Task<IEnumerable<BloodBank>> GetBloodBanksByLocation(string location)
        {
            return await _context.BloodBanks
                .Include(b => b.BloodStocks)
                .Where(b => b.Location.ToLower().Contains(location.ToLower()))
                .ToListAsync();
        }

        public async Task<BloodBank> CreateBloodBank(BloodBank bloodBank)
        {
            await _context.BloodBanks.AddAsync(bloodBank);
            await _context.SaveChangesAsync();
            return bloodBank;
        }

        public async Task<BloodBank> UpdateBloodBank(int id, BloodBank bloodBank)
        {
            var existing = await _context.BloodBanks.FindAsync(id);
            if (existing == null)
                throw new KeyNotFoundException($"Blood Bank with Id {id} not found");

            existing.Name = bloodBank.Name ?? existing.Name;
            existing.Location = bloodBank.Location ?? existing.Location;
            existing.ContactNumber = bloodBank.ContactNumber ?? existing.ContactNumber;
            existing.Email = bloodBank.Email ?? existing.Email;
            existing.Capacity = bloodBank.Capacity != 0 ? bloodBank.Capacity : existing.Capacity;
            existing.ManagedBy = bloodBank.ManagedBy ?? existing.ManagedBy;

            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<BloodBank> DeleteBloodBank(int id)
        {
            var bloodBank = await _context.BloodBanks.FindAsync(id);
            if (bloodBank == null)
                throw new KeyNotFoundException($"Blood Bank with Id {id} not found");

            _context.BloodBanks.Remove(bloodBank);
            await _context.SaveChangesAsync();
            return bloodBank;
        }

        public async Task<bool> BloodBankExists(string name, string location)
        {
            return await _context.BloodBanks
                .AnyAsync(b => b.Name == name && b.Location == location);
        }
    }
}