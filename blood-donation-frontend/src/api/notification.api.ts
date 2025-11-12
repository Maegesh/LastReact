import { http } from './http';

export const notificationAPI = {
  getAll: () => http.get('/NotificationLog'),
  getById: (id: number) => http.get(`/NotificationLog/${id}`),
  getByUser: (userId: number) => http.get(`/NotificationLog/user/${userId}`),
  getUnreadCount: (userId: number) => http.get(`/NotificationLog/unread/${userId}`),
  create: (data: any) => http.post('/NotificationLog', data),
  markAsRead: (id: number) => http.put(`/NotificationLog/${id}/read`)
};