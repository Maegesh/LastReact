import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { recipientAPI } from '../api/recipient.api';

export const fetchRecipientOverview = createAsyncThunk('recipient/fetchOverview', async (userId: number) => {
  const response = await recipientAPI.getOverview(userId);
  return response.data;
});

export const fetchRecipients = createAsyncThunk('recipient/fetchAll', async () => {
  const response = await recipientAPI.getAll();
  return response.data;
});

const recipientSlice = createSlice({
  name: 'recipient',
  initialState: { 
    overview: null as any,
    data: null as any,
    loading: false, 
    lastFetched: null as number | null 
  },
  reducers: {
    clearRecipientData: (state) => {
      state.overview = null;
      state.lastFetched = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipientOverview.pending, (state) => { 
        state.loading = true; 
      })
      .addCase(fetchRecipientOverview.fulfilled, (state, action) => {
        state.overview = action.payload;
        state.loading = false;
        state.lastFetched = Date.now();
      })
      .addCase(fetchRecipientOverview.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchRecipients.pending, (state) => { 
        state.loading = true; 
      })
      .addCase(fetchRecipients.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
        state.lastFetched = Date.now();
      })
      .addCase(fetchRecipients.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { clearRecipientData } = recipientSlice.actions;
export default recipientSlice.reducer;