import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { bloodRequestAPI } from '../api/bloodRequest.api';
import { donorAPI } from '../api/donor.api';

export const fetchBloodRequests = createAsyncThunk('bloodRequests/fetch', async () => {
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = currentUser.role;
  
  if (userRole === 0) {
    // Admin - can access all requests
    const response = await bloodRequestAPI.getAll();
    return response.data;
  } else {
    // For donors and others - return empty array, use overview data instead
    return [];
  }
});

export const setBloodRequestsFromOverview = (bloodRequests: any[]) => ({
  type: 'bloodRequests/setFromOverview',
  payload: bloodRequests
});

const bloodRequestSlice = createSlice({
  name: 'bloodRequests',
  initialState: { data: null as any, loading: false, lastFetched: null as number | null },
  reducers: {
    setFromOverview: (state, action) => {
      state.data = action.payload;
      state.lastFetched = Date.now();
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBloodRequests.pending, (state) => { state.loading = true; })
      .addCase(fetchBloodRequests.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
        state.lastFetched = Date.now();
      });
  },
});

export const { setFromOverview } = bloodRequestSlice.actions;
export default bloodRequestSlice.reducer;