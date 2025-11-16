import { useState, useEffect } from 'react';
import { 
  Box, Typography, Card, Button, Chip, Dialog, DialogTitle, 
  DialogContent, DialogActions, TextField, Container, Paper, Avatar, IconButton
} from '@mui/material';
import { Edit, Person, ArrowBack, PhotoCamera } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { donorAPI } from '../../api/donor.api';
import type { DonorProfile as DonorProfileType, UpdateDonorProfile } from '../../types/DonorProfile';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';

const getBloodGroupColor = (bloodGroup: string) => {
  const colors: any = {
    'A+': '#f44336', 'A-': '#e91e63', 'B+': '#9c27b0', 'B-': '#673ab7',
    'AB+': '#3f51b5', 'AB-': '#2196f3', 'O+': '#009688', 'O-': '#4caf50'
  };
  return colors[bloodGroup] || '#757575';
};

export default function DonorProfile() {
  const navigate = useNavigate();
  const [donorProfile, setDonorProfile] = useState<DonorProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState<UpdateDonorProfile>({
    firstName: '',
    lastName: '',
    bloodGroup: '',
    age: 0,
    gender: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = currentUser.id;

  useEffect(() => {
    loadDonorProfile();
  }, []);

  const loadDonorProfile = async () => {
    try {
      setLoading(true);
      if (userId) {
        const response = await donorAPI.getByUserId(userId);
        const profile = response.data;
        setDonorProfile(profile);
        setEditForm({
          firstName: currentUser.firstName || '',
          lastName: currentUser.lastName || '',
          bloodGroup: profile.bloodGroup,
          age: profile.age,
          gender: profile.gender
        });
      }
    } catch (error) {
      console.error('Error loading donor profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      if (donorProfile) {
        await donorAPI.update(donorProfile.id, editForm);
        
        // Update localStorage user data if name fields were changed
        if (editForm.firstName || editForm.lastName) {
          const updatedUser = {
            ...currentUser,
            firstName: editForm.firstName || currentUser.firstName,
            lastName: editForm.lastName || currentUser.lastName
          };
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }
        
        setEditDialogOpen(false);
        loadDonorProfile();
        
        // Reload the page to update header
        window.location.reload();
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile: ' + error);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      handleImageUpload(file);
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true);
      console.log('Uploading file:', file.name);
      
      const formData = new FormData();
      formData.append('imageFile', file);

      const token = localStorage.getItem('token');
      console.log('Token:', token);
      console.log('User ID:', userId);

      const response = await fetch(`http://localhost:5000/api/User/${userId}/upload-image`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Response status:', response.status);
      
      if (response.ok) {
        const updatedUser = await response.json();
        console.log('Upload successful:', updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        window.location.reload();
      } else {
        const errorText = await response.text();
        console.error('Upload failed:', response.status, errorText);
        toast.error('Upload failed: ' + errorText);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error uploading image: ' + error);
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <Loader message="Loading profile..." />;

  if (!donorProfile) {
    return (
      <Card sx={{ mt: 2, p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          No donor profile found. Please contact administrator.
        </Typography>
      </Card>
    );
  }

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
              <IconButton onClick={() => navigate('/donor')} sx={{ mr: 2 }}>
                <ArrowBack />
              </IconButton>
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
                <Person sx={{ color: 'white', transform: 'rotate(45deg)', fontSize: 20 }} />
              </Box>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1e293b' }}>
                  My Profile
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage your donor information
                </Typography>
              </Box>
            </Box>
            <Box sx={{ position: 'relative' }}>
              <Avatar 
                sx={{ bgcolor: '#d32f2f', width: 40, height: 40 }}
                src={currentUser.profileImageUrl}
              >
                {(currentUser.firstName || 'D')[0]}
              </Avatar>
              <IconButton
                component="label"
                sx={{
                  position: 'absolute',
                  bottom: -5,
                  right: -5,
                  bgcolor: 'white',
                  width: 20,
                  height: 20,
                  '&:hover': { bgcolor: '#f5f5f5' }
                }}
              >
                <PhotoCamera sx={{ fontSize: 12 }} />
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFileSelect}
                />
              </IconButton>
            </Box>
          </Box>
        </Container>
      </Paper>

      {/* Content */}
      <Container maxWidth={false} sx={{ flex: 1, py: 3, px: 3 }}>

      <Card sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Profile Information</Typography>
          <Button
            startIcon={<Edit />}
            variant="outlined"
            onClick={() => setEditDialogOpen(true)}
          >
            Edit Profile
          </Button>
        </Box>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">Blood Group</Typography>
            <Chip 
              label={donorProfile.bloodGroup}
              sx={{ 
                bgcolor: getBloodGroupColor(donorProfile.bloodGroup),
                color: 'white',
                fontWeight: 'bold'
              }} 
            />
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">Age</Typography>
            <Typography variant="body1">{donorProfile.age} years</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">Gender</Typography>
            <Typography variant="body1">{donorProfile.gender}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">Last Donation</Typography>
            <Typography variant="body1">
              {donorProfile.lastDonationDate ? new Date(donorProfile.lastDonationDate).toLocaleDateString() : 'Never'}
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">Eligibility Status</Typography>
            <Chip 
              label={donorProfile.eligibilityStatus ? 'Eligible' : 'Not Eligible'}
              color={donorProfile.eligibilityStatus ? 'success' : 'error'}
            />
          </Box>
        </Box>
      </Card>

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="First Name"
              value={editForm.firstName}
              onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
              fullWidth
            />
            <TextField
              label="Last Name"
              value={editForm.lastName}
              onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
              fullWidth
            />
            <TextField
              label="Blood Group"
              value={editForm.bloodGroup}
              onChange={(e) => setEditForm({...editForm, bloodGroup: e.target.value})}
              fullWidth
            />
            <TextField
              label="Age"
              type="number"
              value={editForm.age}
              onChange={(e) => setEditForm({...editForm, age: parseInt(e.target.value)})}
              fullWidth
            />
            <TextField
              label="Gender"
              value={editForm.gender}
              onChange={(e) => setEditForm({...editForm, gender: e.target.value})}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleProfileUpdate} variant="contained">Update</Button>
        </DialogActions>
      </Dialog>
      </Container>
    </Box>
  );
}