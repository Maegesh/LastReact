export interface NotificationLog {
  id: number;
  userId: number;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface CreateNotification {
  userId: number;
  message: string;
}