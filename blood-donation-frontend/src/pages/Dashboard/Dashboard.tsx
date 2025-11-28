import { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, LinearProgress, Chip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import {
  TrendingUp, TrendingDown, People, Bloodtype, Business, 
  CalendarToday, Notifications, CheckCircle, Warning, 
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchDashboardOverview } from '../../store/dashboardSlice';

let dashboardOverviewLoading = false;

interface DashboardProps {
  bloodBanksCount: number;
  bloodRequestsCount: number;
  usersCount: number;
  donorsCount: number;
  recipientsCount: number;
  donationsCount: number;
  appointmentsCount: number;
  bloodStockCount: number;
  notificationsCount: number;
}

export default function Dashboard({ 
  bloodBanksCount, 
  bloodRequestsCount, 
  usersCount, 
  donorsCount,
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
  const dispatch = useAppDispatch();
  const { overview, overviewLoading, lastFetched } = useAppSelector(state => state.dashboard);

  useEffect(() => {
    loadDashboardData();
  }, [dispatch]);

  useEffect(() => {
    if (overview) {
      setRecentRequests(overview.recentRequests || []);
      setRecentAppointments(overview.recentAppointments || []);
      setSystemStats(overview.systemStats || {
        totalDonations: 0,
        pendingRequests: 0,
        completedRequests: 0,
        upcomingAppointments: 0,
        unreadNotifications: 0
      });
    }
    setLoading(overviewLoading);
  }, [overview, overviewLoading]);

  const loadDashboardData = async () => {
    if (dashboardOverviewLoading || overviewLoading || overview) return;
    
    const fiveMinutes = 5 * 60 * 1000;
    const shouldRefetch = !overview || !lastFetched || (Date.now() - lastFetched > fiveMinutes);
    
    if (shouldRefetch) {
      dashboardOverviewLoading = true;
      try {
        await dispatch(fetchDashboardOverview()).unwrap();
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        dashboardOverviewLoading = false;
      }
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: usersCount,
      icon: <People />,
      color: '#2563eb',
      bgColor: '#dbeafe',
      change: '+12%',
      trend: 'up'
    },
    {
      title: 'Blood Banks',
      value: bloodBanksCount,
      icon: <Business />,
      color: '#059669',
      bgColor: '#d1fae5',
      change: '+5%',
      trend: 'up'
    },
    {
      title: 'Active Donors',
      value: donorsCount,
      icon: <Bloodtype />,
      color: '#dc2626',
      bgColor: '#fee2e2',
      change: '+18%',
      trend: 'up'
    },
    {
      title: 'Blood Requests',
      value: bloodRequestsCount,
      icon: <CalendarToday />,
      color: '#7c2d12',
      bgColor: '#fed7aa',
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
            bgcolor: stat.bgColor,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            border: `2px solid ${stat.color}20`,
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
            }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 3,
                  bgcolor: stat.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 4px 12px ${stat.color}40`
                }}>
                  <Box sx={{ color: 'white', fontSize: 28 }}>
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
      <Card sx={{ 
        mb: 4, 
        borderRadius: 3, 
        bgcolor: '#f8fafc',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        border: '1px solid #e2e8f0'
      }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
            Quick Statistics
          </Typography>
          <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {quickStats.map((stat, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  bgcolor: stat.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 3px 10px ${stat.color}40`
                }}>
                  <Box sx={{ color: 'white', fontSize: 22 }}>
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
          bgcolor: '#fef2f2',
          boxShadow: '0 4px 12px rgba(220, 38, 38, 0.1)',
          border: '2px solid #fecaca'
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
          bgcolor: '#eff6ff',
          boxShadow: '0 4px 12px rgba(37, 99, 235, 0.1)',
          border: '2px solid #bfdbfe'
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
        bgcolor: '#f0fdf4',
        boxShadow: '0 4px 12px rgba(5, 150, 105, 0.1)',
        border: '2px solid #bbf7d0'
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
                  height: 10, 
                  borderRadius: 5,
                  bgcolor: '#dcfce7',
                  '& .MuiLinearProgress-bar': { bgcolor: '#059669', borderRadius: 5 }
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
                  height: 10, 
                  borderRadius: 5,
                  bgcolor: '#fef3c7',
                  '& .MuiLinearProgress-bar': { bgcolor: '#d97706', borderRadius: 5 }
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
                  height: 10, 
                  borderRadius: 5,
                  bgcolor: '#dbeafe',
                  '& .MuiLinearProgress-bar': { bgcolor: '#2563eb', borderRadius: 5 }
                }}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}