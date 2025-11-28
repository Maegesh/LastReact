import { useState, useEffect } from 'react';
import { 
  Box, Typography, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Chip, Button, IconButton
} from '@mui/material';
import { Refresh, CheckCircle } from '@mui/icons-material';
import { useCache } from '../../hooks/useCache';
import { fetchAppointments } from '../../store/appointmentSlice';
import { appointmentAPI } from '../../api/appointment.api';
import Loader from '../../components/Loader';

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'completed': case 'approved': return 'success';
    case 'pending': case 'scheduled': return 'warning';
    case 'cancelled': case 'rejected': return 'error';
    default: return 'default';
  }
};

export default function AppointmentList() {
  const { data: appointments, loading, loadData } = useCache('appointments', fetchAppointments);

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <Loader message="Loading appointments..." />;

  const handleMarkComplete = async (id: number) => {
    try {
      await appointmentAPI.updateStatus(id, 'Completed');
      loadData(true);
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ color: '#d32f2f', fontWeight: 'bold' }}>
          Appointments Management
        </Typography>
        <IconButton onClick={() => loadData()} color="primary">
          <Refresh />
        </IconButton>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: '#fff3e0' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Donor Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Blood Bank</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Appointment Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Remarks</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(!appointments || appointments.length === 0) ? (
              <TableRow>
                <TableCell colSpan={7} sx={{ textAlign: 'center', py: 3 }}>
                  No appointments found
                </TableCell>
              </TableRow>
            ) : (
              (appointments || []).map((appointment: any) => (
                <TableRow key={appointment.id} hover>
                  <TableCell>{appointment.id}</TableCell>
                  <TableCell>{appointment.donorName || `Donor ${appointment.donorId}`}</TableCell>
                  <TableCell>{appointment.bloodBankName || `Blood Bank ${appointment.bloodBankId}`}</TableCell>
                  <TableCell>{new Date(appointment.appointmentDate).toLocaleDateString()}</TableCell>
                  <TableCell>{appointment.remarks || 'None'}</TableCell>
                  <TableCell>
                    <Chip label={appointment.status} color={getStatusColor(appointment.status)} />
                  </TableCell>
                  <TableCell>
                    {appointment.status === 'Scheduled' && (
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        startIcon={<CheckCircle />}
                        onClick={() => handleMarkComplete(appointment.id)}
                      >
                        Mark Complete
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