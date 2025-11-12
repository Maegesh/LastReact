import { useState, useEffect } from 'react';
import { 
  Box, Typography, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Chip 
} from '@mui/material';
import { donorAPI } from '../../api/donor.api';
import { userAPI } from '../../api/user.api';
import type { DonorProfile } from '../../types/DonorProfile';
import type { User } from '../../types/User';
import Loader from '../../components/Loader';

const getBloodGroupColor = (bloodGroup: string) => {
  const colors: any = {
    'A+': '#f44336', 'A-': '#e91e63', 'B+': '#9c27b0', 'B-': '#673ab7',
    'AB+': '#3f51b5', 'AB-': '#2196f3', 'O+': '#009688', 'O-': '#4caf50'
  };
  return colors[bloodGroup] || '#757575';
};

interface DonorWithUser extends DonorProfile {
  user?: User;
}

export default function DonorList() {
  const [donors, setDonors] = useState<DonorWithUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDonors();
  }, []);

  const loadDonors = async () => {
    try {
      setLoading(true);
      const response = await donorAPI.getAll();
      const donorProfiles = response.data || [];
      
      // Fetch user details for each donor
      const donorsWithUsers = await Promise.all(
        donorProfiles.map(async (donor: DonorProfile) => {
          try {
            const userResponse = await userAPI.getById(donor.userId);
            return { ...donor, user: userResponse.data };
          } catch (error) {
            console.error(`Error loading user ${donor.userId}:`, error);
            return donor;
          }
        })
      );
      
      setDonors(donorsWithUsers);
    } catch (error) {
      console.error('Error loading donors:', error);
    } finally {
      setLoading(false);
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
                    {donor.user ? `${donor.user.firstName || ''} ${donor.user.lastName || ''}`.trim() || donor.user.username : `User ${donor.userId}`}
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