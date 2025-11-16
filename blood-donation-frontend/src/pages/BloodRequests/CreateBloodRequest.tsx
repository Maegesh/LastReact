import { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, TextField, Button,
  FormControl, InputLabel, Select, MenuItem, Alert, Grid
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { bloodRequestAPI } from '../../api/bloodRequest.api';
import { bloodBankAPI } from '../../api/bloodBank.api';
import { notificationAPI } from '../../api/notification.api';
import { recipientAPI } from '../../api/recipient.api';
import type { BloodBank } from '../../types/BloodBank';

interface CreateBloodRequestProps {
  onRequestCreated?: () => void;
}

interface BloodRequestData {
  bloodGroupNeeded: string;
  quantity: number;
  urgencyLevel: string;
  hospitalName: string;
  medicalReason: string;
}

export default function CreateBloodRequest({ onRequestCreated }: CreateBloodRequestProps = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [bloodBanks, setBloodBanks] = useState<BloodBank[]>([]);
  const [formData, setFormData] = useState<BloodRequestData>({
    bloodGroupNeeded: '',
    quantity: 1,
    urgencyLevel: 'Medium',
    hospitalName: '',
    medicalReason: ''
  });

  useEffect(() => {
    loadBloodBanks();
    loadRecipientProfile();
  }, []);

  const loadRecipientProfile = async () => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const response = await recipientAPI.getByUserId(currentUser.id);
      const profile = response.data || response;
      
      if (profile) {
        setFormData(prev => ({ 
          ...prev, 
          hospitalName: profile.hospitalName || ''
        }));
      }
    } catch (error) {
      console.error('Error loading recipient profile:', error);
    }
  };

  const loadBloodBanks = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        console.log('No auth token found, using fallback blood banks');
        setBloodBanks([
          { id: 1, name: 'City General Hospital Blood Bank', location: 'Downtown', contactNumber: '123-456-7890', email: 'blood@citygeneral.com', capacity: 500 },
          { id: 2, name: 'Regional Medical Center', location: 'Uptown', contactNumber: '098-765-4321', email: 'blood@regional.com', capacity: 300 },
          { id: 3, name: 'Community Health Blood Bank', location: 'Suburbs', contactNumber: '555-123-4567', email: 'blood@community.com', capacity: 200 }
        ]);
        return;
      }
      
      const response = await bloodBankAPI.getAll();
      const banks = response.data || response || [];
      setBloodBanks(Array.isArray(banks) ? banks : []);
    } catch (error: any) {
      console.error('Error loading blood banks:', error);
      if (error.response?.status === 403) {
        // Use fallback data when authorization fails
        setBloodBanks([
          { id: 1, name: 'City General Hospital Blood Bank', location: 'Downtown', contactNumber: '123-456-7890', email: 'blood@citygeneral.com', capacity: 500 },
          { id: 2, name: 'Regional Medical Center', location: 'Uptown', contactNumber: '098-765-4321', email: 'blood@regional.com', capacity: 300 },
          { id: 3, name: 'Community Health Blood Bank', location: 'Suburbs', contactNumber: '555-123-4567', email: 'blood@community.com', capacity: 200 }
        ]);
      } else {
        setError('Failed to load blood banks. Using default options.');
      }
    }
  };

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const urgencyLevels = ['Low', 'Medium', 'High', 'Critical'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      console.log('Current user:', currentUser);
      
      const requestData = {
        recipientId: currentUser.id,
        bloodGroupNeeded: formData.bloodGroupNeeded,
        quantity: formData.quantity,
        urgencyLevel: formData.urgencyLevel,
        hospitalName: formData.hospitalName,
        medicalReason: formData.medicalReason
      };
      console.log('Request data:', requestData);

      await bloodRequestAPI.create(requestData);
      
      // Create notification for recipient
      try {
        await notificationAPI.create({
          userId: currentUser.id,
          message: `Your blood request for ${formData.bloodGroupNeeded} (${formData.quantity} units) is under progress. Donors are being notified.`,
          type: 'BloodRequest',
          isRead: false
        });
      } catch (notificationError) {
        console.error('Error creating notification:', notificationError);
      }
      
      setSuccess('Blood request created successfully! Your blood is under progress. Donors will be notified and you will receive updates.');
      
      // Reset form
      setFormData({
        bloodGroupNeeded: '',
        quantity: 1,
        urgencyLevel: 'Medium',
        hospitalName: '',
        medicalReason: ''
      });
      
      onRequestCreated?.();
    } catch (error: any) {
      console.error('Blood request creation error:', error);
      console.error('Error response:', error.response);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create blood request';
      
      if (errorMessage.includes('profile not found')) {
        setError('Please create your recipient profile first before making blood requests.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof BloodRequestData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', width: '100vw', p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ color: '#d32f2f', fontWeight: 'bold' }}>
        Create Blood Request
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Card>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                <FormControl fullWidth required>
                  <InputLabel>Blood Group Needed</InputLabel>
                  <Select
                    value={formData.bloodGroupNeeded}
                    onChange={(e) => handleInputChange('bloodGroupNeeded', e.target.value)}
                    label="Blood Group Needed"
                  >
                    {bloodGroups.map(group => (
                      <MenuItem key={group} value={group}>{group}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  label="Quantity (Units)"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange('quantity', parseInt(e.target.value))}
                  required
                  fullWidth
                  inputProps={{ min: 1, max: 10 }}
                  helperText="Each unit = 450ml of blood. Most patients need 1-3 units."
                />
              </Box>

              <FormControl fullWidth required>
                <InputLabel>Urgency Level</InputLabel>
                <Select
                  value={formData.urgencyLevel}
                  onChange={(e) => handleInputChange('urgencyLevel', e.target.value)}
                  label="Urgency Level"
                >
                  {urgencyLevels.map(level => (
                    <MenuItem key={level} value={level}>{level}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Hospital Name"
                value={formData.hospitalName}
                onChange={(e) => handleInputChange('hospitalName', e.target.value)}
                required
                fullWidth
                placeholder="Enter hospital name"
              />

              <TextField
                label="Medical Reason"
                value={formData.medicalReason}
                onChange={(e) => handleInputChange('medicalReason', e.target.value)}
                required
                fullWidth
                multiline
                rows={3}
                placeholder="Please describe the medical condition requiring blood transfusion"
              />

              <Button
                type="submit"
                variant="contained"
                startIcon={<Add />}
                disabled={loading}
                sx={{ bgcolor: '#d32f2f', py: 1.5, mt: 2 }}
              >
                {loading ? 'Creating Request...' : 'Create Blood Request'}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}