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

interface HeaderProps {
  userType: 'donor' | 'recipient';
  notificationCount?: number;
  onProfileClick?: () => void;
}

export default function Header({ userType, notificationCount = 0, onProfileClick }: HeaderProps) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    tokenstore.clear();
    localStorage.removeItem('user');
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
        bgcolor: 'white',
        color: '#1e293b',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        borderBottom: '1px solid #e2e8f0'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: 3 }}>
        {/* Logo and Brand */}
        <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={handleDashboard}>
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
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#d32f2f' }}>
              BloodConnect
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {userType === 'donor' ? 'Donor Portal' : 'Recipient Portal'}
            </Typography>
          </Box>
        </Box>

        {/* User Info and Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip 
            label={userType === 'donor' ? 'Donor' : 'Recipient'}
            color="primary"
            size="small"
            sx={{ bgcolor: '#e3f2fd', color: '#1976d2' }}
          />
          
          <IconButton onClick={handleNotifications} sx={{ color: '#64748b' }}>
            <Badge badgeContent={notificationCount} color="error">
              <Notifications />
            </Badge>
          </IconButton>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                {currentUser.firstName || userType} {currentUser.lastName || ''}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {currentUser.email}
              </Typography>
            </Box>
            
            <Avatar 
              sx={{ 
                bgcolor: '#d32f2f', 
                width: 40, 
                height: 40,
                cursor: 'pointer'
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