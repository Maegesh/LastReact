using BloodBankSystem.Models;

namespace BloodDonationSystem.Interfaces
{
    public interface INotificationLog
    {
        Task<IEnumerable<NotificationLog>> GetAllNotifications();
        Task<IEnumerable<NotificationLog>> GetNotificationsByUserId(int userId);
        Task<NotificationLog?> GetNotificationById(int id);
        Task<NotificationLog> CreateNotification(NotificationLog notification);
        Task<NotificationLog> MarkAsRead(int id);
        Task<int> GetUnreadCount(int userId);
    }
}