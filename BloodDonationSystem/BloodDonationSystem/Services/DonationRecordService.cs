using BloodBankSystem.Models;
using BloodDonationSystem.Dtos;
using BloodDonationSystem.Interfaces;
using BloodBankSystem.Data;
using Microsoft.EntityFrameworkCore;

namespace BloodDonationSystem.Services
{
    public class DonationRecordService
    {
        private readonly IDonationRecord _donationRepo;
        private readonly BloodContext _context;

        public DonationRecordService(IDonationRecord donationRepo, BloodContext context)
        {
            _donationRepo = donationRepo;
            _context = context;
        }

        public async Task<IEnumerable<DonationRecordResponseDto>> GetAllDonations()
        {
            var donations = await _donationRepo.GetAllDonations();
            return donations.Select(MapToResponseDto);
        }

        public async Task<DonationRecordResponseDto> GetDonationById(int id)
        {
            var donation = await _donationRepo.GetDonationById(id);
            if (donation == null)
                throw new KeyNotFoundException($"Donation Record with Id {id} not found");

            return MapToResponseDto(donation);
        }

        public async Task<IEnumerable<DonationRecordResponseDto>> GetDonationsByDonor(int donorId)
        {
            var donations = await _donationRepo.GetDonationsByDonor(donorId);
            return donations.Select(MapToResponseDto);
        }

        public async Task<DonationRecordResponseDto> CreateDonation(DonationRecordCreateDto donationDto)
        {
            // Check if donation already exists for this donor to prevent duplicates
            var existingDonation = await _context.DonationRecords
                .FirstOrDefaultAsync(d => d.DonorId == donationDto.DonorId && 
                                         d.BloodBankId == donationDto.BloodBankId &&
                                         d.DonationDate.Date == DateTime.Now.Date);
            
            if (existingDonation != null)
            {
                return MapToResponseDto(existingDonation);
            }

            var donation = new DonationRecord
            {
                DonorId = donationDto.DonorId,
                BloodBankId = donationDto.BloodBankId,
                Quantity = donationDto.Quantity,
                Status = "Completed",
                DonationDate = DateTime.Now
            };

            var created = await _donationRepo.CreateDonation(donation);

            // Get donor info for blood group
            var donor = await _context.DonorProfiles
                .Include(d => d.User)
                .FirstOrDefaultAsync(d => d.Id == donationDto.DonorId);

            if (donor != null)
            {
                // Update blood stock
                var bloodStock = await _context.BloodStocks
                    .FirstOrDefaultAsync(bs => bs.BloodBankId == donationDto.BloodBankId && bs.BloodGroup == donor.BloodGroup);

                if (bloodStock != null)
                {
                    bloodStock.UnitsAvailable += donationDto.Quantity;
                    bloodStock.LastUpdated = DateTime.Now;
                }
                else
                {
                    // Create new blood stock entry if doesn't exist
                    var newBloodStock = new BloodStock
                    {
                        BloodBankId = donationDto.BloodBankId,
                        BloodGroup = donor.BloodGroup,
                        UnitsAvailable = donationDto.Quantity,
                        LastUpdated = DateTime.Now
                    };
                    _context.BloodStocks.Add(newBloodStock);
                }

                // Update donor's last donation date - CRITICAL FIX
                donor.LastDonationDate = DateTime.Now;
                _context.DonorProfiles.Update(donor);

                // Send thank you notification to donor
                var donorThankYou = new NotificationLog
                {
                    UserId = donor.UserId,
                    Message = $"Thank you for your generous blood donation of {donationDto.Quantity} units! Your contribution will help save lives.",
                    IsRead = false,
                    CreatedAt = DateTime.Now
                };
                _context.NotificationLogs.Add(donorThankYou);

                // Find and notify recipients who requested this blood group (within last 30 days)
                var thirtyDaysAgo = DateTime.Now.AddDays(-30);
                var pendingRequests = await _context.BloodRequests
                    .Include(br => br.Recipient).ThenInclude(r => r.User)
                    .Where(br => br.BloodGroupNeeded == donor.BloodGroup && 
                                br.Status == "Pending" && 
                                br.RequestDate >= thirtyDaysAgo)
                    .ToListAsync();

                foreach (var request in pendingRequests)
                {
                    var recipientNotification = new NotificationLog
                    {
                        UserId = request.Recipient.UserId,
                        Message = $"Good news! A donor has contributed {donor.BloodGroup} blood. Your request is being processed.",
                        IsRead = false,
                        CreatedAt = DateTime.Now
                    };
                    _context.NotificationLogs.Add(recipientNotification);
                }

                await _context.SaveChangesAsync();
            }

            return MapToResponseDto(created);
        }

        private DonationRecordResponseDto MapToResponseDto(DonationRecord donation)
        {
            // Reload with includes for proper mapping
            var donationWithIncludes = _context.DonationRecords
                .Include(d => d.Donor).ThenInclude(d => d.User)
                .Include(d => d.BloodBank)
                .FirstOrDefault(d => d.Id == donation.Id) ?? donation;

            return new DonationRecordResponseDto
            {
                Id = donationWithIncludes.Id,
                DonorId = donationWithIncludes.DonorId,
                DonorName = $"{donationWithIncludes.Donor?.User?.FirstName} {donationWithIncludes.Donor?.User?.LastName}".Trim(),
                BloodGroup = donationWithIncludes.Donor?.BloodGroup ?? "Unknown",
                BloodBankId = donationWithIncludes.BloodBankId,
                BloodBankName = donationWithIncludes.BloodBank?.Name ?? "Unknown",
                DonationDate = donationWithIncludes.DonationDate,
                Quantity = donationWithIncludes.Quantity,
                Status = donationWithIncludes.Status
            };
        }
    }
}