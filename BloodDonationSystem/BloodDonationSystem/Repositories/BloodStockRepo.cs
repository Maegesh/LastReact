using BloodBankSystem.Data;
using BloodBankSystem.Models;
using BloodDonationSystem.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BloodDonationSystem.Repositories
{
    public class BloodStockRepo : IBloodStock
    {
        private readonly BloodContext _context;

        public BloodStockRepo(BloodContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<BloodStock>> GetAllBloodStocks()
        {
            return await _context.BloodStocks
                .Include(bs => bs.BloodBank)
                .OrderBy(bs => bs.BloodGroup)
                .ToListAsync();
        }

        public async Task<BloodStock?> GetBloodStockById(int id)
        {
            return await _context.BloodStocks
                .Include(bs => bs.BloodBank)
                .FirstOrDefaultAsync(bs => bs.Id == id);
        }

        public async Task<IEnumerable<BloodStock>> GetBloodStocksByBloodBank(int bloodBankId)
        {
            return await _context.BloodStocks
                .Include(bs => bs.BloodBank)
                .Where(bs => bs.BloodBankId == bloodBankId)
                .OrderBy(bs => bs.BloodGroup)
                .ToListAsync();
        }

        public async Task<IEnumerable<BloodStock>> GetBloodStocksByBloodGroup(string bloodGroup)
        {
            return await _context.BloodStocks
                .Include(bs => bs.BloodBank)
                .Where(bs => bs.BloodGroup == bloodGroup)
                .OrderByDescending(bs => bs.UnitsAvailable)
                .ToListAsync();
        }

        public async Task<BloodStock> CreateBloodStock(BloodStock bloodStock)
        {
            bloodStock.LastUpdated = DateTime.Now;
            await _context.BloodStocks.AddAsync(bloodStock);
            await _context.SaveChangesAsync();
            return bloodStock;
        }

        public async Task<BloodStock> UpdateBloodStock(int id, BloodStock bloodStock)
        {
            var existing = await _context.BloodStocks.FindAsync(id);
            if (existing == null)
                throw new KeyNotFoundException($"Blood Stock with Id {id} not found");

            existing.UnitsAvailable = bloodStock.UnitsAvailable;
            existing.LastUpdated = DateTime.Now;

            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<BloodStock> UpdateStockQuantity(int id, int quantity)
        {
            var existing = await _context.BloodStocks.FindAsync(id);
            if (existing == null)
                throw new KeyNotFoundException($"Blood Stock with Id {id} not found");

            existing.UnitsAvailable = Math.Max(0, existing.UnitsAvailable + quantity);
            existing.LastUpdated = DateTime.Now;

            await _context.SaveChangesAsync();
            return existing;
        }
    }
}