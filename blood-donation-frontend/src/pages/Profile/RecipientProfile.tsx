import { useState, useEffect } from 'react';
import {
  Box, Typography, Card, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Grid, Alert
} from '@mui/material';
import { Edit } from '@mui/icons-material';
import { recipientAPI } from '../../api/recipient.api';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchRecipientOverview } from '../../store/recipientSlice';
import type { RecipientProfile as RecipientProfileType } from '../../types/RecipientProfile';
import Loader from '../../components/Loader';

export default function RecipientProfile() {
  const dispatch = useAppDispatch();
  const { overview, loading } = useAppSelector(state => state.recipients);
  const [editDialog, setEditDialog] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editForm, setEditForm] = useState({
    hospitalName: '',
    patientName: '',
    requiredBloodGroup: '',
    contactNumber: '',
    emergencyContact: '',
    medicalHistory: ''
  });

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const profile = overview?.profile;

  useEffect(() => {
    if (!overview && currentUser.id) {
      dispatch(fetchRecipientOverview(currentUser.id));
    }
  }, [dispatch, overview, currentUser.id]);

  useEffect(() => {
    if (profile) {
      setEditForm({
        hospitalName: profile.hospitalName || '',
        patientName: profile.patientName || '',
        requiredBloodGroup: profile.requiredBloodGroup || '',
        contactNumber: profile.contactNumber || '',
        emergencyContact: profile.emergencyContact || '',
        medicalHistory: profile.medicalHistory || ''
      });
    }
  }, [profile]);

  const loadProfile = async () => {
    if (currentUser.id) {
      dispatch(fetchRecipientOverview(currentUser.id));
    }
  };

  const handleUpdate = async () => {
    try {
      setError('');
      setSuccess('');
      
      if (profile) {
        await recipientAPI.update(profile.id, editForm);
        setSuccess('Profile updated successfully!');
        setEditDialog(false);
        loadProfile();
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleCreate = async () => {
    try {
      setError('');
      setSuccess('');
      
      const createData = {
        userId: currentUser.id,
        hospitalName: editForm.hospitalName,
        patientName: editForm.patientName,
        requiredBloodGroup: editForm.requiredBloodGroup,
        contactNumber: editForm.contactNumber
      };
      
      await recipientAPI.create(createData);
      setSuccess('Profile created successfully!');
      setEditDialog(false);
      loadProfile();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to create profile');
    }
  };

  if (loading) return <Loader message="Loading profile..." />;

  if (!profile) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', width: '100vw', p: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ color: '#d32f2f', fontWeight: 'bold' }}>
          My Profile
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
        
        <Card sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No recipient profile found.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            You need to create your profile before making blood requests.
          </Typography>
          <Button
            variant="contained"
            onClick={() => setEditDialog(true)}
            sx={{ bgcolor: '#d32f2f' }}
          >
            Create Profile
          </Button>
        </Card>
        
        {/* Create Profile Dialog */}
        <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>Create Your Profile</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                <TextField
                  label="Patient Name"
                  value={editForm.patientName}
                  onChange={(e) => setEditForm({...editForm, patientName: e.target.value})}
                  fullWidth
                  required
                />
                <TextField
                  label="Required Blood Group"
                  select
                  value={editForm.requiredBloodGroup}
                  onChange={(e) => setEditForm({...editForm, requiredBloodGroup: e.target.value})}
                  fullWidth
                  required
                  SelectProps={{ native: true }}
                >
                  <option value="">Select Blood Group</option>
                  {bloodGroups.map(group => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </TextField>
              </Box>
              <TextField
                label="Hospital Name"
                value={editForm.hospitalName}
                onChange={(e) => setEditForm({...editForm, hospitalName: e.target.value})}
                fullWidth
                required
              />
              <TextField
                label="Contact Number"
                value={editForm.contactNumber}
                onChange={(e) => setEditForm({...editForm, contactNumber: e.target.value})}
                fullWidth
                required
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialog(false)}>Cancel</Button>
            <Button onClick={handleCreate} variant="contained">Create Profile</Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', width: '100vw', p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ color: '#d32f2f', fontWeight: 'bold' }}>
        My Profile
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Card sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">Profile Information</Typography>
          <Button
            startIcon={<Edit />}
            variant="outlined"
            onClick={() => setEditDialog(true)}
          >
            Edit Profile
          </Button>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">Patient Name</Typography>
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
              {profile.patientName || 'Not specified'}
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">Required Blood Group</Typography>
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
              {profile.requiredBloodGroup || 'Not specified'}
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">Hospital Name</Typography>
            <Typography variant="body1">
              {profile.hospitalName || 'Not specified'}
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">Contact Number</Typography>
            <Typography variant="body1">
              {profile.contactNumber || 'Not specified'}
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">Emergency Contact</Typography>
            <Typography variant="body1">
              {profile.emergencyContact || 'Not specified'}
            </Typography>
          </Box>

          <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
            <Typography variant="subtitle2" color="text.secondary">Medical History</Typography>
            <Typography variant="body1">
              {profile.medicalHistory || 'No medical history provided'}
            </Typography>
          </Box>
        </Box>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
              <TextField
                label="Patient Name"
                value={editForm.patientName}
                onChange={(e) => setEditForm({...editForm, patientName: e.target.value})}
                fullWidth
              />

              <TextField
                label="Required Blood Group"
                select
                value={editForm.requiredBloodGroup}
                onChange={(e) => setEditForm({...editForm, requiredBloodGroup: e.target.value})}
                fullWidth
                SelectProps={{ native: true }}
              >
                <option value="">Select Blood Group</option>
                {bloodGroups.map(group => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </TextField>
            </Box>

            <TextField
              label="Hospital Name"
              value={editForm.hospitalName}
              onChange={(e) => setEditForm({...editForm, hospitalName: e.target.value})}
              fullWidth
            />

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
              <TextField
                label="Contact Number"
                value={editForm.contactNumber}
                onChange={(e) => setEditForm({...editForm, contactNumber: e.target.value})}
                fullWidth
              />

              <TextField
                label="Emergency Contact"
                value={editForm.emergencyContact}
                onChange={(e) => setEditForm({...editForm, emergencyContact: e.target.value})}
                fullWidth
              />
            </Box>

            <TextField
              label="Medical History"
              value={editForm.medicalHistory}
              onChange={(e) => setEditForm({...editForm, medicalHistory: e.target.value})}
              fullWidth
              multiline
              rows={4}
              placeholder="Please provide relevant medical history..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdate} variant="contained">Update Profile</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}