import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import {
  Box, Container, Typography, Paper, Avatar, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, Button, TextField, FormControl, InputLabel,
  Select, MenuItem, Chip
} from '@mui/material';
import {
  Bloodtype, CalendarToday, History, Inventory, Business, Person, Notifications,
  Logout, TrendingUp, Edit, PhotoCamera
} from '@mui/icons-material';
import { donorAPI } from '../api/donor.api';
import { bloodRequestAPI } from '../api/bloodRequest.api';
import { appointmentAPI } from '../api/appointment.api';
import { donationAPI } from '../api/donation.api';
import { bloodBankAPI } from '../api/bloodBank.api';
import { tokenstore } from '../auth/tokenstore';
import Loader from "../components/Loader.tsx";
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function DonorDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({ pendingRequests: 0, appointments: 0, donations: 0, bloodBanks: 0 });
  const [profileDialog, setProfileDialog] = useState(false);
  const [donorProfile, setDonorProfile] = useState<any>(null);
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bloodGroup: '',
    age: 18,
    gender: '',
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
            }
          }
          
          const donorRes = await donorAPI.getByUserId(userId);
          const profile = donorRes.data;
          
          const [bloodRequestsRes, appointmentsRes, donationsRes, bloodBanksRes] = await Promise.all([
            bloodRequestAPI.getByBloodGroup(profile.bloodGroup).catch(() => ({ data: [] })),
            appointmentAPI.getByDonor(profile.id).catch(() => ({ data: [] })),
            donationAPI.getByDonor(profile.id).catch(() => ({ data: [] })),
            bloodBankAPI.getAll().catch(() => ({ data: [] }))
          ]);
          
          const pendingRequests = (bloodRequestsRes.data || []).filter((req: any) => req.status === 'Pending');
          
          setCounts({
            pendingRequests: pendingRequests.length,
            appointments: (appointmentsRes.data || []).length,
            donations: (donationsRes.data || []).length,
            bloodBanks: (bloodBanksRes.data || []).length
          });
          
          setDonorProfile(profile);
          
          // Get updated user data from localStorage
          const updatedUser = JSON.parse(localStorage.getItem('user') || '{}');
          setProfileForm({
            firstName: updatedUser.firstName || '',
            lastName: updatedUser.lastName || '',
            email: updatedUser.email || '',
            phone: updatedUser.phone || '',
            bloodGroup: profile.bloodGroup || '',
            age: profile.age || 18,
            gender: profile.gender || '',
            profileImageUrl: updatedUser.profileImageUrl ? `http://localhost:5082${updatedUser.profileImageUrl}` : ''
          });
        } catch (error) {
          console.error('Error loading donor profile:', error);
          setCounts({ pendingRequests: 0, appointments: 0, donations: 0, bloodBanks: 0 });
        }
      }
    } catch (error) {
      console.error("Error loading data:", error);
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
      if (donorProfile) {
        await donorAPI.update(donorProfile.id, {
          bloodGroup: profileForm.bloodGroup,
          age: profileForm.age,
          gender: profileForm.gender
        });
        
        const updatedUser = {
          ...currentUser,
          firstName: profileForm.firstName,
          lastName: profileForm.lastName,
          email: profileForm.email,
          phone: profileForm.phone,
          profileImageUrl: profileForm.profileImageUrl
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        setProfileDialog(false);
        window.location.reload();
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
          
          // Refresh the page to show the new image
          window.location.reload();
        } else {
          const errorText = await response.text();
          alert('Upload failed: ' + errorText);
        }
      } catch (error: any) {
        alert('Error uploading image: ' + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const genders = ['Male', 'Female', 'Other'];

  const navigationCards = [
    { 
      title: 'Blood Requests', 
      count: counts.pendingRequests, 
      icon: <Bloodtype />, 
      path: '/donor/requests',
      color: '#ef4444',
      bgColor: '#fef2f2',
      change: '+3 new'
    },
    { 
      title: 'My Appointments', 
      count: counts.appointments, 
      icon: <CalendarToday />, 
      path: '/donor/appointments',
      color: '#3b82f6',
      bgColor: '#eff6ff',
      change: '+1 upcoming'
    },
    { 
      title: 'Donation History', 
      count: counts.donations, 
      icon: <History />, 
      path: '/donor/donations',
      color: '#10b981',
      bgColor: '#f0fdf4',
      change: 'Lives saved'
    },
    { 
      title: 'Blood Banks', 
      count: counts.bloodBanks, 
      icon: <Business />, 
      path: '/donor/blood-banks',
      color: '#06b6d4',
      bgColor: '#ecfeff',
      change: 'Available'
    },
    { 
      title: 'Blood Stock', 
      icon: <Inventory />, 
      path: '/donor/blood-stock',
      color: '#84cc16',
      bgColor: '#f7fee7',
      change: 'Current'
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
      <Header userType="donor" notificationCount={0} onProfileClick={() => setProfileDialog(true)} />

      {/* Content Area */}
      <Container maxWidth={false} sx={{ flex: 1, py: 4, px: 3 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1e293b', mb: 1 }}>
            Welcome Back, {currentUser.firstName || 'Donor'}!
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Your donation dashboard - track your life-saving impact and help save lives
          </Typography>
          
          {/* Impact Banner */}
          <Paper sx={{ 
            p: 3, 
            borderRadius: 3, 
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            mb: 3
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  ❤️ Your Life-Saving Impact
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {counts.donations > 0 
                    ? `You've made ${counts.donations} donation${counts.donations > 1 ? 's' : ''} and potentially saved ${counts.donations * 3} lives!`
                    : 'Ready to start your life-saving journey? Check pending requests below.'
                  }
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                  {counts.donations * 3}
                </Typography>
                <Typography variant="caption">Lives Impacted</Typography>
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
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)'
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
                  Click to view details
                </Typography>
              </Box>
            </Paper>
          ))}
        </Box>

        {/* Donation Process & Health Tips */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, 
          gap: 3,
          mb: 4
        }}>
          {/* Donation Process */}
          <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #f1f5f9' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#1e293b' }}>
              🩸 Donation Process Guide
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ 
                  width: 32, height: 32, borderRadius: '50%', bgcolor: '#e3f2fd',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#1976d2', fontWeight: 'bold'
                }}>1</Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Health Screening</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Quick health check and eligibility verification
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
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Blood Collection</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Safe and sterile blood donation process (10-15 minutes)
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
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Recovery & Refreshments</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Rest, hydrate, and enjoy complimentary refreshments
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>

          {/* Health Tips */}
          <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #f0fdf4', bgcolor: '#f0fdf4' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#16a34a' }}>
              💪 Donor Health Tips
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#16a34a' }}>
                  Before Donation
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Eat iron-rich foods, stay hydrated, get good sleep
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#16a34a' }}>
                  After Donation
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Rest for 15 minutes, avoid heavy lifting for 24 hours
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#16a34a' }}>
                  Donation Frequency
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Wait 56 days between whole blood donations
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Impact Statistics & Recognition */}
        <Paper sx={{ p: 3, borderRadius: 3, border: '1px solid #f1f5f9', mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: '#1e293b' }}>
            🏆 Your Donation Impact & Recognition
          </Typography>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' }, 
            gap: 3 
          }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#d32f2f' }}>
                {counts.donations}
              </Typography>
              <Typography variant="body2" color="text.secondary">Total Donations</Typography>
              <Chip 
                label={counts.donations >= 10 ? 'Hero Donor' : counts.donations >= 5 ? 'Regular Donor' : 'New Donor'}
                color={counts.donations >= 10 ? 'error' : counts.donations >= 5 ? 'warning' : 'primary'}
                size="small"
                sx={{ mt: 1 }}
              />
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#10b981' }}>
                {counts.donations * 3}
              </Typography>
              <Typography variant="body2" color="text.secondary">Lives Potentially Saved</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                Each donation can save up to 3 lives
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#3b82f6' }}>
                {counts.appointments}
              </Typography>
              <Typography variant="body2" color="text.secondary">Scheduled Appointments</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                Upcoming donation sessions
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#f59e0b' }}>
                {counts.pendingRequests}
              </Typography>
              <Typography variant="body2" color="text.secondary">Pending Requests</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                People need your help
              </Typography>
            </Box>
          </Box>
        </Paper>
        
        {/* Profile Dialog */}
        <Dialog open={profileDialog} onClose={() => setProfileDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar 
              sx={{ width: 60, height: 60 }}
              src={profileForm.profileImageUrl}
            >
              {!profileForm.profileImageUrl && (profileForm.firstName || 'D')[0]}
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
                  {!profileForm.profileImageUrl && (profileForm.firstName || 'D')[0]}
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
                  <InputLabel>Blood Group</InputLabel>
                  <Select
                    value={profileForm.bloodGroup}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, bloodGroup: e.target.value }))}
                    label="Blood Group"
                  >
                    {bloodGroups.map(group => (
                      <MenuItem key={group} value={group}>
                        <Chip label={group} sx={{ bgcolor: '#d32f2f', color: 'white' }} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <TextField
                  label="Age"
                  type="number"
                  value={profileForm.age}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, age: parseInt(e.target.value) }))}
                  inputProps={{ min: 18, max: 65 }}
                  fullWidth
                />
              </Box>
              
              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <Select
                  value={profileForm.gender}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, gender: e.target.value }))}
                  label="Gender"
                >
                  {genders.map(gender => (
                    <MenuItem key={gender} value={gender}>{gender}</MenuItem>
                  ))}
                </Select>
              </FormControl>
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