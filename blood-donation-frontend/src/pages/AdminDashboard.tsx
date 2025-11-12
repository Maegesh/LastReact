import { useState, useEffect } from "react";
import {
  Box, Container, Typography, Tabs, Tab, Paper, Avatar, IconButton
} from '@mui/material';
import {
  Dashboard, People, Bloodtype, CalendarToday,
  Inventory, Notifications, Person, PersonAdd, Business,
  Logout, Settings
} from '@mui/icons-material';
import { bloodBankAPI } from '../api/bloodBank.api';
import { bloodRequestAPI } from '../api/bloodRequest.api';
import { userAPI } from '../api/user.api';
import { donorAPI } from '../api/donor.api';
import { useNavigate } from 'react-router-dom';
import { tokenstore } from '../auth/tokenstore';

// Import components
import Loader from "../components/Loader.tsx";
import DashboardComponent from './Dashboard.tsx';
import BloodBankList from './BloodBanks/BloodBankList.tsx';
import BloodRequestList from './BloodRequests/BloodRequestList.tsx';
import UserList from './Users/UserList.tsx';
import DonorList from './Donors/DonorList.tsx';
import RecipientList from './Recipients/RecipientList.tsx';
import DonationList from './Donations/DonationList.tsx';
import AppointmentList from './Appointments/AppointmentList.tsx';
import BloodStockList from './BloodStock/BloodStockList.tsx';
import NotificationList from './Notifications/NotificationList.tsx';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({ bloodBanks: 0, bloodRequests: 0, users: 0, donors: 0 });
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [banksRes, requestsRes, usersRes, donorsRes] = await Promise.all([
        bloodBankAPI.getAll().catch(() => ({ data: [] })),
        bloodRequestAPI.getAll().catch(() => ({ data: [] })),
        userAPI.getAll().catch(() => ({ data: [] })),
        donorAPI.getAll().catch(() => ({ data: [] }))
      ]);
      
      setCounts({
        bloodBanks: (banksRes.data || []).length,
        bloodRequests: (requestsRes.data || []).length,
        users: (usersRes.data || []).length,
        donors: (donorsRes.data || []).length
      });
    } catch (error) {
      console.error("Error loading data:", error);
      setCounts({ bloodBanks: 0, bloodRequests: 0, users: 0, donors: 0 });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    tokenstore.clear();
    localStorage.removeItem('user');
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
      bgcolor: '#f8fafc',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Modern Header */}
      <Paper sx={{ 
        bgcolor: 'white',
        borderRadius: 0,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        borderBottom: '1px solid #e2e8f0'
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
                width: 40,
                height: 40,
                borderRadius: '50% 50% 50% 0',
                bgcolor: '#d32f2f',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
                transform: 'rotate(-45deg)'
              }}>
                <Bloodtype sx={{ color: 'white', transform: 'rotate(45deg)', fontSize: 20 }} />
              </Box>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1e293b' }}>
                  BloodConnect Admin
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Blood Donation Management System
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  {currentUser.firstName || 'Admin'} {currentUser.lastName || ''}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  System Administrator
                </Typography>
              </Box>
              <Avatar sx={{ bgcolor: '#d32f2f', width: 40, height: 40 }}>
                {(currentUser.firstName || 'A')[0]}
              </Avatar>
              <IconButton onClick={handleLogout} sx={{ color: '#64748b' }}>
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
        boxShadow: 'none',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <Container maxWidth={false} sx={{ px: 3 }}>
          <Tabs 
            value={activeTab} 
            onChange={(e, newValue) => setActiveTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                minHeight: 64,
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '0.9rem',
                '&.Mui-selected': {
                  color: '#d32f2f'
                }
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#d32f2f',
                height: 3
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
      <Container maxWidth={false} sx={{ flex: 1, py: 3, px: 3 }}>
        {activeTab === 0 && (
          <DashboardComponent 
            bloodBanksCount={counts.bloodBanks}
            bloodRequestsCount={counts.bloodRequests}
            usersCount={counts.users}
            donorsCount={counts.donors}
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