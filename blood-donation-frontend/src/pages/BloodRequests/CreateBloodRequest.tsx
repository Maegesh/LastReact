import { useState } from 'react';
import {
  Box, Typography, Card, CardContent, TextField, Button,
  FormControl, InputLabel, Select, MenuItem, Alert, Grid
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { bloodRequestAPI } from '../../api/bloodRequest.api';

interface CreateBloodRequestProps {
  onRequestCreated?: () => void;
}

interface BloodRequestData {
  bloodGroupNeeded: string;
  quantity: number;
  urgencyLevel: string;
  hospitalName: string;
  contactNumber: string;
  medicalReason: string;
}

export default function CreateBloodRequest({ onRequestCreated }: CreateBloodRequestProps = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState<BloodRequestData>({
    bloodGroupNeeded: '',
    quantity: 1,
    urgencyLevel: 'Medium',
    hospitalName: '',
    contactNumber: '',
    medicalReason: ''
  });

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
        contactNumber: formData.contactNumber,
        medicalReason: formData.medicalReason
      };
      console.log('Request data:', requestData);

      await bloodRequestAPI.create(requestData);
      setSuccess('Blood request created successfully! Donors will be notified.');
      
      // Reset form
      setFormData({
        bloodGroupNeeded: '',
        quantity: 1,
        urgencyLevel: 'Medium',
        hospitalName: '',
        contactNumber: '',
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
              />

              <TextField
                label="Contact Number"
                value={formData.contactNumber}
                onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                required
                fullWidth
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