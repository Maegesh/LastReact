import { useState, useEffect } from 'react';
import { 
  Box, Typography, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Chip 
} from '@mui/material';
import { useCache } from '../../hooks/useCache';
import { fetchRecipients } from '../../store/recipientSlice';
import Loader from '../../components/Loader';

const getBloodGroupColor = (bloodGroup: string) => {
  const colors: any = {
    'A+': '#f44336', 'A-': '#e91e63', 'B+': '#9c27b0', 'B-': '#673ab7',
    'AB+': '#3f51b5', 'AB-': '#2196f3', 'O+': '#009688', 'O-': '#4caf50'
  };
  return colors[bloodGroup] || '#757575';
};

export default function RecipientList() {
  const { data: recipients, loading, loadData } = useCache('recipients', fetchRecipients);

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <Loader message="Loading recipients..." />;

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ color: '#d32f2f', fontWeight: 'bold' }}>
        Recipients Management
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: '#e3f2fd' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>User ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Hospital Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Patient Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Required Blood Group</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Contact Number</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(!recipients || recipients.length === 0) ? (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: 'center', py: 3 }}>
                  No recipients found
                </TableCell>
              </TableRow>
            ) : (
              (recipients || []).map((recipient: any) => (
                <TableRow key={recipient.id} hover>
                  <TableCell>{recipient.id}</TableCell>
                  <TableCell>{recipient.userId}</TableCell>
                  <TableCell>{recipient.hospitalName}</TableCell>
                  <TableCell>{recipient.patientName}</TableCell>
                  <TableCell>
                    <Chip 
                      label={recipient.requiredBloodGroup}
                      sx={{ 
                        bgcolor: getBloodGroupColor(recipient.requiredBloodGroup),
                        color: 'white',
                        fontWeight: 'bold'
                      }} 
                    />
                  </TableCell>
                  <TableCell>{recipient.contactNumber}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}