import { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, LinearProgress, Chip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';
import {
  TrendingUp, TrendingDown, People, Bloodtype, Business, 
  CalendarToday, Notifications, CheckCircle, Warning, Error
} from '@mui/icons-material';
import { bloodRequestAPI } from '../api/bloodRequest.api';
import { appointmentAPI } from '../api/appointment.api';
import { donationAPI } from '../api/donation.api';
import { notificationAPI } from '../api/notification.api';

interface DashboardProps {
  bloodBanksCount: number;
  bloodRequestsCount: number;
  usersCount: number;
  donorsCount: number;
}

export default function Dashboard({ 
  bloodBanksCount, 
  bloodRequestsCount, 
  usersCount, 
  donorsCount 
}: DashboardProps) {
  const [recentRequests, setRecentRequests] = useState([]);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [systemStats, setSystemStats] = useState({
    totalDonations: 0,
    pendingRequests: 0,
    completedRequests: 0,
    upcomingAppointments: 0,
    unreadNotifications: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      const [requestsRes, appointmentsRes, donationsRes, notificationsRes] = await Promise.all([
        bloodRequestAPI.getAll().catch(() => ({ data: [] })),
        appointmentAPI.getAll().catch(() => ({ data: [] })),
        donationAPI.getAll().catch(() => ({ data: [] })),
        notificationAPI.getAll().catch(() => ({ data: [] }))
      ]);

      const requests = requestsRes.data || [];
      const appointments = appointmentsRes.data || [];
      const donations = donationsRes.data || [];
      const notifications = notificationsRes.data || [];

      setRecentRequests(requests.slice(0, 5));
      setRecentAppointments(appointments.slice(0, 5));
      
      setSystemStats({
        totalDonations: donations.length,
        pendingRequests: requests.filter((r: any) => r.status === 'Pending').length,
        completedRequests: requests.filter((r: any) => r.status === 'Completed' || r.status === 'Fulfilled').length,
        upcomingAppointments: appointments.filter((a: any) => new Date(a.appointmentDate) > new Date()).length,
        unreadNotifications: notifications.filter((n: any) => !n.isRead).length
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: usersCount,
      icon: <People />,
      color: '#3b82f6',
      bgColor: '#eff6ff',
      change: '+12%',
      trend: 'up'
    },
    {
      title: 'Blood Banks',
      value: bloodBanksCount,
      icon: <Business />,
      color: '#10b981',
      bgColor: '#f0fdf4',
      change: '+5%',
      trend: 'up'
    },
    {
      title: 'Active Donors',
      value: donorsCount,
      icon: <Bloodtype />,
      color: '#f59e0b',
      bgColor: '#fffbeb',
      change: '+18%',
      trend: 'up'
    },
    {
      title: 'Blood Requests',
      value: bloodRequestsCount,
      icon: <CalendarToday />,
      color: '#ef4444',
      bgColor: '#fef2f2',
      change: '+8%',
      trend: 'up'
    }
  ];

  const quickStats = [
    {
      label: 'Total Donations',
      value: systemStats.totalDonations,
      icon: <Bloodtype />,
      color: '#dc2626'
    },
    {
      label: 'Pending Requests',
      value: systemStats.pendingRequests,
      icon: <Warning />,
      color: '#f59e0b'
    },
    {
      label: 'Completed Requests',
      value: systemStats.completedRequests,
      icon: <CheckCircle />,
      color: '#10b981'
    },
    {
      label: 'Upcoming Appointments',
      value: systemStats.upcomingAppointments,
      icon: <CalendarToday />,
      color: '#3b82f6'
    },
    {
      label: 'Unread Notifications',
      value: systemStats.unreadNotifications,
      icon: <Notifications />,
      color: '#8b5cf6'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'warning';
      case 'approved': return 'info';
      case 'completed': case 'fulfilled': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1e293b', mb: 1 }}>
        System Overview
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Welcome to your blood donation management dashboard
      </Typography>

      {/* Main Statistics Cards */}
      <Box sx={{ display: 'flex', gap: 3, mb: 4, flexWrap: 'wrap' }}>
        {statCards.map((stat, index) => (
          <Card key={index} sx={{ 
            flex: 1, 
            minWidth: 250,
            borderRadius: 3,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #f1f5f9'
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  bgcolor: stat.bgColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Box sx={{ color: stat.color }}>
                    {stat.icon}
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {stat.trend === 'up' ? (
                    <TrendingUp sx={{ fontSize: 16, color: '#10b981' }} />
                  ) : (
                    <TrendingDown sx={{ fontSize: 16, color: '#ef4444' }} />
                  )}
                  <Typography variant="body2" sx={{ 
                    color: stat.trend === 'up' ? '#10b981' : '#ef4444',
                    fontWeight: 'bold'
                  }}>
                    {stat.change}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#1e293b', mb: 1 }}>
                {stat.value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stat.title}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Quick Stats Row */}
      <Card sx={{ mb: 4, borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
            Quick Statistics
          </Typography>
          <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {quickStats.map((stat, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  bgcolor: `${stat.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Box sx={{ color: stat.color, fontSize: 20 }}>
                    {stat.icon}
                  </Box>
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        {/* Recent Blood Requests */}
        <Card sx={{ 
          flex: 1, 
          minWidth: 400,
          borderRadius: 3,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
              Recent Blood Requests
            </Typography>
            {loading ? (
              <LinearProgress />
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Blood Group</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Quantity</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentRequests.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} sx={{ textAlign: 'center', py: 2 }}>
                          No recent requests
                        </TableCell>
                      </TableRow>
                    ) : (
                      recentRequests.map((request: any) => (
                        <TableRow key={request.id} hover>
                          <TableCell>#{request.id}</TableCell>
                          <TableCell>
                            <Chip 
                              label={request.bloodGroupNeeded} 
                              size="small"
                              sx={{ bgcolor: '#d32f2f', color: 'white' }}
                            />
                          </TableCell>
                          <TableCell>{request.quantity} units</TableCell>
                          <TableCell>
                            <Chip 
                              label={request.status} 
                              size="small"
                              color={getStatusColor(request.status)}
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>

        {/* Recent Appointments */}
        <Card sx={{ 
          flex: 1, 
          minWidth: 400,
          borderRadius: 3,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
              Recent Appointments
            </Typography>
            {loading ? (
              <LinearProgress />
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Donor</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentAppointments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} sx={{ textAlign: 'center', py: 2 }}>
                          No recent appointments
                        </TableCell>
                      </TableRow>
                    ) : (
                      recentAppointments.map((appointment: any) => (
                        <TableRow key={appointment.id} hover>
                          <TableCell>#{appointment.id}</TableCell>
                          <TableCell>{appointment.donorName || `Donor ${appointment.donorId}`}</TableCell>
                          <TableCell>{new Date(appointment.appointmentDate).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Chip 
                              label={appointment.status || 'Scheduled'} 
                              size="small"
                              color={getStatusColor(appointment.status || 'Scheduled')}
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* System Health Indicators */}
      <Card sx={{ 
        mt: 4,
        borderRadius: 3,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
            System Health
          </Typography>
          <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            <Box sx={{ flex: 1, minWidth: 200 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Request Processing</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>85%</Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={85} 
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  bgcolor: '#f1f5f9',
                  '& .MuiLinearProgress-bar': { bgcolor: '#10b981' }
                }}
              />
            </Box>
            <Box sx={{ flex: 1, minWidth: 200 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Blood Bank Capacity</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>72%</Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={72} 
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  bgcolor: '#f1f5f9',
                  '& .MuiLinearProgress-bar': { bgcolor: '#f59e0b' }
                }}
              />
            </Box>
            <Box sx={{ flex: 1, minWidth: 200 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Donor Engagement</Typography>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>91%</Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={91} 
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  bgcolor: '#f1f5f9',
                  '& .MuiLinearProgress-bar': { bgcolor: '#3b82f6' }
                }}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}