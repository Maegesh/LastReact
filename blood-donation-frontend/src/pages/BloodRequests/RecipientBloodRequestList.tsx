import { useState, useEffect } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Chip, IconButton, Button, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, Grid,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import { bloodRequestAPI } from '../../api/bloodRequest.api';
import { recipientAPI } from '../../api/recipient.api';
import type { BloodRequest } from '../../types/BloodRequest';
import Loader from '../../components/Loader';

export default function RecipientBloodRequestList() {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [editDialog, setEditDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<BloodRequest | null>(null);
  const [editForm, setEditForm] = useState({
    bloodGroupNeeded: '',
    quantity: 1,
    urgencyLevel: 'Medium',
    hospitalName: '',
    doctorName: '',
    contactNumber: '',
    medicalReason: ''
  });

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const urgencyLevels = ['Low', 'Medium', 'High', 'Critical'];

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      // First get the recipient profile to get the correct recipient ID
      const profileResponse = await recipientAPI.getByUserId(currentUser.id);
      const recipientProfile = profileResponse.data;
      
      if (recipientProfile) {
        const response = await bloodRequestAPI.getByRecipientId(recipientProfile.id);
        setRequests(response.data || []);
      } else {
        setRequests([]);
      }
    } catch (error) {
      console.error('Error loading requests:', error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (request: BloodRequest) => {
    setSelectedRequest(request);
    setEditForm({
      bloodGroupNeeded: request.bloodGroupNeeded,
      quantity: request.quantity,
      urgencyLevel: request.urgencyLevel || 'Medium',
      hospitalName: request.hospitalName || '',
      doctorName: request.doctorName || '',
      contactNumber: request.contactNumber || '',
      medicalReason: request.medicalReason || ''
    });
    setEditDialog(true);
  };

  const handleUpdate = async () => {
    if (!selectedRequest) return;

    try {
      await bloodRequestAPI.update(selectedRequest.id, editForm);
      setEditDialog(false);
      loadRequests();
    } catch (error) {
      console.error('Error updating request:', error);
      alert('Failed to update request');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this request?')) return;

    try {
      await bloodRequestAPI.delete(id);
      loadRequests();
    } catch (error) {
      console.error('Error deleting request:', error);
      alert('Failed to delete request');
    }
  };

  const handleMarkFulfilled = async (id: number) => {
    if (!confirm('Are you sure you have received the blood and want to mark this request as fulfilled?')) return;

    try {
      await bloodRequestAPI.update(id, { status: 'Fulfilled' });
      loadRequests();
      alert('Request marked as fulfilled successfully!');
    } catch (error) {
      console.error('Error marking request as fulfilled:', error);
      alert('Failed to mark request as fulfilled');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'warning';
      case 'approved': return 'info';
      case 'fulfilled': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency?.toLowerCase()) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  if (loading) return <Loader message="Loading your requests..." />;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', width: '100vw', p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ color: '#d32f2f', fontWeight: 'bold' }}>
        My Blood Requests
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: '#ffebee' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Request ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Blood Group</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Quantity</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Urgency</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Request Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} sx={{ textAlign: 'center', py: 3 }}>
                  No blood requests found. Create your first request!
                </TableCell>
              </TableRow>
            ) : (
              requests.map((request) => (
                <TableRow key={request.id} hover>
                  <TableCell>#{request.id}</TableCell>
                  <TableCell>
                    <Chip 
                      label={request.bloodGroupNeeded} 
                      color="primary" 
                      variant="outlined" 
                    />
                  </TableCell>
                  <TableCell>{request.quantity} units</TableCell>
                  <TableCell>
                    <Chip 
                      label={request.urgencyLevel || 'Medium'} 
                      color={getUrgencyColor(request.urgencyLevel || 'Medium')}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={request.status} 
                      color={getStatusColor(request.status)}
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(request.requestDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <IconButton 
                      color="primary" 
                      onClick={() => handleEdit(request)}
                      disabled={request.status === 'Fulfilled' || request.status === 'Cancelled'}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton 
                      color="error" 
                      onClick={() => handleDelete(request.id)}
                      disabled={request.status === 'Fulfilled'}
                    >
                      <Delete />
                    </IconButton>
                    {(request.status === 'Pending' || request.status === 'Approved') && (
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => handleMarkFulfilled(request.id)}
                        sx={{ ml: 1 }}
                      >
                        Mark Fulfilled
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Dialog */}
      <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Blood Request</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
              <FormControl fullWidth required>
                <InputLabel>Blood Group Needed</InputLabel>
                <Select
                  value={editForm.bloodGroupNeeded}
                  onChange={(e) => setEditForm({...editForm, bloodGroupNeeded: e.target.value})}
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
                value={editForm.quantity}
                onChange={(e) => setEditForm({...editForm, quantity: parseInt(e.target.value)})}
                required
                fullWidth
                inputProps={{ min: 1, max: 10 }}
              />
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
              <FormControl fullWidth required>
                <InputLabel>Urgency Level</InputLabel>
                <Select
                  value={editForm.urgencyLevel}
                  onChange={(e) => setEditForm({...editForm, urgencyLevel: e.target.value})}
                  label="Urgency Level"
                >
                  {urgencyLevels.map(level => (
                    <MenuItem key={level} value={level}>{level}</MenuItem>
                  ))}
                </Select>
              </FormControl>


            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
              <TextField
                label="Hospital Name"
                value={editForm.hospitalName}
                onChange={(e) => setEditForm({...editForm, hospitalName: e.target.value})}
                fullWidth
              />

              <TextField
                label="Doctor Name"
                value={editForm.doctorName}
                onChange={(e) => setEditForm({...editForm, doctorName: e.target.value})}
                fullWidth
              />
            </Box>

            <TextField
              label="Contact Number"
              value={editForm.contactNumber}
              onChange={(e) => setEditForm({...editForm, contactNumber: e.target.value})}
              fullWidth
            />

            <TextField
              label="Medical Reason"
              value={editForm.medicalReason}
              onChange={(e) => setEditForm({...editForm, medicalReason: e.target.value})}
              fullWidth
              multiline
              rows={3}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdate} variant="contained">Update Request</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}