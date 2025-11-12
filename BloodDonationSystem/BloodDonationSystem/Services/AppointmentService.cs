using BloodBankSystem.Models;
using BloodDonationSystem.Dtos;
using BloodDonationSystem.Interfaces;
using BloodBankSystem.Data;
using Microsoft.EntityFrameworkCore;

namespace BloodDonationSystem.Services
{
    public class AppointmentService
    {
        private readonly IAppointment _appointmentRepo;
        private readonly BloodContext _context;

        public AppointmentService(IAppointment appointmentRepo, BloodContext context)
        {
            _appointmentRepo = appointmentRepo;
            _context = context;
        }

        public async Task<IEnumerable<AppointmentResponseDto>> GetAllAppointments()
        {
            var appointments = await _appointmentRepo.GetAllAppointments();
            return appointments.Select(MapToResponseDto);
        }

        public async Task<AppointmentResponseDto> GetAppointmentById(int id)
        {
            var appointment = await _appointmentRepo.GetAppointmentById(id);
            if (appointment == null)
                throw new KeyNotFoundException($"Appointment with Id {id} not found");

            return MapToResponseDto(appointment);
        }

        public async Task<IEnumerable<AppointmentResponseDto>> GetAppointmentsByDonor(int donorId)
        {
            var appointments = await _appointmentRepo.GetAppointmentsByDonor(donorId);
            return appointments.Select(MapToResponseDto);
        }

        public async Task<IEnumerable<AppointmentResponseDto>> GetUpcomingAppointments()
        {
            var appointments = await _appointmentRepo.GetUpcomingAppointments();
            return appointments.Select(MapToResponseDto);
        }

        public async Task<AppointmentResponseDto> CreateAppointment(AppointmentCreateDto appointmentDto)
        {
            // Validate appointment date is in future
            if (appointmentDto.AppointmentDate <= DateTime.Now)
                throw new InvalidOperationException("Appointment date must be in the future");

            var appointment = new Appointment
            {
                DonorId = appointmentDto.DonorId,
                BloodBankId = appointmentDto.BloodBankId,
                AppointmentDate = appointmentDto.AppointmentDate,
                Remarks = appointmentDto.Remarks
            };

            var created = await _appointmentRepo.CreateAppointment(appointment);

            // Get donor and blood bank info for notifications
            var donor = await _context.DonorProfiles
                .Include(d => d.User)
                .FirstOrDefaultAsync(d => d.Id == appointmentDto.DonorId);

            var bloodBank = await _context.BloodBanks
                .FirstOrDefaultAsync(bb => bb.Id == appointmentDto.BloodBankId);

            if (donor != null && bloodBank != null)
            {
                Console.WriteLine($"Creating notifications for donor {donor.UserId} and blood group {donor.BloodGroup}");
                
                // Send appointment confirmation to donor
                var donorNotification = new NotificationLog
                {
                    UserId = donor.UserId,
                    Message = $"Appointment scheduled at {bloodBank.Name} on {appointmentDto.AppointmentDate:MMM dd, yyyy 'at' hh:mm tt}. {appointmentDto.Remarks}"
                };
                _context.NotificationLogs.Add(donorNotification);

                // Only notify recipients who need this specific blood type
                var recipientsNeedingBlood = await _context.RecipientProfiles
                    .Include(r => r.User)
                    .Where(r => r.RequiredBloodGroup == donor.BloodGroup)
                    .ToListAsync();
                
                Console.WriteLine($"Found {recipientsNeedingBlood.Count} recipients needing {donor.BloodGroup} blood type");

                foreach (var recipient in recipientsNeedingBlood)
                {
                    if (recipient.User != null)
                    {
                        Console.WriteLine($"Creating notification for recipient UserId: {recipient.UserId} ({recipient.User.Username})");
                        var recipientNotification = new NotificationLog
                        {
                            UserId = recipient.UserId,
                            Message = $"Good news! {donor.BloodGroup} blood donation appointment scheduled at {bloodBank.Name} on {appointmentDto.AppointmentDate:MMM dd, yyyy 'at' hh:mm tt}. This matches your required blood type."
                        };
                        _context.NotificationLogs.Add(recipientNotification);
                    }
                }

                await _context.SaveChangesAsync();
                Console.WriteLine("All notifications saved successfully");
            }
            else
            {
                Console.WriteLine($"Missing data - Donor: {donor != null}, BloodBank: {bloodBank != null}");
            }

            return MapToResponseDto(created);
        }

        public async Task<AppointmentResponseDto> UpdateAppointment(int id, AppointmentUpdateDto appointmentDto)
        {
            var appointment = new Appointment
            {
                AppointmentDate = appointmentDto.AppointmentDate ?? default,
                Status = appointmentDto.Status,
                Remarks = appointmentDto.Remarks
            };

            var updated = await _appointmentRepo.UpdateAppointment(id, appointment);
            return MapToResponseDto(updated);
        }

        public async Task<AppointmentResponseDto> CancelAppointment(int id)
        {
            var cancelled = await _appointmentRepo.CancelAppointment(id);
            return MapToResponseDto(cancelled);
        }

        private AppointmentResponseDto MapToResponseDto(Appointment appointment)
        {
            return new AppointmentResponseDto
            {
                Id = appointment.Id,
                DonorId = appointment.DonorId,
                DonorName = $"{appointment.Donor?.User?.FirstName} {appointment.Donor?.User?.LastName}".Trim(),
                BloodGroup = appointment.Donor?.BloodGroup ?? "Unknown",
                BloodBankId = appointment.BloodBankId,
                BloodBankName = appointment.BloodBank?.Name ?? "Unknown",
                AppointmentDate = appointment.AppointmentDate,
                Status = appointment.Status,
                Remarks = appointment.Remarks
            };
        }
    }
}