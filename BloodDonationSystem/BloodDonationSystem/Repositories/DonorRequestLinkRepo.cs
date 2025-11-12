using BloodBankSystem.Data;
using BloodBankSystem.Models;
using BloodDonationSystem.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BloodDonationSystem.Repositories
{
    public class DonorRequestLinkRepo : IDonorRequestLink
    {
        private readonly BloodContext _context;

        public DonorRequestLinkRepo(BloodContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<DonorRequestLink>> GetAllLinks()
        {
            return await _context.DonorRequestLinks
                .Include(drl => drl.Donor)
                    .ThenInclude(d => d.User)
                .Include(drl => drl.Request)
                    .ThenInclude(r => r.Recipient)
                        .ThenInclude(rp => rp.User)
                .OrderByDescending(drl => drl.LinkedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<DonorRequestLink>> GetLinksByDonor(int donorId)
        {
            return await _context.DonorRequestLinks
                .Include(drl => drl.Donor)
                    .ThenInclude(d => d.User)
                .Include(drl => drl.Request)
                    .ThenInclude(r => r.Recipient)
                        .ThenInclude(rp => rp.User)
                .Where(drl => drl.DonorId == donorId)
                .OrderByDescending(drl => drl.LinkedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<DonorRequestLink>> GetLinksByRequest(int requestId)
        {
            return await _context.DonorRequestLinks
                .Include(drl => drl.Donor)
                    .ThenInclude(d => d.User)
                .Include(drl => drl.Request)
                    .ThenInclude(r => r.Recipient)
                        .ThenInclude(rp => rp.User)
                .Where(drl => drl.RequestId == requestId)
                .OrderByDescending(drl => drl.LinkedAt)
                .ToListAsync();
        }

        public async Task<DonorRequestLink> CreateLink(DonorRequestLink link)
        {
            link.LinkedAt = DateTime.Now;
            await _context.DonorRequestLinks.AddAsync(link);
            await _context.SaveChangesAsync();
            return link;
        }

        public async Task<DonorRequestLink> DeleteLink(int id)
        {
            var link = await _context.DonorRequestLinks.FindAsync(id);
            if (link == null)
                throw new KeyNotFoundException($"Donor Request Link with Id {id} not found");

            _context.DonorRequestLinks.Remove(link);
            await _context.SaveChangesAsync();
            return link;
        }
    }
}