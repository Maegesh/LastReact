using BloodBankSystem.Models;
using BloodDonationSystem.Dtos;
using BloodDonationSystem.Interfaces;

namespace BloodDonationSystem.Services
{
    public class NotificationLogService
    {
        private readonly INotificationLog _notificationRepo;

        public NotificationLogService(INotificationLog notificationRepo)
        {
            _notificationRepo = notificationRepo;
        }

        public async Task<IEnumerable<NotificationLogResponseDto>> GetAllNotifications()
        {
            var notifications = await _notificationRepo.GetAllNotifications();
            return notifications.Select(MapToResponseDto);
        }

        public async Task<IEnumerable<NotificationLogWithUserDto>> GetAllNotificationsWithUsers()
        {
            var notifications = await _notificationRepo.GetAllNotificationsWithUsers();
            return notifications.Select(MapToWithUserDto);
        }

        public async Task<IEnumerable<NotificationLogResponseDto>> GetNotificationsByUserId(int userId)
        {
            var notifications = await _notificationRepo.GetNotificationsByUserId(userId);
            return notifications.Select(MapToResponseDto);
        }

        public async Task<NotificationLogResponseDto> GetNotificationById(int id)
        {
            var notification = await _notificationRepo.GetNotificationById(id);
            if (notification == null)
                throw new KeyNotFoundException($"Notification with Id {id} not found");

            return MapToResponseDto(notification);
        }

        public async Task<NotificationLogResponseDto> CreateNotification(NotificationLogCreateDto notificationDto)
        {
            var notification = new NotificationLog
            {
                UserId = notificationDto.UserId,
                Message = notificationDto.Message,
                IsRead = false,
                CreatedAt = DateTime.Now
            };

            var created = await _notificationRepo.CreateNotification(notification);
            return MapToResponseDto(created);
        }

        public async Task<NotificationLogResponseDto> MarkAsRead(int id)
        {
            var updated = await _notificationRepo.MarkAsRead(id);
            return MapToResponseDto(updated);
        }

        public async Task<int> GetUnreadCount(int userId)
        {
            return await _notificationRepo.GetUnreadCount(userId);
        }

        private NotificationLogResponseDto MapToResponseDto(NotificationLog notification)
        {
            return new NotificationLogResponseDto
            {
                Id = notification.Id,
                UserId = notification.UserId,
                UserName = $"{notification.User?.FirstName} {notification.User?.LastName}".Trim(),
                Message = notification.Message,
                IsRead = notification.IsRead,
                CreatedAt = notification.CreatedAt
            };
        }

        private NotificationLogWithUserDto MapToWithUserDto(NotificationLog notification)
        {
            return new NotificationLogWithUserDto
            {
                Id = notification.Id,
                UserId = notification.UserId,
                Message = notification.Message,
                IsRead = notification.IsRead,
                CreatedAt = notification.CreatedAt,
                User = notification.User != null ? new UserDto
                {
                    Id = notification.User.Id,
                    FirstName = notification.User.FirstName,
                    LastName = notification.User.LastName,
                    Username = notification.User.Username,
                    Email = notification.User.Email
                } : null
            };
        }
    }
}