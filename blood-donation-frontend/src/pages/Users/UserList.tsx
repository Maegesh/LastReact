import { useState, useEffect } from 'react';
import { 
  Box, Typography, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Chip, IconButton 
} from '@mui/material';
import { useCache } from '../../hooks/useCache';
import { fetchUsers } from '../../store/userSlice';
import { userAPI } from '../../api/user.api';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';

export default function UserList() {
  const { data: users, loading, loadData } = useCache('users', fetchUsers);

  useEffect(() => {
    loadData();
  }, []);



  if (loading) return <Loader message="Loading users..." />;

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ color: '#d32f2f', fontWeight: 'bold' }}>
        Users Management
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: '#e3f2fd' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Username</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Created Date</TableCell>

            </TableRow>
          </TableHead>
          <TableBody>
            {(!users || users.length === 0) ? (
              <TableRow>
                <TableCell colSpan={5} sx={{ textAlign: 'center', py: 3 }}>
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              (users || []).map((user: any) => (
                <TableRow key={user.id} hover>
                  <TableCell>{user.id}</TableCell>
                  <TableCell sx={{ fontWeight: 'medium' }}>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip 
                      label={user.role === 0 ? 'Admin' : user.role === 1 ? 'Donor' : 'Recipient'}
                      color={user.role === 0 ? 'error' : user.role === 1 ? 'success' : 'info'}
                    />
                  </TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>

                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}