import { useState, useEffect } from 'react';
import { 
  Box, Typography, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Chip 
} from '@mui/material';
import { appointmentAPI } from '../../api/appointment.api';
import { donorAPI } from '../../api/donor.api';
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

export default function DonorAppointmentList() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = currentUser.id;

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      if (userId) {
        const donorRes = await donorAPI.getByUserId(userId);
        const profile = donorRes.data;
        const response = await appointmentAPI.getByDonor(profile.id);
        setAppointments(response.data || []);
      }
    } catch (error) {
      console.error('Error loading appointments:', error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader message="Loading appointments..." />;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', width: '100vw', p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ color: '#d32f2f', fontWeight: 'bold' }}>
        My Appointments
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: '#e8f5e8' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Appointment ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Blood Bank</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Remarks</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} sx={{ textAlign: 'center', py: 3 }}>
                  No appointments found
                </TableCell>
              </TableRow>
            ) : (
              appointments.map((appointment) => (
                <TableRow key={appointment.id} hover>
                  <TableCell>{appointment.id}</TableCell>
                  <TableCell>{appointment.bloodBankId}</TableCell>
                  <TableCell>{new Date(appointment.appointmentDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Chip label={appointment.status} color={getStatusColor(appointment.status)} />
                  </TableCell>
                  <TableCell>{appointment.remarks || 'None'}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}