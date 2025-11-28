import { useState, useEffect } from 'react';
import { 
  Box, Typography, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Chip, IconButton
} from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { useCache } from '../../hooks/useCache';
import { fetchBloodStock } from '../../store/bloodStockSlice';
import Loader from '../../components/Loader';

const getBloodGroupColor = (bloodGroup: string) => {
  const colors: any = {
    'A+': '#f44336', 'A-': '#e91e63', 'B+': '#9c27b0', 'B-': '#673ab7',
    'AB+': '#3f51b5', 'AB-': '#2196f3', 'O+': '#009688', 'O-': '#4caf50'
  };
  return colors[bloodGroup] || '#757575';
};

export default function BloodStockList() {
  const { data: bloodStock, loading, loadData } = useCache('bloodStock', fetchBloodStock);

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <Loader message="Loading blood stock..." />;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', width: '100vw', p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ color: '#d32f2f', fontWeight: 'bold' }}>
          Blood Stock Management
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
              <TableCell sx={{ fontWeight: 'bold' }}>Blood Bank</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Blood Group</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Units Available</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Last Updated</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(!bloodStock || bloodStock.length === 0) ? (
              <TableRow>
                <TableCell colSpan={5} sx={{ textAlign: 'center', py: 3 }}>
                  No blood stock data found
                </TableCell>
              </TableRow>
            ) : (
              (bloodStock || []).map((stock: any) => (
                <TableRow key={stock.id} hover>
                  <TableCell>{stock.id}</TableCell>
                  <TableCell>{stock.bloodBankName || `Blood Bank ${stock.bloodBankId}`}</TableCell>
                  <TableCell>
                    <Chip 
                      label={stock.bloodGroup}
                      sx={{ 
                        bgcolor: getBloodGroupColor(stock.bloodGroup),
                        color: 'white',
                        fontWeight: 'bold'
                      }} 
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={`${stock.unitsAvailable} units`}
                      color={stock.unitsAvailable > 10 ? 'success' : stock.unitsAvailable > 5 ? 'warning' : 'error'}
                    />
                  </TableCell>
                  <TableCell>{new Date(stock.lastUpdated).toLocaleDateString()}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}