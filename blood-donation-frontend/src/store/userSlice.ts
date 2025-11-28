import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userAPI } from '../api/user.api';

export const fetchUsers = createAsyncThunk('users/fetch', async () => {
  const response = await userAPI.getAll();
  return response.data;
});

const userSlice = createSlice({
  name: 'users',
  initialState: { data: null as any, loading: false, lastFetched: null as number | null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => { state.loading = true; })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
        state.lastFetched = Date.now();
      });
  },
});

export default userSlice.reducer;