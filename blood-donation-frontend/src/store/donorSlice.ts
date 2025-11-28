import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { donorAPI } from '../api/donor.api';

export const fetchDonors = createAsyncThunk(
  'donors/fetchDonors',
  async () => {
    const response = await donorAPI.getAll();
    return response.data;
  }
);

const donorSlice = createSlice({
  name: 'donors',
  initialState: {
    data: null as any,
    loading: false,
    lastFetched: null as number | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDonors.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDonors.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
        state.lastFetched = Date.now();
      });
  },
});

export default donorSlice.reducer;