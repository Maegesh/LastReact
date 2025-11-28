import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { donationAPI } from '../api/donation.api';
import { donorAPI } from '../api/donor.api';

export const fetchDonations = createAsyncThunk('donations/fetch', async () => {
  const response = await donationAPI.getAll();
  return response.data;
});

export const fetchDonorOverview = createAsyncThunk('donor/fetchOverview', async (userId: number) => {
  const response = await donorAPI.getOverview(userId);
  return response.data;
});

const donationSlice = createSlice({
  name: 'donations',
  initialState: { 
    data: null as any, 
    overview: null as any,
    appointments: null as any,
    donations: null as any,
    loading: false, 
    lastFetched: null as number | null 
  },
  reducers: {
    clearDonorData: (state) => {
      state.overview = null;
      state.appointments = null;
      state.donations = null;
      state.lastFetched = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDonations.pending, (state) => { state.loading = true; })
      .addCase(fetchDonations.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
        state.lastFetched = Date.now();
      })
      .addCase(fetchDonorOverview.pending, (state) => { 
        state.loading = true; 
      })
      .addCase(fetchDonorOverview.fulfilled, (state, action) => {
        state.overview = action.payload;
        state.appointments = action.payload.appointments;
        state.donations = action.payload.donations;
        state.loading = false;
        state.lastFetched = Date.now();
      })
      .addCase(fetchDonorOverview.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { clearDonorData } = donationSlice.actions;
export default donationSlice.reducer;