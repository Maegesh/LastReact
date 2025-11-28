using BloodBankSystem.Models;
using BloodDonationSystem.Dtos;
using BloodBankSystem.Data;
using Microsoft.EntityFrameworkCore;
using BloodDonationSystem.Interfaces;

namespace BloodDonationSystem.Services
{
    public class BloodRequestService
    {
        private readonly IBloodRequest _bloodRequestRepo;
        private readonly BloodContext _context;

        public BloodRequestService(IBloodRequest bloodRequestRepo, BloodContext context)
        {
            _bloodRequestRepo = bloodRequestRepo;
            _context = context;
        }

        public async Task<IEnumerable<BloodRequestResponseDto>> GetAllBloodRequests()
        {
            var requests = await _bloodRequestRepo.GetAllBloodRequests();
            return requests.Select(MapToResponseDto);
        }

        public async Task<BloodRequestResponseDto> GetBloodRequestById(int id)
        {
            var request = await _bloodRequestRepo.GetBloodRequestById(id);
            if (request == null)
                throw new KeyNotFoundException($"Blood Request with Id {id} not found");

            return MapToResponseDto(request);
        }

        public async Task<IEnumerable<BloodRequestResponseDto>> GetBloodRequestsByRecipient(int recipientId)
        {
            var requests = await _bloodRequestRepo.GetBloodRequestsByRecipient(recipientId);
            return requests.Select(MapToResponseDto);
        }

        public async Task<IEnumerable<BloodRequestResponseDto>> GetBloodRequestsByBloodGroup(string bloodGroup)
        {
            var requests = await _bloodRequestRepo.GetBloodRequestsByBloodGroup(bloodGroup);
            return requests.Select(MapToResponseDto);
        }

        public async Task<IEnumerable<BloodRequestResponseDto>> GetPendingBloodRequests()
        {
            var requests = await _bloodRequestRepo.GetPendingBloodRequests();
            return requests.Select(MapToResponseDto);
        }

        public async Task<BloodRequestResponseDto> CreateBloodRequest(BloodRequestCreateDto requestDto)
        {
            try
            {
                // Find recipient profile for the user
                var recipientProfile = await _context.RecipientProfiles
                    .Include(r => r.User)
                    .FirstOrDefaultAsync(r => r.UserId == requestDto.RecipientId);

                if (recipientProfile == null)
                {
                    throw new InvalidOperationException("Recipient profile not found. Please create your profile first.");
                }

                var bloodRequest = new BloodRequest
                {
                    RecipientId = recipientProfile.Id, // Use RecipientProfile ID, not User ID
                    BloodGroupNeeded = requestDto.BloodGroupNeeded,
                    Quantity = requestDto.Quantity
                };

                var created = await _bloodRequestRepo.CreateBloodRequest(bloodRequest);

                // Auto-notify matching donors and admin
                await NotifyMatchingDonors(created);

                return MapToResponseDto(created);
            }
            catch (Exception ex)
            {
                // Log the actual error for debugging
                Console.WriteLine($"Error creating blood request: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                throw;
            }
        }

        private async Task NotifyMatchingDonors(BloodRequest request)
        {
            // Find matching eligible donors
            var matchingDonors = await _context.DonorProfiles
                .Include(d => d.User)
                .Where(d => d.BloodGroup == request.BloodGroupNeeded && d.EligibilityStatus == true)
                .ToListAsync();

            // Create links and notify each donor
            foreach (var donor in matchingDonors)
            {
                // Create donor-request link
                var link = new DonorRequestLink
                {
                    DonorId = donor.Id,
                    RequestId = request.Id
                };
                _context.DonorRequestLinks.Add(link);

                // Notify donor
                var notification = new NotificationLog
                {
                    UserId = donor.UserId,
                    Message = $"New blood request: {request.BloodGroupNeeded} ({request.Quantity} units needed). Please accept or decline."
                };
                _context.NotificationLogs.Add(notification);
            }

            // Notify admin
            var admins = await _context.Users.Where(u => u.Role == UserRole.Admin).ToListAsync();
            foreach (var admin in admins)
            {
                var adminNotification = new NotificationLog
                {
                    UserId = admin.Id,
                    Message = $"New blood request: {request.BloodGroupNeeded} ({request.Quantity} units). {matchingDonors.Count} donors notified."
                };
                _context.NotificationLogs.Add(adminNotification);
            }

            await _context.SaveChangesAsync();
        }

        public async Task<BloodRequestResponseDto> UpdateBloodRequest(int id, BloodRequestUpdateDto requestDto)
        {
            var bloodRequest = new BloodRequest
            {
                Status = requestDto.Status
            };

            var updated = await _bloodRequestRepo.UpdateBloodRequest(id, bloodRequest);

            // Notify recipient about status change
            await NotifyRecipientStatusChange(updated, requestDto.Status);

            
            return MapToResponseDto(updated);
        }


        private async Task NotifyRecipientStatusChange(BloodRequest request, string newStatus)
        {
            try
            {
                Console.WriteLine($"NotifyRecipientStatusChange called for request {request.Id}, status: {newStatus}");

                // Get the recipient's user ID
                var recipient = await _context.RecipientProfiles
                    .Include(r => r.User)
                    .FirstOrDefaultAsync(r => r.Id == request.RecipientId);

                Console.WriteLine($"Found recipient: {recipient?.User?.Username} (UserId: {recipient?.UserId})");

                if (recipient?.User != null)
                {
                    string message = newStatus.ToLower() switch
                    {
                        "approved" => $"Good news! Your blood request for {request.BloodGroupNeeded} ({request.Quantity} units) has been approved.",
                        "cancelled" => $"Your blood request for {request.BloodGroupNeeded} ({request.Quantity} units) has been cancelled.",
                        "fulfilled" => $"Great! Your blood request for {request.BloodGroupNeeded} ({request.Quantity} units) has been fulfilled.",
                        _ => $"Your blood request for {request.BloodGroupNeeded} ({request.Quantity} units) status has been updated to {newStatus}."
                    };

                    Console.WriteLine($"Creating notification for UserId {recipient.UserId}: {message}");

                    var notification = new NotificationLog
                    {
                        UserId = recipient.UserId,
                        Message = message
                    };

                    _context.NotificationLogs.Add(notification);

                    // When recipient marks as fulfilled, notify donors and admin
                    if (newStatus.ToLower() == "fulfilled")
                    {
                        await NotifyDonorsAndAdminOfFulfillment(request);
                    }

                    await _context.SaveChangesAsync();
                    Console.WriteLine("Recipient notification saved successfully");
                }
                else
                {
                    Console.WriteLine($"Recipient not found for request {request.Id}, RecipientId: {request.RecipientId}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating recipient notification: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                // Don't throw - notification failure shouldn't break the update
            }
        }

        private async Task NotifyDonorsAndAdminOfFulfillment(BloodRequest request)
        {
            try
            {
                // Only notify admins when recipient marks as fulfilled
                // Don't notify all donors - only the specific donor who fulfilled it gets notified in FulfillBloodRequest method
                var admins = await _context.Users.Where(u => u.Role == UserRole.Admin).ToListAsync();
                foreach (var admin in admins)
                {
                    var adminNotification = new NotificationLog
                    {
                        UserId = admin.Id,
                        Message = $"Blood request #{request.Id} for {request.BloodGroupNeeded} ({request.Quantity} units) has been marked as fulfilled by the recipient."
                    };
                    _context.NotificationLogs.Add(adminNotification);
                }

                Console.WriteLine($"Created fulfillment notifications for {admins.Count} admins");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error notifying admin of fulfillment: {ex.Message}");
            }
        }

        private async Task UpdateBloodStock(int bloodBankId, string bloodGroup, int quantity)
        {
            try
            {
                // Find existing blood stock record
                var bloodStock = await _context.BloodStocks
                    .FirstOrDefaultAsync(bs => bs.BloodBankId == bloodBankId && bs.BloodGroup == bloodGroup);

                if (bloodStock != null)
                {
                    // Update existing stock
                    bloodStock.UnitsAvailable += quantity;
                    bloodStock.LastUpdated = DateTime.Now;
                    Console.WriteLine($"Updated blood stock: {bloodGroup} at BloodBank {bloodBankId}, new quantity: {bloodStock.UnitsAvailable}");
                }
                else
                {
                    // Create new stock record
                    bloodStock = new BloodStock
                    {
                        BloodBankId = bloodBankId,
                        BloodGroup = bloodGroup,
                        UnitsAvailable = quantity,
                        LastUpdated = DateTime.Now
                    };
                    _context.BloodStocks.Add(bloodStock);
                    Console.WriteLine($"Created new blood stock: {bloodGroup} at BloodBank {bloodBankId}, quantity: {quantity}");
                }

                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating blood stock: {ex.Message}");
            }
        }

        public async Task<BloodRequestResponseDto> DeleteBloodRequest(int id)
        {
            var deleted = await _bloodRequestRepo.DeleteBloodRequest(id);
            return MapToResponseDto(deleted);
        }

        public async Task<BloodRequestResponseDto> DonorResponse(int requestId, int donorId, string response)
        {
            var request = await _context.BloodRequests
                .Include(br => br.Recipient).ThenInclude(r => r.User)
                .FirstOrDefaultAsync(br => br.Id == requestId);

            if (request == null)
                throw new KeyNotFoundException($"Blood Request with Id {requestId} not found");

            var donor = await _context.DonorProfiles
                .Include(d => d.User)
                .FirstOrDefaultAsync(d => d.Id == donorId);

            if (donor == null)
                throw new KeyNotFoundException($"Donor with Id {donorId} not found");

            // Update request status based on donor response
            if (response.ToLower() == "accept")
            {
                request.Status = "Approved";

                // Notify admin about donor acceptance
                var admins = await _context.Users.Where(u => u.Role == UserRole.Admin).ToListAsync();
                foreach (var admin in admins)
                {
                    var adminNotification = new NotificationLog
                    {
                        UserId = admin.Id,
                        Message = $"Donor {donor.User.FirstName} {donor.User.LastName} accepted blood request #{requestId} for {request.BloodGroupNeeded} ({request.Quantity} units)."
                    };
                    _context.NotificationLogs.Add(adminNotification);
                }

                // Notify recipient about acceptance
                var recipientNotification = new NotificationLog
                {
                    UserId = request.Recipient.UserId,
                    Message = $"Good news! A donor has accepted your blood request for {request.BloodGroupNeeded} ({request.Quantity} units)."
                };
                _context.NotificationLogs.Add(recipientNotification);
            }
            else
            {
                // For decline, just log it (don't change request status as other donors might accept)
                var adminNotification = new NotificationLog
                {
                    UserId = (await _context.Users.FirstAsync(u => u.Role == UserRole.Admin)).Id,
                    Message = $"Donor {donor.User.FirstName} {donor.User.LastName} declined blood request #{requestId} for {request.BloodGroupNeeded} ({request.Quantity} units)."
                };
                _context.NotificationLogs.Add(adminNotification);
            }

            await _context.SaveChangesAsync();
            return MapToResponseDto(request);
        }

        public async Task<BloodRequestResponseDto> FulfillBloodRequest(int requestId, int donorId)
        {
            var request = await _context.BloodRequests
                .Include(br => br.Recipient).ThenInclude(r => r.User)
                .FirstOrDefaultAsync(br => br.Id == requestId);

            if (request == null)
                throw new KeyNotFoundException($"Blood Request with Id {requestId} not found");

            var donor = await _context.DonorProfiles
                .Include(d => d.User)
                .FirstOrDefaultAsync(d => d.Id == donorId);

            if (donor == null)
                throw new KeyNotFoundException($"Donor with Id {donorId} not found");

            // Update blood request status
            request.Status = "Fulfilled";

            // Get default blood bank
            var bloodBank = await _context.BloodBanks.FirstOrDefaultAsync();
            if (bloodBank == null)
                throw new InvalidOperationException("No blood bank available");

            // Create donation record for ONLY this specific donor
            var donation = new DonationRecord
            {
                DonorId = donorId,
                BloodBankId = bloodBank.Id,
                DonationDate = DateTime.Now,
                Quantity = request.Quantity,
                Status = "Completed"
            };
            _context.DonationRecords.Add(donation);

            // Update donor's last donation date
            donor.LastDonationDate = DateTime.Now;
            _context.DonorProfiles.Update(donor);

            // Update eligibility status based on new donation date
            donor.EligibilityStatus = false; // Not eligible for next 90 days

            // Update blood stock
            var bloodStock = await _context.BloodStocks
                .FirstOrDefaultAsync(bs => bs.BloodBankId == bloodBank.Id && bs.BloodGroup == donor.BloodGroup);

            if (bloodStock != null)
            {
                bloodStock.UnitsAvailable += request.Quantity;
                bloodStock.LastUpdated = DateTime.Now;
            }
            else
            {
                var newBloodStock = new BloodStock
                {
                    BloodBankId = bloodBank.Id,
                    BloodGroup = donor.BloodGroup,
                    UnitsAvailable = request.Quantity,
                    LastUpdated = DateTime.Now
                };
                _context.BloodStocks.Add(newBloodStock);
            }

            // Notify donor
            var donorNotification = new NotificationLog
            {
                UserId = donor.UserId,
                Message = $"Thank you for your donation! Blood request #{requestId} has been fulfilled.",
                IsRead = false,
                CreatedAt = DateTime.Now
            };
            _context.NotificationLogs.Add(donorNotification);

            // Notify recipient
            var recipientNotification = new NotificationLog
            {
                UserId = request.Recipient.UserId,
                Message = $"Your blood request for {request.BloodGroupNeeded} ({request.Quantity} units) has been fulfilled!",
                IsRead = false,
                CreatedAt = DateTime.Now
            };
            _context.NotificationLogs.Add(recipientNotification);

            await _context.SaveChangesAsync();

            return MapToResponseDto(request);
        }

        private BloodRequestResponseDto MapToResponseDto(BloodRequest request)
        {
            return new BloodRequestResponseDto
            {
                Id = request.Id,
                RecipientId = request.RecipientId,
                RecipientName = $"{request.Recipient?.User?.FirstName} {request.Recipient?.User?.LastName}".Trim(),
                HospitalName = request.Recipient?.HospitalName ?? "Unknown Hospital",
                BloodGroupNeeded = request.BloodGroupNeeded,
                Quantity = request.Quantity,
                RequestDate = request.RequestDate,
                Status = request.Status,
                LinkedDonorsCount = request.DonorRequestLinks?.Count ?? 0
            };
        }
    }
}