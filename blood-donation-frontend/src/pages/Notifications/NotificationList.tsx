import { useState, useEffect } from 'react';
import { 
  Box, Typography, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Chip, IconButton, Tooltip 
} from '@mui/material';
import { MarkEmailRead } from '@mui/icons-material';
import { useCache } from '../../hooks/useCache';
import { fetchNotifications } from '../../store/notificationSlice';
import { notificationAPI } from '../../api/notification.api';
import type { NotificationLog } from '../../types/NotificationLog';
import type { User } from '../../types/User';
import Loader from '../../components/Loader';

interface NotificationWithUser extends NotificationLog {
  user?: User;
}

export default function NotificationList() {
  const { data: allNotifications, loading, loadData } = useCache('notifications', fetchNotifications);
  const [notifications, setNotifications] = useState<NotificationWithUser[]>([]);
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = currentUser.role === 0;

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (allNotifications) {
      if (isAdmin) {
        setNotifications(allNotifications);
      } else {
        const userNotifications = allNotifications.filter((n: any) => n.userId === currentUser.id);
        setNotifications(userNotifications);
      }
    }
  }, [allNotifications, isAdmin, currentUser.id]);

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await notificationAPI.markAsRead(notificationId);
      loadData(true);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  if (loading) return <Loader message="Loading notifications..." />;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', width: '100vw', p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ color: '#d32f2f', fontWeight: 'bold' }}>
        {isAdmin ? 'Notifications Management' : 'My Notifications'}
      </Typography>
      


      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: '#e3f2fd' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
              {isAdmin && <TableCell sx={{ fontWeight: 'bold' }}>User</TableCell>}
              <TableCell sx={{ fontWeight: 'bold' }}>Message</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(!notifications || notifications.length === 0) ? (
              <TableRow>
                <TableCell colSpan={isAdmin ? 6 : 5} sx={{ textAlign: 'center', py: 3 }}>
                  No notifications found
                </TableCell>
              </TableRow>
            ) : (
              notifications.map((notification) => (
                <TableRow 
                  key={notification.id} 
                  hover
                  sx={{ 
                    bgcolor: notification.isRead ? 'inherit' : '#fff3e0',
                    '&:hover': { bgcolor: notification.isRead ? '#f5f5f5' : '#ffecb3' }
                  }}
                >
                  <TableCell>{notification.id}</TableCell>
                  {isAdmin && (
                    <TableCell>
                      {notification.user ? `${notification.user.firstName || ''} ${notification.user.lastName || ''}`.trim() || notification.user.username : `User ${notification.userId}`}
                    </TableCell>
                  )}
                  <TableCell sx={{ maxWidth: 300, fontWeight: notification.isRead ? 'normal' : 'bold' }}>
                    {notification.message}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={notification.isRead ? 'Read' : 'Unread'}
                      color={notification.isRead ? 'success' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{new Date(notification.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {!notification.isRead && (
                      <Tooltip title="Mark as read">
                        <IconButton 
                          size="small"
                          onClick={() => handleMarkAsRead(notification.id)}
                          sx={{ color: '#1976d2' }}
                        >
                          <MarkEmailRead fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}