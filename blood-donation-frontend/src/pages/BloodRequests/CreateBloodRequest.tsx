import { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, TextField, Button,
  FormControl, InputLabel, Select, MenuItem, Alert, Grid
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { bloodRequestAPI } from '../../api/bloodRequest.api';
import { notificationAPI } from '../../api/notification.api';
import { recipientAPI } from '../../api/recipient.api';
import { bloodBankAPI } from '../../api/bloodBank.api';
import type { BloodBank } from '../../types/BloodBank';
import '../../styles/common.css';

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
      // Profile loading failed - form will use empty values
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
      
      const requestData = {
        recipientId: currentUser.id,
        bloodGroupNeeded: formData.bloodGroupNeeded,
        quantity: formData.quantity,
        urgencyLevel: formData.urgencyLevel,
        hospitalName: formData.hospitalName,
        medicalReason: formData.medicalReason
      };

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
        // Notification creation failed - continue with success flow
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
    <Box className="page-container">
      <Typography variant="h5" gutterBottom className="page-title">
        Create Blood Request
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Card>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            <Box className="form-container">
              <Box className="form-grid">
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
                className="primary-button"
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