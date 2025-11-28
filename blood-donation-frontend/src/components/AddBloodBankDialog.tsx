import { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Box, Stack
} from '@mui/material';
import { bloodBankAPI } from '../api/bloodBank.api';
import type { CreateBloodBank } from '../types/BloodBank';
import { toast } from 'react-toastify';

interface AddBloodBankDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddBloodBankDialog({ open, onClose, onSuccess }: AddBloodBankDialogProps) {
  const [formData, setFormData] = useState<CreateBloodBank>({
    name: '',
    location: '',
    contactNumber: '',
    email: '',
    capacity: 0
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof CreateBloodBank) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = field === 'capacity' ? parseInt(event.target.value) || 0 : event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await bloodBankAPI.create(formData);
      onSuccess();
      handleClose();
    } catch (error) {
      console.error('Error creating blood bank:', error);
      toast.error('Failed to create blood bank');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      location: '',
      contactNumber: '',
      email: '',
      capacity: 0
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ bgcolor: '#d32f2f', color: 'white' }}>
        Add New Blood Bank
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ pt: 3 }}>
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="Blood Bank Name"
              value={formData.name}
              onChange={handleChange('name')}
              required
            />
            
            <TextField
              fullWidth
              label="Location"
              value={formData.location}
              onChange={handleChange('location')}
              required
            />
            
            <TextField
              fullWidth
              label="Contact Number"
              value={formData.contactNumber}
              onChange={handleChange('contactNumber')}
              required
            />
            
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              required
            />
            
            <TextField
              fullWidth
              label="Capacity (units)"
              type="number"
              value={formData.capacity}
              onChange={handleChange('capacity')}
              required
              inputProps={{ min: 1 }}
            />
          </Stack>
        </DialogContent>
        
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading}
            sx={{ bgcolor: '#d32f2f' }}
          >
            {loading ? 'Creating...' : 'Create Blood Bank'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}