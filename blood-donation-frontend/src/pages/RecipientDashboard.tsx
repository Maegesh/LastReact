import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Container, Typography, Paper, Avatar, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, Button, TextField, FormControl, InputLabel,
  Select, MenuItem, Chip
} from '@mui/material';
import {
  Bloodtype, Add, Notifications, Person, Logout, TrendingUp, Edit, PhotoCamera
} from '@mui/icons-material';
import Loader from '../components/Loader';
import RecipientBloodRequestList from './BloodRequests/RecipientBloodRequestList';
import CreateBloodRequest from './BloodRequests/CreateBloodRequest';
import { bloodRequestAPI } from '../api/bloodRequest.api';
import { recipientAPI } from '../api/recipient.api';
import { tokenstore } from '../auth/tokenstore';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function RecipientDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalRequests: 0, pendingRequests: 0, completedRequests: 0 });
  const [profileDialog, setProfileDialog] = useState(false);
  const [recipientProfile, setRecipientProfile] = useState<any>(null);
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bloodGroupNeeded: '',
    medicalCondition: '',
    profileImageUrl: ''
  });

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = currentUser.id;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      if (userId) {
        try {
          // Fetch latest user data to get current profileImageUrl
          const token = tokenstore.get();
          if (token) {
            const userResponse = await fetch(`http://localhost:5082/api/User/${userId}`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (userResponse.ok) {
              const latestUser = await userResponse.json();
              localStorage.setItem('user', JSON.stringify(latestUser));
              console.log('Updated user data with latest profileImageUrl:', latestUser.profileImageUrl);
            }
          }
          
          const recipientRes = await recipientAPI.getByUserId(userId);
          const profile = recipientRes.data;
          
          const response = await bloodRequestAPI.getByRecipientId(profile.id);
          const requests = response.data || [];
          
          setStats({
            totalRequests: requests.length,
            pendingRequests: requests.filter((r: any) => r.status === 'Pending').length,
            completedRequests: requests.filter((r: any) => r.status === 'Fulfilled').length
          });
          
          setRecipientProfile(profile);
          
          // Get updated user data from localStorage
          const updatedUser = JSON.parse(localStorage.getItem('user') || '{}');
          setProfileForm({
            firstName: updatedUser.firstName || '',
            lastName: updatedUser.lastName || '',
            email: updatedUser.email || '',
            phone: updatedUser.phone || '',
            bloodGroupNeeded: profile.bloodGroupNeeded || '',
            medicalCondition: profile.medicalCondition || '',
            profileImageUrl: updatedUser.profileImageUrl ? `http://localhost:5082${updatedUser.profileImageUrl}` : ''
          });
        } catch (error) {
          console.error('Error loading recipient profile:', error);
          setStats({ totalRequests: 0, pendingRequests: 0, completedRequests: 0 });
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    tokenstore.clear();
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleProfileUpdate = async () => {
    try {
      if (recipientProfile) {
        // Update recipient profile data
        await recipientAPI.update(recipientProfile.id, {
          bloodGroupNeeded: profileForm.bloodGroupNeeded,
          medicalCondition: profileForm.medicalCondition
        });
        
        // Update user data (name, email, phone) - but NOT profileImageUrl here
        // ProfileImageUrl is updated separately via image upload endpoint
        const userUpdateData = {
          firstName: profileForm.firstName,
          lastName: profileForm.lastName,
          phone: profileForm.phone
          // Note: profileImageUrl is handled by the upload endpoint
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
          
          setProfileDialog(false);
          window.location.reload();
        } else {
          const errorText = await userResponse.text();
          console.error('Failed to update user profile:', userResponse.status, errorText);
          alert('Failed to update profile: ' + errorText);
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        setLoading(true);
        console.log('Converting file to byte array:', file.name);
        
        // Convert file to byte array
        const arrayBuffer = await file.arrayBuffer();
        const byteArray = Array.from(new Uint8Array(arrayBuffer));
        
        console.log('File converted to byte array, length:', byteArray.length);
        
        const uploadData = {
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
          imageBytes: byteArray
        };

        // Get token from tokenstore instead of localStorage
        const token = tokenstore.get();
        console.log('Token:', token ? 'Token found' : 'No token');
        console.log('User ID:', userId);

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

        console.log('Response status:', response.status);
        
        if (response.ok) {
          const updatedUser = await response.json();
          console.log('Upload successful:', updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
          
          // Update profile form with new image URL
          setProfileForm(prev => ({
            ...prev,
            profileImageUrl: updatedUser.profileImageUrl ? `http://localhost:5082${updatedUser.profileImageUrl}` : ''
          }));
          
          // Refresh the page to show the new image
          window.location.reload();
        } else {
          const errorText = await response.text();
          console.error('Upload failed:', response.status, errorText);
          alert('Upload failed: ' + errorText);
        }
      } catch (error: any) {
        console.error('Error uploading image:', error);
        alert('Error uploading image: ' + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

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
      bgcolor: '#f8fafc',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Header userType="recipient" notificationCount={0} onProfileClick={() => setProfileDialog(true)} />

      {/* Content Area */}
      <Container maxWidth={false} sx={{ flex: 1, py: 4, px: 3 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1e293b', mb: 1 }}>
            Welcome Back, {currentUser.firstName || 'Recipient'}!
          </Typography>
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
          <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #f1f5f9' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#3b82f6' }}>
                  {stats.totalRequests}
                </Typography>
                <Typography variant="h6" color="text.secondary">Total Requests</Typography>
              </Box>
              <Box sx={{ 
                width: 48, height: 48, borderRadius: 2, bgcolor: '#eff6ff',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Bloodtype sx={{ color: '#3b82f6', fontSize: 24 }} />
              </Box>
            </Box>
          </Paper>
          
          <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #f1f5f9' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#f59e0b' }}>
                  {stats.pendingRequests}
                </Typography>
                <Typography variant="h6" color="text.secondary">Pending</Typography>
              </Box>
              <Box sx={{ 
                width: 48, height: 48, borderRadius: 2, bgcolor: '#fffbeb',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <TrendingUp sx={{ color: '#f59e0b', fontSize: 24 }} />
              </Box>
            </Box>
          </Paper>
          
          <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #f1f5f9' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#10b981' }}>
                  {stats.completedRequests}
                </Typography>
                <Typography variant="h6" color="text.secondary">Fulfilled</Typography>
              </Box>
              <Box sx={{ 
                width: 48, height: 48, borderRadius: 2, bgcolor: '#f0fdf4',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Bloodtype sx={{ color: '#10b981', fontSize: 24 }} />
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Quick Actions Section */}
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1e293b', mb: 3 }}>
          Quick Actions
        </Typography>
        
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
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                border: '1px solid #f1f5f9',
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
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    bgcolor: card.bgColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Box sx={{ color: card.color }}>
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
          <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #f1f5f9' }}>
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
          <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #fef2f2', bgcolor: '#fef2f2' }}>
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
        <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #f1f5f9', mb: 4 }}>
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
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <FormControl fullWidth>
                  <InputLabel>Blood Group Needed</InputLabel>
                  <Select
                    value={profileForm.bloodGroupNeeded}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, bloodGroupNeeded: e.target.value }))}
                    label="Blood Group Needed"
                  >
                    {bloodGroups.map(group => (
                      <MenuItem key={group} value={group}>
                        <Chip label={group} sx={{ bgcolor: '#d32f2f', color: 'white' }} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <TextField
                  label="Medical Condition"
                  value={profileForm.medicalCondition}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, medicalCondition: e.target.value }))}
                  fullWidth
                  multiline
                  rows={2}
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