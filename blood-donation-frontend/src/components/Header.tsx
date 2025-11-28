import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Box, Avatar, IconButton, Menu, MenuItem,
  Badge, Chip
} from '@mui/material';
import {
  Bloodtype, Notifications, Logout, Person, Dashboard
} from '@mui/icons-material';
import { tokenstore } from '../auth/tokenstore';
import { useAppDispatch } from '../store/hooks';
import { clearDonorData } from '../store/donationSlice';

interface HeaderProps {
  userType: 'donor' | 'recipient';
  notificationCount?: number;
  onProfileClick?: () => void;
}

export default function Header({ userType, notificationCount = 0, onProfileClick }: HeaderProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Clear all auth-related data
    tokenstore.clear();
    localStorage.clear();
    dispatch(clearDonorData());
    navigate('/login');
  };

  const handleDashboard = () => {
    navigate(`/${userType}`);
    handleMenuClose();
  };

  const handleNotifications = () => {
    navigate(`/${userType}/notifications`);
  };

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        bgcolor: '#dc2626',
        color: 'white',
        boxShadow: '0 2px 8px rgba(220, 38, 38, 0.2)',
        borderBottom: '3px solid #b91c1c'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: 3 }}>
        {/* Logo and Brand */}
        <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={handleDashboard}>
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
              BloodConnect {userType === 'donor' ? 'Donor' : 'Recipient'}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
              Blood Donation Management System
            </Typography>
          </Box>
        </Box>

        {/* User Info and Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>

          
          <IconButton onClick={handleNotifications} sx={{ color: 'white' }}>
            <Badge badgeContent={notificationCount} color="error">
              <Notifications />
            </Badge>
          </IconButton>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'white' }}>
                {currentUser.firstName || userType} {currentUser.lastName || ''}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                {userType === 'donor' ? 'Blood Donor' : 'Blood Recipient'}
              </Typography>
            </Box>
            
            <Avatar 
              sx={{ 
                bgcolor: 'white', 
                color: '#dc2626',
                width: 40, 
                height: 40,
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
              src={currentUser.profileImageUrl ? `http://localhost:5082${currentUser.profileImageUrl}` : ''}
              onClick={handleProfileMenuOpen}
            >
              {!currentUser.profileImageUrl && (currentUser.firstName || userType[0].toUpperCase())[0]}
            </Avatar>
          </Box>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={handleDashboard}>
              <Dashboard sx={{ mr: 1 }} /> Dashboard
            </MenuItem>
            <MenuItem onClick={() => { onProfileClick?.(); handleMenuClose(); }}>
              <Person sx={{ mr: 1 }} /> Profile
            </MenuItem>
            <MenuItem onClick={handleLogout} sx={{ color: '#d32f2f' }}>
              <Logout sx={{ mr: 1 }} /> Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}