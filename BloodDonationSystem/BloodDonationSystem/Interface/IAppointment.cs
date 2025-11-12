using BloodBankSystem.Models;

namespace BloodDonationSystem.Interfaces
{
    public interface IAppointment
    {
        Task<IEnumerable<Appointment>> GetAllAppointments();
        Task<Appointment?> GetAppointmentById(int id);
        Task<IEnumerable<Appointment>> GetAppointmentsByDonor(int donorId);
        Task<IEnumerable<Appointment>> GetAppointmentsByBloodBank(int bloodBankId);
        Task<IEnumerable<Appointment>> GetUpcomingAppointments();
        Task<Appointment> CreateAppointment(Appointment appointment);
        Task<Appointment> UpdateAppointment(int id, Appointment appointment);
        Task<Appointment> CancelAppointment(int id);
    }
}