using BloodBankSystem.Models;
using BloodDonationSystem.Dtos;
using BloodDonationSystem.Interfaces;
using BloodBankSystem.Data;
using Microsoft.EntityFrameworkCore;

namespace BloodDonationSystem.Services
{
    public class DonorRequestLinkService
    {
        private readonly IDonorRequestLink _linkRepo;
        private readonly BloodContext _context;

        public DonorRequestLinkService(IDonorRequestLink linkRepo, BloodContext context)
        {
            _linkRepo = linkRepo;
            _context = context;
        }

        public async Task<IEnumerable<DonorRequestLinkResponseDto>> GetLinksByDonor(int donorId)
        {
            var links = await _linkRepo.GetLinksByDonor(donorId);
            return links.Select(MapToResponseDto);
        }

        public async Task<IEnumerable<DonorRequestLinkResponseDto>> GetLinksByRequest(int requestId)
        {
            var links = await _linkRepo.GetLinksByRequest(requestId);
            return links.Select(MapToResponseDto);
        }

        public async Task<DonorRequestLinkResponseDto> CreateLink(DonorRequestLinkCreateDto linkDto)
        {
            var link = new DonorRequestLink
            {
                DonorId = linkDto.DonorId,
                RequestId = linkDto.RequestId
            };

            var created = await _linkRepo.CreateLink(link);
            return MapToResponseDto(created);
        }

        public async Task RespondToRequest(int linkId, string responseStatus)
        {
            var link = await _context.DonorRequestLinks
                .Include(l => l.Donor).ThenInclude(d => d.User)
                .Include(l => l.Request).ThenInclude(r => r.Recipient).ThenInclude(rec => rec.User)
                .FirstOrDefaultAsync(l => l.Id == linkId);

            if (link == null)
                throw new KeyNotFoundException($"Link with Id {linkId} not found");

            // Store response in NotificationLog for tracking 
            var responseNotification = new NotificationLog
            {
                UserId = link.Donor.UserId,
                Message = $"RESPONSE:{linkId}:{responseStatus}:{DateTime.Now:yyyy-MM-dd HH:mm:ss}",
                IsRead = true 
            };
            _context.NotificationLogs.Add(responseNotification);

            // Notify recipient
            var recipientNotification = new NotificationLog
            {
                UserId = link.Request.Recipient.UserId,
                Message = $"Donor {link.Donor.User.FirstName} {link.Donor.User.LastName} has {responseStatus.ToLower()} your blood request."
            };
            _context.NotificationLogs.Add(recipientNotification);

            // Notify admin
            var admins = await _context.Users.Where(u => u.Role == UserRole.Admin).ToListAsync();
            foreach (var admin in admins)
            {
                var adminNotification = new NotificationLog
                {
                    UserId = admin.Id,
                    Message = $"Donor {link.Donor.User.FirstName} {link.Donor.User.LastName} has {responseStatus.ToLower()} blood request #{link.RequestId}."
                };
                _context.NotificationLogs.Add(adminNotification);
            }

            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<DonorRequestLinkResponseDto>> GetPendingRequestsForDonor(int donorId)
        {
            var pendingLinks = await _context.DonorRequestLinks
                .Include(l => l.Donor).ThenInclude(d => d.User)
                .Include(l => l.Request).ThenInclude(r => r.Recipient).ThenInclude(rec => rec.User)
                .Where(l => l.DonorId == donorId)
                .ToListAsync();

            return pendingLinks.Select(MapToResponseDto);
        }

        public async Task<DonorRequestLinkResponseDto> DeleteLink(int id)
        {
            var deleted = await _linkRepo.DeleteLink(id);
            return MapToResponseDto(deleted);
        }

        private DonorRequestLinkResponseDto MapToResponseDto(DonorRequestLink link)
        {
            // Check for response in NotificationLogs 
            var responseLog = _context.NotificationLogs
                .Where(n => n.UserId == link.DonorId && n.Message.StartsWith($"RESPONSE:{link.Id}:"))
                .OrderByDescending(n => n.CreatedAt)
                .FirstOrDefault();

            string responseStatus = "Pending";
            DateTime? responseDate = null;

            if (responseLog != null)
            {
                var parts = responseLog.Message.Split(':');
                if (parts.Length >= 4)
                {
                    responseStatus = parts[2];
                    if (DateTime.TryParse($"{parts[3]} {parts[4]}", out DateTime parsedDate))
                        responseDate = parsedDate;
                }
            }

            return new DonorRequestLinkResponseDto
            {
                Id = link.Id,
                DonorId = link.DonorId,
                DonorName = $"{link.Donor?.User?.FirstName} {link.Donor?.User?.LastName}".Trim(),
                BloodGroup = link.Donor?.BloodGroup ?? "Unknown",
                RequestId = link.RequestId,
                RecipientName = $"{link.Request?.Recipient?.User?.FirstName} {link.Request?.Recipient?.User?.LastName}".Trim(),
                HospitalName = link.Request?.Recipient?.HospitalName ?? "Unknown",
                QuantityNeeded = link.Request?.Quantity ?? 0,
                LinkedAt = link.LinkedAt,
                RequestStatus = link.Request?.Status ?? "Unknown",
                ResponseStatus = responseStatus,
                ResponseDate = responseDate
            };
        }
    }
}