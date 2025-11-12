using BloodBankSystem.Data;
using BloodBankSystem.Models;
using BloodDonationSystem.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BloodDonationSystem.Repositories
{
    public class DonationRecordRepo : IDonationRecord
    {
        private readonly BloodContext _context;

        public DonationRecordRepo(BloodContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<DonationRecord>> GetAllDonations()
        {
            return await _context.DonationRecords
                .Include(d => d.Donor)
                    .ThenInclude(d => d.User)
                .Include(d => d.BloodBank)
                .OrderByDescending(d => d.DonationDate)
                .ToListAsync();
        }

        public async Task<DonationRecord?> GetDonationById(int id)
        {
            return await _context.DonationRecords
                .Include(d => d.Donor)
                    .ThenInclude(d => d.User)
                .Include(d => d.BloodBank)
                .FirstOrDefaultAsync(d => d.Id == id);
        }

        public async Task<IEnumerable<DonationRecord>> GetDonationsByDonor(int donorId)
        {
            return await _context.DonationRecords
                .Include(d => d.Donor)
                    .ThenInclude(d => d.User)
                .Include(d => d.BloodBank)
                .Where(d => d.DonorId == donorId)
                .OrderByDescending(d => d.DonationDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<DonationRecord>> GetDonationsByBloodBank(int bloodBankId)
        {
            return await _context.DonationRecords
                .Include(d => d.Donor)
                    .ThenInclude(d => d.User)
                .Include(d => d.BloodBank)
                .Where(d => d.BloodBankId == bloodBankId)
                .OrderByDescending(d => d.DonationDate)
                .ToListAsync();
        }

        public async Task<DonationRecord> CreateDonation(DonationRecord donation)
        {
            donation.DonationDate = DateTime.Now;
            donation.Status = "Completed";

            await _context.DonationRecords.AddAsync(donation);
            await _context.SaveChangesAsync();
            return donation;
        }

        public async Task<DonationRecord> UpdateDonationStatus(int id, string status)
        {
            var donation = await _context.DonationRecords.FindAsync(id);
            if (donation == null)
                throw new KeyNotFoundException($"Donation Record with Id {id} not found");

            donation.Status = status;
            await _context.SaveChangesAsync();
            return donation;
        }
    }
}