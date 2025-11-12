import { useState, useEffect } from 'react';
import { Box, Container, Paper, Avatar, IconButton, Typography } from '@mui/material';
import { Bloodtype, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { donorAPI } from '../../api/donor.api';
import BloodRequestList from './BloodRequestList';
import Loader from '../../components/Loader';

export default function DonorBloodRequestList() {
  const [donorBloodGroup, setDonorBloodGroup] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    loadDonorProfile();
  }, []);

  const loadDonorProfile = async () => {
    try {
      const userId = currentUser.id;
      
      if (userId) {
        const response = await donorAPI.getByUserId(userId);
        setDonorBloodGroup(response.data.bloodGroup);
      }
    } catch (error) {
      console.error('Error loading donor profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader message="Loading requests..." />;

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      width: '100vw', 
      bgcolor: '#f8fafc',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Modern Header */}
      <Paper sx={{ 
        bgcolor: 'white',
        borderRadius: 0,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        borderBottom: '1px solid #e2e8f0'
      }}>
        <Container maxWidth={false} sx={{ px: 3 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            py: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton onClick={() => navigate('/donor')} sx={{ mr: 2 }}>
                <ArrowBack />
              </IconButton>
              <Box sx={{
                width: 40,
                height: 40,
                borderRadius: '50% 50% 50% 0',
                bgcolor: '#d32f2f',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
                transform: 'rotate(-45deg)'
              }}>
                <Bloodtype sx={{ color: 'white', transform: 'rotate(45deg)', fontSize: 20 }} />
              </Box>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1e293b' }}>
                  Blood Requests
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Matching requests for {donorBloodGroup} donors
                </Typography>
              </Box>
            </Box>
            <Avatar sx={{ bgcolor: '#d32f2f', width: 40, height: 40 }}>
              {(currentUser.firstName || 'D')[0]}
            </Avatar>
          </Box>
        </Container>
      </Paper>

      {/* Content */}
      <Container maxWidth={false} sx={{ flex: 1, py: 3, px: 3 }}>
        <BloodRequestList 
          showActions={true} 
          filterByBloodGroup={donorBloodGroup}
          filterByStatus="Pending"
        />
      </Container>
    </Box>
  );
}