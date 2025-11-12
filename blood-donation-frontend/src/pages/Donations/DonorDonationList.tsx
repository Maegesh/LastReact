import { useState, useEffect } from 'react';
import { 
  Box, Typography, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Chip 
} from '@mui/material';
import { donationAPI } from '../../api/donation.api';
import { donorAPI } from '../../api/donor.api';
import type { DonationRecord } from '../../types/DonationRecord';
import Loader from '../../components/Loader';

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'completed': case 'approved': return 'success';
    case 'pending': case 'scheduled': return 'warning';
    case 'cancelled': case 'rejected': return 'error';
    default: return 'default';
  }
};

export default function DonorDonationList() {
  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = currentUser.id;

  useEffect(() => {
    loadDonations();
  }, []);

  const loadDonations = async () => {
    try {
      setLoading(true);
      if (userId) {
        const donorRes = await donorAPI.getByUserId(userId);
        const profile = donorRes.data;
        const response = await donationAPI.getByDonor(profile.id);
        setDonations(response.data || []);
      }
    } catch (error) {
      console.error('Error loading donations:', error);
      setDonations([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader message="Loading donation history..." />;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', width: '100vw', p: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ color: '#d32f2f', fontWeight: 'bold' }}>
        My Donation History
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: '#e3f2fd' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Donation ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Blood Bank</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Quantity</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {donations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} sx={{ textAlign: 'center', py: 3 }}>
                  No donations found
                </TableCell>
              </TableRow>
            ) : (
              donations.map((donation) => (
                <TableRow key={donation.id} hover>
                  <TableCell>{donation.id}</TableCell>
                  <TableCell>{donation.bloodBankId}</TableCell>
                  <TableCell>{new Date(donation.donationDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Chip label={`${donation.quantity} units`} color="primary" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Chip label={donation.status} color={getStatusColor(donation.status)} />
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