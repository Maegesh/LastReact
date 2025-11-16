import { useState, useEffect } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Chip, IconButton, Button
} from '@mui/material';
import { Delete, Visibility } from '@mui/icons-material';
import { bloodRequestAPI } from '../../api/bloodRequest.api';
import { recipientAPI } from '../../api/recipient.api';
import type { BloodRequest } from '../../types/BloodRequest';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';

export default function RecipientBloodRequestList() {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(true);


  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');


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



  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this request?')) return;

    try {
      await bloodRequestAPI.delete(id);
      loadRequests();
    } catch (error) {
      console.error('Error deleting request:', error);
      toast.error('Failed to delete request');
    }
  };

  const handleMarkFulfilled = async (id: number) => {
    try {
      await bloodRequestAPI.update(id, { status: 'Fulfilled' });
      loadRequests();
      toast.success('Request marked as fulfilled successfully!');
    } catch (error) {
      console.error('Error marking request as fulfilled:', error);
      toast.error('Failed to mark request as fulfilled');
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

    </Box>
  );
}