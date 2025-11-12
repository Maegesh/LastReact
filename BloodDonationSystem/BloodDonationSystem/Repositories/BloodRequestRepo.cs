using BloodBankSystem.Data;
using BloodBankSystem.Models;
using BloodDonationSystem.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BloodDonationSystem.Repositories
{
    public class BloodRequestRepo : IBloodRequest
    {
        private readonly BloodContext _context;

        public BloodRequestRepo(BloodContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<BloodRequest>> GetAllBloodRequests()
        {
            return await _context.BloodRequests
                .Include(br => br.Recipient)
                    .ThenInclude(r => r.User)
                .Include(br => br.DonorRequestLinks)
                .OrderByDescending(br => br.RequestDate)
                .ToListAsync();
        }

        public async Task<BloodRequest?> GetBloodRequestById(int id)
        {
            return await _context.BloodRequests
                .Include(br => br.Recipient)
                    .ThenInclude(r => r.User)
                .Include(br => br.DonorRequestLinks)
                    .ThenInclude(drl => drl.Donor)
                        .ThenInclude(d => d.User)
                .FirstOrDefaultAsync(br => br.Id == id);
        }

        public async Task<IEnumerable<BloodRequest>> GetBloodRequestsByRecipient(int recipientId)
        {
            return await _context.BloodRequests
                .Include(br => br.Recipient)
                    .ThenInclude(r => r.User)
                .Include(br => br.DonorRequestLinks)
                .Where(br => br.RecipientId == recipientId)
                .OrderByDescending(br => br.RequestDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<BloodRequest>> GetBloodRequestsByBloodGroup(string bloodGroup)
        {
            return await _context.BloodRequests
                .Include(br => br.Recipient)
                    .ThenInclude(r => r.User)
                .Include(br => br.DonorRequestLinks)
                .Where(br => br.BloodGroupNeeded == bloodGroup)
                .OrderByDescending(br => br.RequestDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<BloodRequest>> GetPendingBloodRequests()
        {
            return await _context.BloodRequests
                .Include(br => br.Recipient)
                    .ThenInclude(r => r.User)
                .Include(br => br.DonorRequestLinks)
                .Where(br => br.Status == "Pending")
                .OrderByDescending(br => br.RequestDate)
                .ToListAsync();
        }

        public async Task<BloodRequest> CreateBloodRequest(BloodRequest bloodRequest)
        {
            bloodRequest.RequestDate = DateTime.Now;
            bloodRequest.Status = "Pending";
            
            await _context.BloodRequests.AddAsync(bloodRequest);
            await _context.SaveChangesAsync();
            return bloodRequest;
        }

        public async Task<BloodRequest> UpdateBloodRequest(int id, BloodRequest bloodRequest)
        {
            var existing = await _context.BloodRequests.FindAsync(id);
            if (existing == null)
                throw new KeyNotFoundException($"Blood Request with Id {id} not found");

            existing.BloodGroupNeeded = bloodRequest.BloodGroupNeeded ?? existing.BloodGroupNeeded;
            existing.Quantity = bloodRequest.Quantity != 0 ? bloodRequest.Quantity : existing.Quantity;
            existing.Status = bloodRequest.Status ?? existing.Status;

            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<BloodRequest> DeleteBloodRequest(int id)
        {
            var bloodRequest = await _context.BloodRequests.FindAsync(id);
            if (bloodRequest == null)
                throw new KeyNotFoundException($"Blood Request with Id {id} not found");

            _context.BloodRequests.Remove(bloodRequest);
            await _context.SaveChangesAsync();
            return bloodRequest;
        }
    }
}