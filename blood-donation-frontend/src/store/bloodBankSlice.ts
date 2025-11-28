import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { bloodBankAPI } from '../api/bloodBank.api';

export const fetchBloodBanks = createAsyncThunk('bloodBanks/fetch', async () => {
  const response = await bloodBankAPI.getAll();
  return response.data;
});

const bloodBankSlice = createSlice({
  name: 'bloodBanks',
  initialState: { data: null as any, loading: false, lastFetched: null as number | null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBloodBanks.pending, (state) => { state.loading = true; })
      .addCase(fetchBloodBanks.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
        state.lastFetched = Date.now();
      });
  },
});

export default bloodBankSlice.reducer;