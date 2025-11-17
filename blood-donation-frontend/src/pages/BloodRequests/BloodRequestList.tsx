import { useState, useEffect } from 'react';
import { 
  Box, Typography, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Chip, IconButton, Dialog, DialogTitle, 
  DialogContent, DialogActions, Button, TextField, MenuItem, Alert
} from '@mui/material';
import { CheckCircle, Cancel, Schedule, CheckCircleOutline, Refresh } from '@mui/icons-material';
import { bloodRequestAPI } from '../../api/bloodRequest.api';
import { appointmentAPI } from '../../api/appointment.api';
import { bloodBankAPI } from '../../api/bloodBank.api';
import { donorAPI } from '../../api/donor.api';
import type { BloodRequest } from '../../types/BloodRequest';
import type { BloodBank } from '../../types/BloodBank';
import type { DonorProfile } from '../../types/DonorProfile';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import '../../styles/common.css';

interface BloodRequestListProps {
  showActions?: boolean;
  filterByBloodGroup?: string;
  filterByStatus?: string;
}

const getBloodGroupColor = (bloodGroup: string) => {
  const colors: any = {
    'A+': '#f44336', 'A-': '#e91e63', 'B+': '#9c27b0', 'B-': '#673ab7',
    'AB+': '#3f51b5', 'AB-': '#2196f3', 'O+': '#009688', 'O-': '#4caf50'
  };
  return colors[bloodGroup] || '#757575';
};

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'fulfilled': case 'completed': case 'approved': return 'success';
    case 'pending': case 'scheduled': return 'warning';
    case 'cancelled': case 'rejected': return 'error';
    default: return 'default';
  }
};

export default function BloodRequestList({ 
  showActions = false, 
  filterByBloodGroup, 
  filterByStatus 
}: BloodRequestListProps) {
  const [bloodRequests, setBloodRequests] = useState<BloodRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [appointmentDialog, setAppointmentDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<BloodRequest | null>(null);
  const [bloodBanks, setBloodBanks] = useState<BloodBank[]>([]);
  const [donors, setDonors] = useState<DonorProfile[]>([]);
  const [appointmentForm, setAppointmentForm] = useState({
    donorId: '',
    bloodBankId: '',
    appointmentDate: '',
    appointmentTime: '',
    remarks: ''
  });

  useEffect(() => {
    loadBloodRequests();
  }, [filterByBloodGroup, filterByStatus]);

  const loadBloodRequests = async () => {
    try {
      setLoading(true);
      let response;
      
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const userRole = currentUser.role;
      
      if (filterByBloodGroup) {
        response = await bloodRequestAPI.getByBloodGroup(filterByBloodGroup);
      } else if (userRole === 0) {
        response = await bloodRequestAPI.getAll();
      } else {
        setBloodRequests([]);
        return;
      }
      
      let requests = response.data || [];
      
      if (filterByStatus) {
        requests = requests.filter((req: BloodRequest) => 
          req.status.toLowerCase() === filterByStatus.toLowerCase()
        );
      }
      
      if (userRole === 1) {
        const donorResponses = JSON.parse(localStorage.getItem('donorResponses') || '{}');
        requests = requests.filter((req: BloodRequest) => 
          !donorResponses[`${currentUser.id}_${req.id}`]
        );
      }
      
      setBloodRequests(requests);
    } catch (error) {
      console.error('Error loading blood requests:', error);
      setBloodRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: number, action: 'accept' | 'decline') => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const userRole = currentUser.role;
      
      if (userRole === 1) {
        // For donors - accept/decline and create appointment if accepted
        const actionText = action === 'accept' ? 'accepted' : 'declined';
        
        try {
          const donorProfileResponse = await donorAPI.getByUserId(currentUser.id);
          const donorId = donorProfileResponse.data.id;
          
          if (action === 'accept') {
            // If accepting, showing appointment creation dialog
            const request = bloodRequests.find(req => req.id === id);
            if (request) {
              setSelectedRequest(request);
              // Load blood banks for appointment
              const bloodBanksRes = await bloodBankAPI.getAll();
              setBloodBanks(bloodBanksRes.data || []);
              setAppointmentDialog(true);
              return;
            }
          } else {
            // If declining, just update status
            await bloodRequestAPI.donorResponse(id, action, donorId);
            
            // Store donor response in localStorage to prevent showing again
            const donorResponses = JSON.parse(localStorage.getItem('donorResponses') || '{}');
            donorResponses[`${currentUser.id}_${id}`] = action;
            localStorage.setItem('donorResponses', JSON.stringify(donorResponses));
            
            toast.success(`You have ${actionText} this blood request. Notifications sent.`);
            setBloodRequests(prev => prev.filter(req => req.id !== id));
          }
        } catch (profileError) {
          console.error('Error getting donor profile:', profileError);
          toast.error('Failed to get donor profile');
          return;
        }
      }
      
      // For admins, just view the requests 
    } catch (error) {
      console.error(`Error ${action}ing request:`, error);
      toast.error(`Failed to ${action} request`);
    }
  };
  

  
  const handleMarkAsFulfilled = async (requestId: number) => {
    try {
      await bloodRequestAPI.update(requestId, { status: 'Fulfilled' });
      toast.success('Blood request marked as fulfilled!');
      loadBloodRequests(); // Refresh the list
    } catch (error) {
      console.error('Error marking request as fulfilled:', error);
      toast.error('Failed to mark request as fulfilled');
    }
  };
  
  const handleSubmitAppointment = async () => {
    try {
      if (!appointmentForm.bloodBankId || !appointmentForm.appointmentDate || !appointmentForm.appointmentTime) {
        toast.warning('Please fill all required fields');
        return;
      }
      
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const donorProfileResponse = await donorAPI.getByUserId(currentUser.id);
      const donorId = donorProfileResponse.data.id;
      
      const appointmentDateTime = `${appointmentForm.appointmentDate}T${appointmentForm.appointmentTime}`;
      
      // Create appointment with current donor
      await appointmentAPI.create({
        donorId: donorId,
        bloodBankId: parseInt(appointmentForm.bloodBankId),
        appointmentDate: appointmentDateTime,
        remarks: appointmentForm.remarks,
        bloodRequestId: selectedRequest?.id || 0
      });
      
      // Update blood request status to accepted
      await bloodRequestAPI.donorResponse(selectedRequest?.id || 0, 'accept', donorId);
      
      // Store donor response in localStorage to prevent showing again
      const donorResponses = JSON.parse(localStorage.getItem('donorResponses') || '{}');
      donorResponses[`${currentUser.id}_${selectedRequest?.id}`] = 'accept';
      localStorage.setItem('donorResponses', JSON.stringify(donorResponses));
      
      toast.success('Appointment created successfully! Notifications sent to recipient and admin.');
      setAppointmentDialog(false);
      setAppointmentForm({ donorId: '', bloodBankId: '', appointmentDate: '', appointmentTime: '', remarks: '' });
      setBloodRequests(prev => prev.filter(req => req.id !== selectedRequest?.id));
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast.error('Failed to create appointment');
    }
  };
  


  if (loading) return <Loader message="Loading blood requests..." />;

  return (
    <Box>
      <Box className="flex-between">
        <Typography variant="h5" className="page-title">
          {filterByStatus ? `${filterByStatus} ` : ''}Blood Requests
        </Typography>
        <Button 
          variant="outlined" 
          onClick={loadBloodRequests}
          disabled={loading}
          sx={{ minWidth: 100 }}
        >
          {loading ? 'Loading...' : 'Refresh'}
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead className="table-header-green">
            <TableRow>
              <TableCell className="table-header-cell">ID</TableCell>
              <TableCell className="table-header-cell">Recipient Name</TableCell>
              <TableCell className="table-header-cell">Hospital</TableCell>
              <TableCell className="table-header-cell">Blood Group</TableCell>
              <TableCell className="table-header-cell">Quantity</TableCell>
              <TableCell className="table-header-cell">Request Date</TableCell>
              <TableCell className="table-header-cell">Status</TableCell>
              {showActions && <TableCell className="table-header-cell">Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {bloodRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={showActions ? 8 : 7} className="table-empty-cell">
                  No requests found
                </TableCell>
              </TableRow>
            ) : (
              bloodRequests.map((request) => (
                <TableRow key={request.id} hover>
                  <TableCell>{request.id}</TableCell>
                  <TableCell>{request.recipientName || `Recipient ${request.recipientId}`}</TableCell>
                  <TableCell>{request.hospitalName || 'Not specified'}</TableCell>
                  <TableCell>
                    <Chip 
                      label={request.bloodGroupNeeded} 
                      sx={{ 
                        bgcolor: getBloodGroupColor(request.bloodGroupNeeded),
                        color: 'white',
                        fontWeight: 'bold'
                      }} 
                    />
                  </TableCell>
                  <TableCell>
                    <Chip label={`${request.quantity} units`} color="info" variant="outlined" />
                  </TableCell>
                  <TableCell>{new Date(request.requestDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Chip label={request.status} color={getStatusColor(request.status)} />
                  </TableCell>
                  {showActions && (
                    <TableCell>
                      {(() => {
                        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
                        const userRole = currentUser.role;
                        
                        if (userRole === 1) { // Donor
                          if (request.status === 'Pending') {
                            return (
                              <>
                                <IconButton 
                                  color="success" 
                                  size="small" 
                                  className="mr-1"
                                  onClick={() => handleAction(request.id, 'accept')}
                                  title="Accept & Create Appointment"
                                >
                                  <CheckCircle />
                                </IconButton>
                                <IconButton 
                                  color="error" 
                                  size="small"
                                  onClick={() => handleAction(request.id, 'decline')}
                                  title="Decline Request"
                                >
                                  <Cancel />
                                </IconButton>
                              </>
                            );
                          }
                        } else if (userRole === 0) { // Admin
                          if (request.status === 'Completed') {
                            return (
                              <IconButton 
                                color="success" 
                                size="small"
                                onClick={() => handleMarkAsFulfilled(request.id)}
                                title="Mark as Fulfilled"
                              >
                                <CheckCircleOutline />
                              </IconButton>
                            );
                          }
                          return (
                            <Typography variant="body2" color="text.secondary">
                              {request.status === 'Accepted' ? 'Appointment Scheduled' : request.status}
                            </Typography>
                          );
                        }
                        
                        return (
                          <Typography variant="body2" color="text.secondary">
                            {request.status}
                          </Typography>
                        );
                      })()} 
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Dialog open={appointmentDialog} onClose={() => setAppointmentDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Create Appointment for {selectedRequest?.bloodGroupNeeded} Blood Request
        </DialogTitle>
        <DialogContent>
          <Box className="form-container" sx={{ mt: 1 }}>
            
            <TextField
              select
              label="Select Blood Bank"
              value={appointmentForm.bloodBankId}
              onChange={(e) => setAppointmentForm(prev => ({ ...prev, bloodBankId: e.target.value }))}
              required
            >
              {bloodBanks.map((bank) => (
                <MenuItem key={bank.id} value={bank.id}>
                  {bank.name} - {bank.location}
                </MenuItem>
              ))}
            </TextField>
            
            <TextField
              type="date"
              label="Appointment Date"
              value={appointmentForm.appointmentDate}
              onChange={(e) => setAppointmentForm(prev => ({ ...prev, appointmentDate: e.target.value }))}
              InputLabelProps={{ shrink: true }}
              required
            />
            
            <TextField
              type="time"
              label="Appointment Time"
              value={appointmentForm.appointmentTime}
              onChange={(e) => setAppointmentForm(prev => ({ ...prev, appointmentTime: e.target.value }))}
              InputLabelProps={{ shrink: true }}
              required
            />
            
            <TextField
              label="Remarks"
              value={appointmentForm.remarks}
              onChange={(e) => setAppointmentForm(prev => ({ ...prev, remarks: e.target.value }))}
              multiline
              rows={3}
              placeholder="Additional instructions or notes..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAppointmentDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmitAppointment} variant="contained" className="primary-button">
            Create Appointment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}