import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { dashboardAPI } from '../api/dashboard.api';

export const fetchDashboardOverview = createAsyncThunk(
  'dashboard/fetchOverview',
  async () => {
    const response = await dashboardAPI.getOverview();
    return response.data;
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    overview: null as any,
    overviewLoading: false,
    lastFetched: null as number | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardOverview.pending, (state) => {
        state.overviewLoading = true;
      })
      .addCase(fetchDashboardOverview.fulfilled, (state, action) => {
        state.overview = action.payload;
        state.overviewLoading = false;
        state.lastFetched = Date.now();
      });
  },
});

export default dashboardSlice.reducer;