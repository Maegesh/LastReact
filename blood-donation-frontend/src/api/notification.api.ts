import { http } from './http';

export const notificationAPI = {
  // Admin only endpoints
  getAll: () => http.get('/NotificationLog'),
  getAllWithUsers: () => http.get('/NotificationLog/with-users'),
  
  // User-specific endpoints (works for all roles)
  getById: (id: number) => http.post('/NotificationLog/get-by-id', { id }),
  getByUser: (userId: number) => http.post('/NotificationLog/get-by-user', { userId }),
  getUnreadCount: (userId: number) => http.post('/NotificationLog/get-unread-count', { userId }),
  create: (data: any) => http.post('/NotificationLog', data),
  markAsRead: (id: number) => http.post('/NotificationLog/mark-as-read', { id })
};