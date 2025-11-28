import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Container, Typography, Paper, Avatar, Dialog, DialogTitle,
  DialogContent, DialogActions, Button, TextField, FormControl, InputLabel,
  Select, MenuItem, Chip, IconButton
} from '@mui/material';
import {
  Bloodtype, Add, Notifications, TrendingUp, PhotoCamera, Logout
} from '@mui/icons-material';
import Loader from '../../components/Loader';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchRecipientOverview } from '../../store/recipientSlice';
import { tokenstore } from '../../auth/tokenstore';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { toast } from 'react-toastify';

export default function RecipientDashboard() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { overview, loading } = useAppSelector(state => state.recipients);
  const [profileDialog, setProfileDialog] = useState(false);
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    profileImageUrl: ''
  });

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = currentUser.id;
  const stats = overview?.stats || { totalRequests: 0, pendingRequests: 0, completedRequests: 0 };
  const recipientProfile = overview?.profile;

  useEffect(() => {
    if (userId) {
      dispatch(fetchRecipientOverview(userId));
    }
  }, [userId]);

  useEffect(() => {
    if (overview?.user) {
      localStorage.setItem('user', JSON.stringify(overview.user));
      setProfileForm({
        firstName: overview.user.firstName || '',
        lastName: overview.user.lastName || '',
        email: overview.user.email || '',
        phone: overview.user.phone || '',
        profileImageUrl: overview.user.profileImageUrl ? `http://localhost:5082${overview.user.profileImageUrl}` : ''
      });
    }
  }, [overview]);

  const handleProfileUpdate = async () => {
    try {
      if (recipientProfile) {
        const userUpdateData = {
          firstName: profileForm.firstName,
          lastName: profileForm.lastName,
          phone: profileForm.phone
        };
        
        const token = tokenstore.get();
        if (!token) {
          alert('Please login again');
          navigate('/login');
          return;
        }
        
        const userResponse = await fetch(`http://localhost:5082/api/User/${userId}`, {
          method: 'PUT',
          body: JSON.stringify(userUpdateData),
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (userResponse.ok) {
          const updatedUser = await userResponse.json();
          localStorage.setItem('user', JSON.stringify(updatedUser));
          
          toast.success('Profile updated successfully');
          setProfileDialog(false);
          window.location.reload();
        } else {
          const errorText = await userResponse.text();
          toast.error('Failed to update profile: ' + errorText);
        }
      }
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        // Convert file to byte array
        const arrayBuffer = await file.arrayBuffer();
        const byteArray = Array.from(new Uint8Array(arrayBuffer));
        
        const uploadData = {
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          imageBytes: byteArray
        };

        const token = tokenstore.get();

        if (!token) {
          alert('Please login again');
          navigate('/login');
          return;
        }

        const response = await fetch(`http://localhost:5082/api/User/${userId}/upload-image-bytes`, {
          method: 'POST',
          body: JSON.stringify(uploadData),
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const updatedUser = await response.json();
          localStorage.setItem('user', JSON.stringify(updatedUser));
          
          // Update profile form with new image URL
          setProfileForm(prev => ({
            ...prev,
            profileImageUrl: updatedUser.profileImageUrl ? `http://localhost:5082${updatedUser.profileImageUrl}` : ''
          }));
          
          toast.success('Profile image updated successfully');
          window.location.reload();
        } else {
          const errorText = await response.text();
          toast.error('Upload failed: ' + errorText);
        }
      } catch (error: any) {
        toast.error('Error uploading image: ' + error.message);
      } finally {
      }
    }
  };

  const navigationCards = [
    { 
      title: 'Create Request', 
      icon: <Add />, 
      path: '/recipient/create',
      color: '#ef4444',
      bgColor: '#fef2f2',
      change: 'New request'
    },
    { 
      title: 'My Requests', 
      count: stats.totalRequests, 
      icon: <Bloodtype />, 
      path: '/recipient/requests',
      color: '#3b82f6',
      bgColor: '#eff6ff',
      change: `${stats.pendingRequests} pending`
    },
    { 
      title: 'Blood Banks', 
      icon: <Notifications />, 
      path: '/recipient/blood-banks',
      color: '#10b981',
      bgColor: '#f0fdf4',
      change: 'View all'
    },
    { 
      title: 'Notifications', 
      icon: <Notifications />, 
      path: '/recipient/notifications',
      color: '#f59e0b',
      bgColor: '#fffbeb',
      change: 'Updates'
    }
  ];

  if (loading) return <Loader message="Loading dashboard..." />;

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      width: '100vw', 
      background: 'linear-gradient(135deg, #fcf8f8ff 0%, #e2e8f0 100%)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative'
    }}>
      {/* Background Decorative Elements */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(211, 47, 47, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.05) 0%, transparent 50%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />
      <Header userType="recipient" notificationCount={0} onProfileClick={() => setProfileDialog(true)} />

      {/* Content Area */}
      <Container maxWidth={false} sx={{ flex: 1, py: 4, px: 3, position: 'relative', zIndex: 1 }}>
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Box sx={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #d32f2f 0%, #f44336 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(211, 47, 47, 0.3)'
            }}>
              <Bloodtype sx={{ fontSize: 30, color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1e293b', mb: 0.5 }}>
                Recipient Dashboard
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 'normal', color: '#64748b' }}>
                Welcome Back, {currentUser.firstName || 'Recipient'}! 👋
              </Typography>
            </Box>
          </Box>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Your blood request dashboard - manage your medical needs with confidence
          </Typography>
          
          {/* Quick Status Banner */}
          <Paper sx={{ 
            p: 3, 
            borderRadius: 3, 
            background: 'linear-gradient(135deg, #d32f2f 0%, #f44336 100%)',
            color: 'white',
            mb: 3
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  🩸 Blood Request Status
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {stats.pendingRequests > 0 
                    ? `You have ${stats.pendingRequests} pending request${stats.pendingRequests > 1 ? 's' : ''} being processed`
                    : 'No pending requests - Create a new request if needed'
                  }
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                  {stats.totalRequests}
                </Typography>
                <Typography variant="caption">Total Requests</Typography>
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Stats Cards */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, 
          gap: 3,
          mb: 4
        }}>
          <Paper sx={{ 
            p: 3, 
            borderRadius: 3, 
            bgcolor: '#dbeafe',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.1)',
            border: '2px solid #93c5fd'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#3b82f6' }}>
                  {stats.totalRequests}
                </Typography>
                <Typography variant="h6" color="text.secondary">Total Requests</Typography>
              </Box>
              <Box sx={{ 
                width: 56, height: 56, borderRadius: 3, bgcolor: '#3b82f6',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)'
              }}>
                <Bloodtype sx={{ color: 'white', fontSize: 28 }} />
              </Box>
            </Box>
          </Paper>
          
          <Paper sx={{ 
            p: 3, 
            borderRadius: 3, 
            bgcolor: '#fef3c7',
            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.1)',
            border: '2px solid #fde68a'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#f59e0b' }}>
                  {stats.pendingRequests}
                </Typography>
                <Typography variant="h6" color="text.secondary">Pending</Typography>
              </Box>
              <Box sx={{ 
                width: 56, height: 56, borderRadius: 3, bgcolor: '#f59e0b',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)'
              }}>
                <TrendingUp sx={{ color: 'white', fontSize: 28 }} />
              </Box>
            </Box>
          </Paper>
          
          <Paper sx={{ 
            p: 3, 
            borderRadius: 3, 
            bgcolor: '#d1fae5',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.1)',
            border: '2px solid #a7f3d0'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#10b981' }}>
                  {stats.completedRequests}
                </Typography>
                <Typography variant="h6" color="text.secondary">Fulfilled</Typography>
              </Box>
              <Box sx={{ 
                width: 56, height: 56, borderRadius: 3, bgcolor: '#10b981',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)'
              }}>
                <Bloodtype sx={{ color: 'white', fontSize: 28 }} />
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Quick Actions Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Box sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <TrendingUp sx={{ fontSize: 20, color: 'white' }} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1e293b' }}>
            Quick Actions ⚡
          </Typography>
        </Box>
        
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: '1fr', 
            sm: 'repeat(2, 1fr)', 
            md: 'repeat(3, 1fr)'
          }, 
          gap: 3,
          mb: 5
        }}>
          {navigationCards.map((card, index) => (
            <Paper 
              key={index}
              sx={{ 
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                borderRadius: 3,
                bgcolor: card.bgColor,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                border: `2px solid ${card.color}20`,
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                }
              }}
              onClick={() => navigate(card.path)}
            >
              <Box sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 3,
                    bgcolor: card.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 4px 12px ${card.color}40`
                  }}>
                    <Box sx={{ color: 'white' }}>
                      {React.cloneElement(card.icon, { sx: { fontSize: 24 } })}
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <TrendingUp sx={{ fontSize: 16, color: '#10b981' }} />
                    <Typography variant="body2" sx={{ 
                      color: '#10b981',
                      fontWeight: 'bold',
                      fontSize: '0.75rem'
                    }}>
                      {card.change}
                    </Typography>
                  </Box>
                </Box>
                
                {card.count !== undefined && (
                  <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#1e293b', mb: 1 }}>
                    {card.count}
                  </Typography>
                )}
                
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {card.title}
                </Typography>
                
                <Typography variant="body2" color="text.secondary">
                  Click to access
                </Typography>
              </Box>
            </Paper>
          ))}
        </Box>

        {/* Educational Content & Tips */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, 
          gap: 3,
          mb: 4
        }}>
          {/* Blood Request Process */}
          <Paper sx={{ 
            p: 3, 
            borderRadius: 3, 
            bgcolor: '#f8fafc',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            border: '2px solid #e2e8f0'
          }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#1e293b' }}>
              📋 How Blood Requests Work
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ 
                  width: 32, height: 32, borderRadius: '50%', bgcolor: '#e3f2fd',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#1976d2', fontWeight: 'bold'
                }}>1</Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Submit Request</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Specify blood type, quantity (1-10 units), urgency, and medical details
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ 
                  width: 32, height: 32, borderRadius: '50%', bgcolor: '#fff3e0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#f57c00', fontWeight: 'bold'
                }}>2</Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Automatic Donor Matching</Typography>
                  <Typography variant="body2" color="text.secondary">
                    System finds and notifies all compatible donors with your blood type
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ 
                  width: 32, height: 32, borderRadius: '50%', bgcolor: '#f0fdf4',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#16a34a', fontWeight: 'bold'
                }}>3</Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Donor Response & Scheduling</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Donors accept/decline → Admin schedules appointments → Blood collected
                  </Typography>
                </Box>
              </Box>
            </Box>
            
            {/* Quantity Information */}
            <Box sx={{ mt: 3, p: 2, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #e2e8f0' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#1e293b', mb: 1 }}>
                💡 Understanding Blood Units
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  • <strong>1 unit</strong> = 450ml of blood (typical single donation)
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • <strong>Most patients</strong> need 1-3 units for treatment
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • <strong>Multiple donors</strong> may be needed for larger quantities
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • <strong>System notifies</strong> all compatible donors to ensure availability
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Emergency Tips */}
          <Paper sx={{ 
            p: 3, 
            borderRadius: 3, 
            bgcolor: '#fef2f2',
            boxShadow: '0 4px 12px rgba(220, 38, 38, 0.1)',
            border: '2px solid #fecaca'
          }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#dc2626' }}>
              🚨 Emergency Guidelines
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#dc2626' }}>
                  Critical Situations
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  For life-threatening emergencies, call 911 immediately
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#dc2626' }}>
                  Hospital Coordination
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ensure your hospital is aware of your blood request
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#dc2626' }}>
                  24/7 Support
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Contact our emergency hotline: +1 (555) 123-4567
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Blood Type Compatibility Chart */}
        <Paper sx={{ 
          p: 3, 
          borderRadius: 3, 
          bgcolor: '#f0f9ff',
          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.1)',
          border: '2px solid #bfdbfe',
          mb: 4
        }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: '#1e293b' }}>
            🩸 Blood Type Compatibility Reference
          </Typography>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)', md: 'repeat(8, 1fr)' }, 
            gap: 2 
          }}>
            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bloodType) => (
              <Box key={bloodType} sx={{ textAlign: 'center' }}>
                <Chip 
                  label={bloodType}
                  sx={{ 
                    bgcolor: '#d32f2f', 
                    color: 'white', 
                    fontWeight: 'bold',
                    width: '100%',
                    mb: 1
                  }} 
                />
                <Typography variant="caption" color="text.secondary">
                  {bloodType === 'AB+' ? 'Universal Recipient' : 
                   bloodType === 'O-' ? 'Universal Donor' : 
                   bloodType.includes('+') ? 'Rh Positive' : 'Rh Negative'}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>
        
        {/* Profile Dialog */}
        <Dialog open={profileDialog} onClose={() => setProfileDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar 
              sx={{ width: 60, height: 60 }}
              src={profileForm.profileImageUrl}
            >
              {!profileForm.profileImageUrl && (profileForm.firstName || 'R')[0]}
            </Avatar>
            <Box>
              <Typography variant="h6">Edit Profile</Typography>
              <Typography variant="body2" color="text.secondary">
                Update your personal information
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar 
                  sx={{ width: 80, height: 80 }}
                  src={profileForm.profileImageUrl}
                >
                  {!profileForm.profileImageUrl && (profileForm.firstName || 'R')[0]}
                </Avatar>
                <Box>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="photo-upload"
                    type="file"
                    onChange={handleImageUpload}
                  />
                  <label htmlFor="photo-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<PhotoCamera />}
                      sx={{ mr: 1 }}
                    >
                      Upload Photo
                    </Button>
                  </label>
                  {profileForm.profileImageUrl && (
                    <Button
                      variant="text"
                      color="error"
                      onClick={() => setProfileForm(prev => ({ ...prev, profileImageUrl: '' }))}
                    >
                      Remove
                    </Button>
                  )}
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="First Name"
                  value={profileForm.firstName}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, firstName: e.target.value }))}
                  fullWidth
                />
                <TextField
                  label="Last Name"
                  value={profileForm.lastName}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, lastName: e.target.value }))}
                  fullWidth
                />
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Email"
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                  fullWidth
                />
                <TextField
                  label="Phone"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                  fullWidth
                />
              </Box>
              

            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setProfileDialog(false)}>Cancel</Button>
            <Button onClick={handleProfileUpdate} variant="contained" sx={{ bgcolor: '#d32f2f' }}>
              Update Profile
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
      
      <Footer />
    </Box>
  );
}