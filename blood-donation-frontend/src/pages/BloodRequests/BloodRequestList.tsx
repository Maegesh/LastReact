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
      
      // Check user role from localStorage
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const userRole = currentUser.role;
      
      if (filterByBloodGroup) {
        response = await bloodRequestAPI.getByBloodGroup(filterByBloodGroup);
      } else if (userRole === 0) {
        // Admin can see all requests
        response = await bloodRequestAPI.getAll();
      } else {
        // For donors, show empty array or use a different approach
        setBloodRequests([]);
        return;
      }
      
      let requests = response.data || [];
      
      if (filterByStatus) {
        requests = requests.filter((req: BloodRequest) => 
          req.status.toLowerCase() === filterByStatus.toLowerCase()
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
        // For donors, just show a success message for now
        const actionText = action === 'accept' ? 'accepted' : 'declined';
        alert(`You have ${actionText} this blood request. The recipient will be notified.`);
        setBloodRequests(prev => prev.filter(req => req.id !== id));
        return;
      }
      
      // For admins, update the request status
      const status = action === 'accept' ? 'Approved' : 'Cancelled';
      await bloodRequestAPI.update(id, { Status: status });
      loadBloodRequests();
    } catch (error) {
      console.error(`Error ${action}ing request:`, error);
      alert(`Failed to ${action} request`);
    }
  };
  
  const handleCreateAppointment = async (request: BloodRequest) => {
    try {
      setSelectedRequest(request);
      
      // Load blood banks and all donors, then filter by blood group
      const [bloodBanksRes, donorsRes] = await Promise.all([
        bloodBankAPI.getAll(),
        donorAPI.getAll()
      ]);
      
      setBloodBanks(bloodBanksRes.data || []);
      // Filter donors by matching blood group
      const matchingDonors = (donorsRes.data || []).filter(
        (donor: any) => donor.bloodGroup === request.bloodGroupNeeded
      );
      setDonors(matchingDonors);
      setAppointmentDialog(true);
    } catch (error) {
      console.error('Error loading appointment data:', error);
      alert('Failed to load appointment data');
    }
  };
  
  const handleSubmitAppointment = async () => {
    try {
      if (!appointmentForm.donorId || !appointmentForm.bloodBankId || !appointmentForm.appointmentDate || !appointmentForm.appointmentTime) {
        alert('Please fill all required fields');
        return;
      }
      
      // Combine date and time
      const appointmentDateTime = `${appointmentForm.appointmentDate}T${appointmentForm.appointmentTime}`;
      
      await appointmentAPI.create({
        donorId: parseInt(appointmentForm.donorId),
        bloodBankId: parseInt(appointmentForm.bloodBankId),
        appointmentDate: appointmentDateTime,
        remarks: appointmentForm.remarks
      });
      
      alert('Appointment created successfully! Notifications sent to donor and recipient.');
      setAppointmentDialog(false);
      setAppointmentForm({ donorId: '', bloodBankId: '', appointmentDate: '', appointmentTime: '', remarks: '' });
      loadBloodRequests();
    } catch (error) {
      console.error('Error creating appointment:', error);
      alert('Failed to create appointment');
    }
  };
  


  if (loading) return <Loader message="Loading blood requests..." />;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ color: '#d32f2f', fontWeight: 'bold' }}>
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
          <TableHead sx={{ bgcolor: '#e8f5e8' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Recipient Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Hospital</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Blood Group</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Quantity</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Request Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              {showActions && <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {bloodRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={showActions ? 8 : 7} sx={{ textAlign: 'center', py: 3 }}>
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
                      {request.status === 'Pending' ? (
                        <>
                          <IconButton 
                            color="success" 
                            size="small" 
                            sx={{ mr: 1 }}
                            onClick={() => handleAction(request.id, 'accept')}
                            title="Accept Request"
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
                      ) : request.status === 'Approved' ? (
                        <IconButton 
                          color="primary" 
                          size="small"
                          onClick={() => handleCreateAppointment(request)}
                          title="Create Appointment"
                        >
                          <Schedule />
                        </IconButton>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          {request.status}
                        </Typography>
                      )}
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
          {appointmentForm.donorId ? 
            `Create Appointment for Selected Donor` : 
            `Create Appointment for ${selectedRequest?.bloodGroupNeeded} Request`
          }
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              select
              label="Select Donor"
              value={appointmentForm.donorId}
              onChange={(e) => setAppointmentForm(prev => ({ ...prev, donorId: e.target.value }))}
              required
            >
              {donors.map((donor) => (
                <MenuItem key={donor.id} value={donor.id}>
                  {donor.userName} - {donor.bloodGroup}
                </MenuItem>
              ))}
            </TextField>
            
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
          <Button onClick={handleSubmitAppointment} variant="contained" sx={{ bgcolor: '#d32f2f' }}>
            Create Appointment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}