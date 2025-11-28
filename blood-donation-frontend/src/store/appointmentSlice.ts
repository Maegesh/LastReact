import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { appointmentAPI } from '../api/appointment.api';

export const fetchAppointments = createAsyncThunk('appointments/fetch', async () => {
  const response = await appointmentAPI.getAll();
  return response.data;
});

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState: { data: null as any, loading: false, lastFetched: null as number | null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointments.pending, (state) => { state.loading = true; })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
        state.lastFetched = Date.now();
      });
  },
});

export default appointmentSlice.reducer;