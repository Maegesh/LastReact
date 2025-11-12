using BloodBankSystem.Data;
using BloodBankSystem.Models;
using BloodDonationSystem.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BloodDonationSystem.Repositories
{
    public class NotificationLogRepo : INotificationLog
    {
        private readonly BloodContext _context;

        public NotificationLogRepo(BloodContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<NotificationLog>> GetAllNotifications()
        {
            return await _context.NotificationLogs
                .Include(n => n.User)
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<NotificationLog>> GetNotificationsByUserId(int userId)
        {
            return await _context.NotificationLogs
                .Include(n => n.User)
                .Where(n => n.UserId == userId)
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync();
        }

        public async Task<NotificationLog?> GetNotificationById(int id)
        {
            return await _context.NotificationLogs
                .Include(n => n.User)
                .FirstOrDefaultAsync(n => n.Id == id);
        }

        public async Task<NotificationLog> CreateNotification(NotificationLog notification)
        {
            await _context.NotificationLogs.AddAsync(notification);
            await _context.SaveChangesAsync();
            
            return await _context.NotificationLogs
                .Include(n => n.User)
                .FirstAsync(n => n.Id == notification.Id);
        }

        public async Task<NotificationLog> MarkAsRead(int id)
        {
            var notification = await _context.NotificationLogs.FindAsync(id);
            if (notification == null)
                throw new KeyNotFoundException($"Notification with Id {id} not found");

            notification.IsRead = true;
            await _context.SaveChangesAsync();
            return notification;
        }

        public async Task<int> GetUnreadCount(int userId)
        {
            return await _context.NotificationLogs
                .CountAsync(n => n.UserId == userId && !n.IsRead);
        }
    }
}