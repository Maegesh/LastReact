import { useState, useEffect } from 'react';
import { 
  Box, Typography, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Chip 
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchDonors } from '../../store/donorSlice';
import type { DonorProfile } from '../../types/DonorProfile';
import Loader from '../../components/Loader';

const getBloodGroupColor = (bloodGroup: string) => {
  const colors: any = {
    'A+': '#f44336', 'A-': '#e91e63', 'B+': '#9c27b0', 'B-': '#673ab7',
    'AB+': '#3f51b5', 'AB-': '#2196f3', 'O+': '#009688', 'O-': '#4caf50'
  };
  return colors[bloodGroup] || '#757575';
};

export default function DonorList() {
  const [donors, setDonors] = useState<DonorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();
  const { data: donorsData, loading: donorsLoading, lastFetched } = useAppSelector(state => state.donors);

  useEffect(() => {
    loadDonors();
  }, [dispatch]);

  useEffect(() => {
    if (donorsData) {
      setDonors(donorsData);
    }
    setLoading(donorsLoading);
  }, [donorsData, donorsLoading]);

  const loadDonors = async () => {
    const fiveMinutes = 5 * 60 * 1000;
    const shouldRefetch = !donorsData || !lastFetched || (Date.now() - lastFetched > fiveMinutes);
    
    if (shouldRefetch) {
      try {
        await dispatch(fetchDonors()).unwrap();
      } catch (error) {
        console.error('Error loading donors:', error);
      }
    }
  };

  if (loading) return <Loader message="Loading donors..." />;

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ color: '#d32f2f', fontWeight: 'bold' }}>
        Donors Management
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: '#fff3e0' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Blood Group</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Age</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Gender</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Last Donation</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Eligible</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {donors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} sx={{ textAlign: 'center', py: 3 }}>
                  No donors found
                </TableCell>
              </TableRow>
            ) : (
              donors.map((donor) => (
                <TableRow key={donor.id} hover>
                  <TableCell>{donor.id}</TableCell>
                  <TableCell>
                    {donor.userName || `User ${donor.userId}`}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={donor.bloodGroup}
                      sx={{ 
                        bgcolor: getBloodGroupColor(donor.bloodGroup),
                        color: 'white',
                        fontWeight: 'bold'
                      }} 
                    />
                  </TableCell>
                  <TableCell>{donor.age}</TableCell>
                  <TableCell>{donor.gender}</TableCell>
                  <TableCell>
                    {donor.lastDonationDate ? new Date(donor.lastDonationDate).toLocaleDateString() : 'Never'}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={donor.eligibilityStatus ? 'Yes' : 'No'}
                      color={donor.eligibilityStatus ? 'success' : 'error'}
                    />
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