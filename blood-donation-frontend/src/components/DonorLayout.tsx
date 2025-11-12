import type { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Toolbar, Typography
} from '@mui/material';
import {
  Dashboard, Bloodtype, CalendarToday, History,
  Inventory, Business, Person
} from '@mui/icons-material';
import Navbar from '../components/Navbar';

const drawerWidth = 240;

const menuItems = [
  { text: 'Overview', icon: <Dashboard />, path: '/donor' },
  { text: 'Pending Requests', icon: <Bloodtype />, path: '/donor/requests' },
  { text: 'My Appointments', icon: <CalendarToday />, path: '/donor/appointments' },
  { text: 'Donation History', icon: <History />, path: '/donor/donations' },
  { text: 'My Profile', icon: <Person />, path: '/donor/profile' },
  { text: 'Blood Banks', icon: <Business />, path: '/donor/blood-banks' },
  { text: 'Blood Stock', icon: <Inventory />, path: '/donor/blood-stock' },
];

interface DonorLayoutProps {
  children: ReactNode;
}

export default function DonorLayout({ children }: DonorLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar 
        title="Donor Dashboard" 
        userInfo={currentUser.FirstName || currentUser.Email} 
      />
      
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            mt: 8, // Account for navbar height
          },
        }}
      >
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => navigate(item.path)}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: '#ffebee',
                    '&:hover': { backgroundColor: '#ffcdd2' },
                  },
                }}
              >
                <ListItemIcon sx={{ color: location.pathname === item.path ? '#d32f2f' : 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, bgcolor: '#f5f5f5', minHeight: '100vh', ml: `${drawerWidth}px`, mt: 8, p: 3 }}>
        {children}
      </Box>
    </Box>
  );
}