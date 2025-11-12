using BloodBankSystem.Data;
using BloodBankSystem.Models;
using BloodDonationSystem.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BloodDonationSystem.Repositories
{
    public class AppointmentRepo : IAppointment
    {
        private readonly BloodContext _context;

        public AppointmentRepo(BloodContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Appointment>> GetAllAppointments()
        {
            return await _context.Appointments
                .Include(a => a.Donor)
                    .ThenInclude(d => d.User)
                .Include(a => a.BloodBank)
                .OrderBy(a => a.AppointmentDate)
                .ToListAsync();
        }

        public async Task<Appointment?> GetAppointmentById(int id)
        {
            return await _context.Appointments
                .Include(a => a.Donor)
                    .ThenInclude(d => d.User)
                .Include(a => a.BloodBank)
                .FirstOrDefaultAsync(a => a.Id == id);
        }

        public async Task<IEnumerable<Appointment>> GetAppointmentsByDonor(int donorId)
        {
            return await _context.Appointments
                .Include(a => a.Donor)
                    .ThenInclude(d => d.User)
                .Include(a => a.BloodBank)
                .Where(a => a.DonorId == donorId)
                .OrderBy(a => a.AppointmentDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<Appointment>> GetAppointmentsByBloodBank(int bloodBankId)
        {
            return await _context.Appointments
                .Include(a => a.Donor)
                    .ThenInclude(d => d.User)
                .Include(a => a.BloodBank)
                .Where(a => a.BloodBankId == bloodBankId)
                .OrderBy(a => a.AppointmentDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<Appointment>> GetUpcomingAppointments()
        {
            return await _context.Appointments
                .Include(a => a.Donor)
                    .ThenInclude(d => d.User)
                .Include(a => a.BloodBank)
                .Where(a => a.AppointmentDate >= DateTime.Now && a.Status == "Scheduled")
                .OrderBy(a => a.AppointmentDate)
                .ToListAsync();
        }

        public async Task<Appointment> CreateAppointment(Appointment appointment)
        {
            appointment.Status = "Scheduled";
            await _context.Appointments.AddAsync(appointment);
            await _context.SaveChangesAsync();
            return appointment;
        }

        public async Task<Appointment> UpdateAppointment(int id, Appointment appointment)
        {
            var existing = await _context.Appointments.FindAsync(id);
            if (existing == null)
                throw new KeyNotFoundException($"Appointment with Id {id} not found");

            if (appointment.AppointmentDate != default)
                existing.AppointmentDate = appointment.AppointmentDate;
            
            existing.Status = appointment.Status ?? existing.Status;
            existing.Remarks = appointment.Remarks ?? existing.Remarks;

            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<Appointment> CancelAppointment(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null)
                throw new KeyNotFoundException($"Appointment with Id {id} not found");

            appointment.Status = "Cancelled";
            await _context.SaveChangesAsync();
            return appointment;
        }
    }
}