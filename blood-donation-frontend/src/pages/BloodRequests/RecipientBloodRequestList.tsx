import { useState, useEffect } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Chip, IconButton, Button
} from '@mui/material';
import { Delete, Visibility } from '@mui/icons-material';
import { bloodRequestAPI } from '../../api/bloodRequest.api';
import { recipientAPI } from '../../api/recipient.api';
import { notificationAPI } from '../../api/notification.api';
import type { BloodRequest } from '../../types/BloodRequest';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import '../../styles/common.css';

export default function RecipientBloodRequestList() {
  const [requests, setRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(true);


  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');


  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    if ((window as any).recipientRequestsLoading) return;
    try {
      (window as any).recipientRequestsLoading = true;
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
      setRequests([]);
    } finally {
      setLoading(false);
      (window as any).recipientRequestsLoading = false;
    }
  };



  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this request?')) return;

    try {
      await bloodRequestAPI.delete(id);
      loadRequests();
    } catch (error) {
      toast.error('Failed to delete request');
    }
  };

  const handleMarkCompleted = async (id: number) => {
    try {
      await bloodRequestAPI.update(id, { status: 'Completed' });
      
      // Create notification for admin
      try {
        await notificationAPI.create({
          userId: 1, // Admin user ID (assuming admin has ID 1)
          message: `Blood request #${id} has been marked as completed by recipient and needs admin fulfillment.`,
          type: 'BloodRequest',
          isRead: false
        });
      } catch (notificationError) {
        // Admin notification failed - continue with success flow
      }
      
      loadRequests();
      toast.success('Request marked as completed successfully! Admin has been notified.');
    } catch (error) {
      toast.error('Failed to mark request as completed');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'warning';
      case 'approved': return 'info';
      case 'fulfilled': return 'success';
      case 'completed': return 'info';
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
    <Box className="page-container">
      <Typography variant="h5" gutterBottom className="page-title">
        My Blood Requests
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead className="table-header-pink">
            <TableRow>
              <TableCell className="table-header-cell">Request ID</TableCell>
              <TableCell className="table-header-cell">Blood Group</TableCell>
              <TableCell className="table-header-cell">Quantity</TableCell>
              <TableCell className="table-header-cell">Urgency</TableCell>
              <TableCell className="table-header-cell">Status</TableCell>
              <TableCell className="table-header-cell">Request Date</TableCell>
              <TableCell className="table-header-cell">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {requests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="table-empty-cell">
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
                    {request.status === 'Approved' && (
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => handleMarkCompleted(request.id)}
                        className="action-button"
                      >
                        Mark Completed
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