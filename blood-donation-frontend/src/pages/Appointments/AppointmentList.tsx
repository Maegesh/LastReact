import { useState, useEffect } from 'react';
import { 
  Box, Typography, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Chip, Button, IconButton
} from '@mui/material';
import { Refresh, CheckCircle } from '@mui/icons-material';
import { appointmentAPI } from '../../api/appointment.api';
import type { Appointment } from '../../types/Appointment';
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
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const response = await appointmentAPI.getAll();
      setAppointments(response.data || []);
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader message="Loading appointments..." />;

  const handleMarkComplete = async (id: number) => {
    try {
      await appointmentAPI.update(id, { status: 'Completed' });
      loadAppointments();
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
        <IconButton onClick={loadAppointments} color="primary">
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
            {appointments.map((appointment) => (
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
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}