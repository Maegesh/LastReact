import { useState, useEffect } from 'react';
import { 
  Box, Typography, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Chip 
} from '@mui/material';
import { donationAPI } from '../../api/donation.api';
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

export default function DonationList() {
  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDonations();
  }, []);

  const loadDonations = async () => {
    try {
      setLoading(true);
      const response = await donationAPI.getAll();
      setDonations(response.data || []);
    } catch (error) {
      console.error('Error loading donations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader message="Loading donations..." />;

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ color: '#d32f2f', fontWeight: 'bold' }}>
        Donations Management
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: '#e8f5e8' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Donor Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Blood Bank</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Donation Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Quantity (units)</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {donations.map((donation) => (
              <TableRow key={donation.id} hover>
                <TableCell>{donation.id}</TableCell>
                <TableCell>{donation.donorName || `Donor ${donation.donorId}`}</TableCell>
                <TableCell>{donation.bloodBankName || `Blood Bank ${donation.bloodBankId}`}</TableCell>
                <TableCell>{new Date(donation.donationDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Chip label={`${donation.quantity} units`} color="primary" variant="outlined" />
                </TableCell>
                <TableCell>
                  <Chip label={donation.status} color={getStatusColor(donation.status)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}