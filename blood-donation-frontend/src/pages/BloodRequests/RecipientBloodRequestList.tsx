import { useState, useEffect } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Chip, IconButton, Button
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { bloodRequestAPI } from '../../api/bloodRequest.api';
import { notificationAPI } from '../../api/notification.api';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchRecipientOverview } from '../../store/recipientSlice';
import type { BloodRequest } from '../../types/BloodRequest';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import '../../styles/common.css';

export default function RecipientBloodRequestList() {
  const dispatch = useAppDispatch();
  const { overview, loading } = useAppSelector(state => state.recipients);
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  
  const requests = overview?.bloodRequests || [];

  useEffect(() => {
    if (!overview && currentUser.id) {
      dispatch(fetchRecipientOverview(currentUser.id));
    }
  }, [dispatch, overview, currentUser.id]);

  const loadRequests = async () => {
    if (currentUser.id) {
      dispatch(fetchRecipientOverview(currentUser.id));
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
      await bloodRequestAPI.updateStatus(id, 'Completed');
      
      // Create notification for admin
      try {
        await notificationAPI.create({
          userId: 1,
          message: `Blood request #${id} has been marked as completed by recipient and needs admin fulfillment.`,
          type: 'BloodRequest',
          isRead: false
        });
      } catch (notificationError) {
        
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
              requests.map((request: any) => (
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