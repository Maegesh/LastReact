import { useState, useEffect } from 'react';
import { 
  Box, Typography, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Chip, IconButton, Button 
} from '@mui/material';
import { Delete, Add } from '@mui/icons-material';
import { useCache } from '../../hooks/useCache';
import { fetchBloodBanks } from '../../store/bloodBankSlice';
import { bloodBankAPI } from '../../api/bloodBank.api';
import Loader from '../../components/Loader';
import AddBloodBankDialog from '../../components/AddBloodBankDialog';
import { toast } from 'react-toastify';

interface BloodBankListProps {
  showActions?: boolean;
}

export default function BloodBankList({ showActions = false }: BloodBankListProps) {
  const { data: bloodBanks, loading, loadData } = useCache('bloodBanks', fetchBloodBanks);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this blood bank?')) return;
    
    try {
      await bloodBankAPI.delete(id);
      loadData();
    } catch (error) {
      console.error('Error deleting blood bank:', error);
      toast.error('Failed to delete blood bank');
    }
  };

  if (loading) return <Loader message="Loading blood banks..." />;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', width: '100vw', p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ color: '#d32f2f', fontWeight: 'bold' }}>
          Blood Banks Management
        </Typography>
        {showActions && (
          <Button 
            variant="contained" 
            startIcon={<Add />} 
            sx={{ bgcolor: '#d32f2f' }}
            onClick={() => setDialogOpen(true)}
          >
            Add Blood Bank
          </Button>
        )}
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: '#ffebee' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Location</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Contact</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Capacity</TableCell>
              {showActions && <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {(!bloodBanks || bloodBanks.length === 0) ? (
              <TableRow>
                <TableCell colSpan={showActions ? 7 : 6} sx={{ textAlign: 'center', py: 3 }}>
                  No blood banks found
                </TableCell>
              </TableRow>
            ) : (
              (bloodBanks || []).map((bank: any) => (
                <TableRow key={bank.id} hover>
                  <TableCell>{bank.id}</TableCell>
                  <TableCell sx={{ fontWeight: 'medium' }}>{bank.name}</TableCell>
                  <TableCell>{bank.location}</TableCell>
                  <TableCell>{bank.contactNumber}</TableCell>
                  <TableCell>{bank.email}</TableCell>
                  <TableCell>
                    <Chip label={`${bank.capacity} units`} color="primary" variant="outlined" />
                  </TableCell>
                  {showActions && (
                    <TableCell>
                      <IconButton color="error" onClick={() => handleDelete(bank.id)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <AddBloodBankDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSuccess={() => loadData(true)}
      />
    </Box>
  );
}