import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { bloodStockAPI } from '../api/bloodStock.api';

export const fetchBloodStock = createAsyncThunk('bloodStock/fetch', async () => {
  const response = await bloodStockAPI.getAll();
  return response.data;
});

const bloodStockSlice = createSlice({
  name: 'bloodStock',
  initialState: { data: null as any, loading: false, lastFetched: null as number | null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBloodStock.pending, (state) => { state.loading = true; })
      .addCase(fetchBloodStock.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
        state.lastFetched = Date.now();
      });
  },
});

export default bloodStockSlice.reducer;