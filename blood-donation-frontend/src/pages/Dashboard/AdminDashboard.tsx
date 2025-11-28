import { useState, useEffect } from "react";
import {
  Box, Container, Typography, Tabs, Tab, Paper, Avatar, IconButton
} from '@mui/material';
import {
  Dashboard, People, Bloodtype, CalendarToday,
  Inventory, Notifications, Person, PersonAdd, Business,
  Logout
} from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchDashboardOverview } from '../../store/dashboardSlice';

let dashboardLoading = false;
import { useNavigate } from 'react-router-dom';
import { tokenstore } from '../../auth/tokenstore';
import { toast } from 'react-toastify';

// Import components
import Loader from "../../components/Loader.tsx";
import DashboardComponent from './Dashboard.tsx';
import BloodBankList from '../BloodBanks/BloodBankList.tsx';
import BloodRequestList from '../BloodRequests/BloodRequestList.tsx';
import UserList from '../Users/UserList.tsx';
import DonorList from '../Donors/DonorList.tsx';
import RecipientList from '../Recipients/RecipientList.tsx';
import DonationList from '../Donations/DonationList.tsx';
import AppointmentList from '../Appointments/AppointmentList.tsx';
import BloodStockList from '../BloodStock/BloodStockList.tsx';
import NotificationList from '../Notifications/NotificationList.tsx';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [countsState, setCountsState] = useState({ 
    bloodBanks: 0, 
    bloodRequests: 0, 
    users: 0, 
    donors: 0, 
    recipients: 0, 
    donations: 0, 
    appointments: 0, 
    bloodStock: 0, 
    notifications: 0 
  });
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { overview, overviewLoading, lastFetched } = useAppSelector(state => state.dashboard);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    loadData();
  }, [dispatch]);

  useEffect(() => {
    if (overview?.counts) {
      setCountsState(overview.counts);
    }
    setLoading(overviewLoading);
  }, [overview, overviewLoading]);

  const loadData = async () => {
    if (dashboardLoading || overviewLoading) return;
    
    const fiveMinutes = 5 * 60 * 1000;
    const shouldRefetch = !overview || !lastFetched || (Date.now() - lastFetched > fiveMinutes);
    
    if (shouldRefetch) {
      dashboardLoading = true;
      try {
        await dispatch(fetchDashboardOverview()).unwrap();
      } catch (error) {
        toast.error('Failed to load dashboard data');
      } finally {
        dashboardLoading = false;
      }
    }
  };



  const handleLogout = () => {
    tokenstore.clear();
    localStorage.removeItem('user');
    toast.info('Logged out successfully');
    navigate('/login');
  };

  const tabItems = [
    { icon: <Dashboard />, label: "Overview", color: "#1976d2" },
    { icon: <Business />, label: "Blood Banks", color: "#2e7d32" },
    { icon: <Bloodtype />, label: "Requests", color: "#d32f2f" },
    { icon: <People />, label: "Users", color: "#7b1fa2" },
    { icon: <PersonAdd />, label: "Donors", color: "#f57c00" },
    { icon: <Person />, label: "Recipients", color: "#5d4037" },
    { icon: <Bloodtype />, label: "Donations", color: "#c62828" },
    { icon: <CalendarToday />, label: "Appointments", color: "#00796b" },
    { icon: <Inventory />, label: "Blood Stock", color: "#455a64" },
    { icon: <Notifications />, label: "Notifications", color: "#e65100" }
  ];

  if (loading) return <Loader message="Loading dashboard..." />;

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      width: '100vw', 
      bgcolor: '#f5f7fa',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Modern Header */}
      <Paper sx={{ 
        bgcolor: '#dc2626',
        borderRadius: 0,
        boxShadow: '0 2px 8px rgba(220, 38, 38, 0.2)',
        borderBottom: '3px solid #b91c1c'
      }}>
        <Container maxWidth={false} sx={{ px: 3 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            py: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{
                width: 45,
                height: 45,
                borderRadius: '50% 50% 50% 0',
                bgcolor: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
                transform: 'rotate(-45deg)'
              }}>
                <Bloodtype sx={{ color: '#dc2626', transform: 'rotate(45deg)', fontSize: 22 }} />
              </Box>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'white' }}>
                  BloodConnect Admin
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                  Blood Donation Management System
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'white' }}>
                  {currentUser.firstName || 'Admin'} {currentUser.lastName || ''}
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                  System Administrator
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: 'white', color: '#dc2626', width: 40, height: 40, fontWeight: 'bold' }}>
                {(currentUser.firstName || 'A')[0]}
              </Avatar>
              <IconButton onClick={handleLogout} sx={{ color: 'white' }}>
                <Logout />
              </IconButton>
            </Box>
          </Box>
        </Container>
      </Paper>

      {/* Navigation Tabs */}
      <Paper sx={{ 
        bgcolor: 'white',
        borderRadius: 0,
        boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
        borderBottom: '2px solid #f1f5f9'
      }}>
        <Container maxWidth={false} sx={{ px: 3 }}>
          <Tabs 
            value={activeTab} 
            onChange={(_, newValue) => setActiveTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                minHeight: 64,
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '0.9rem',
                '&.Mui-selected': {
                  color: '#dc2626',
                  fontWeight: 'bold'
                }
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#dc2626',
                height: 4
              }
            }}
          >
            {tabItems.map((item, index) => (
              <Tab 
                key={index}
                icon={item.icon} 
                label={item.label}
                iconPosition="start"
                sx={{
                  '& .MuiSvgIcon-root': {
                    color: item.color,
                    mr: 1
                  }
                }}
              />
            ))}
          </Tabs>
        </Container>
      </Paper>

      {/* Content Area */}
      <Container maxWidth={false} sx={{ flex: 1, py: 4, px: 3 }}>
        {activeTab === 0 && (
          <DashboardComponent 
            bloodBanksCount={countsState.bloodBanks}
            bloodRequestsCount={countsState.bloodRequests}
            usersCount={countsState.users}
            donorsCount={countsState.donors}
            recipientsCount={countsState.recipients}
            donationsCount={countsState.donations}
            appointmentsCount={countsState.appointments}
            bloodStockCount={countsState.bloodStock}
            notificationsCount={countsState.notifications}
          />
        )}
        {activeTab === 1 && <BloodBankList showActions={true} />}
        {activeTab === 2 && <BloodRequestList showActions={true} />}
        {activeTab === 3 && <UserList />}
        {activeTab === 4 && <DonorList />}
        {activeTab === 5 && <RecipientList />}
        {activeTab === 6 && <DonationList />}
        {activeTab === 7 && <AppointmentList />}
        {activeTab === 8 && <BloodStockList />}
        {activeTab === 9 && <NotificationList />}
      </Container>
    </Box>
  );
}