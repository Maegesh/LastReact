import { useState, useEffect } from 'react';
import {
  Box, Container, Paper, Avatar, IconButton, Typography, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, Chip
} from '@mui/material';
import { Business, ArrowBack, Phone, Email, LocationOn } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { bloodBankAPI } from '../../api/bloodBank.api';
import type { BloodBank } from '../../types/BloodBank';
import Loader from '../../components/Loader';

export default function RecipientBloodBankList() {
  const [bloodBanks, setBloodBanks] = useState<BloodBank[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    loadBloodBanks();
  }, []);

  const loadBloodBanks = async () => {
    try {
      const response = await bloodBankAPI.getAll();
      setBloodBanks(response.data || []);
    } catch (error) {
      console.error('Error loading blood banks:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader message="Loading blood banks..." />;

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      width: '100vw', 
      bgcolor: '#f8fafc',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
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
              <IconButton onClick={() => navigate('/recipient')} sx={{ mr: 2 }}>
                <ArrowBack />
              </IconButton>
              <Box sx={{
                width: 40,
                height: 40,
                borderRadius: '50% 50% 50% 0',
                bgcolor: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
                transform: 'rotate(-45deg)'
              }}>
                <Business sx={{ color: 'white', transform: 'rotate(45deg)', fontSize: 20 }} />
              </Box>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1e293b' }}>
                  Blood Banks
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Available blood banks and their capacity
                </Typography>
              </Box>
            </Box>
            <Avatar sx={{ bgcolor: '#d32f2f', width: 40, height: 40 }}>
              {(currentUser.firstName || 'R')[0]}
            </Avatar>
          </Box>
        </Container>
      </Paper>

      {/* Content */}
      <Container maxWidth={false} sx={{ flex: 1, py: 3, px: 3 }}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ bgcolor: '#f0fdf4' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Blood Bank Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Location</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Capacity</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Contact</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bloodBanks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: 'center', py: 3 }}>
                    No blood banks found
                  </TableCell>
                </TableRow>
              ) : (
                bloodBanks.map((bank) => (
                  <TableRow key={bank.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{
                          width: 32,
                          height: 32,
                          borderRadius: 2,
                          bgcolor: '#f0fdf4',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Business sx={{ color: '#10b981', fontSize: 16 }} />
                        </Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          {bank.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationOn sx={{ fontSize: 16, color: '#64748b' }} />
                        {bank.location}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={`${bank.capacity} units`} 
                        color="success" 
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Phone sx={{ fontSize: 16, color: '#64748b' }} />
                        {bank.contactNumber}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Email sx={{ fontSize: 16, color: '#64748b' }} />
                        {bank.email}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Box>
  );
}