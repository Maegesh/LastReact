import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { notificationAPI } from '../api/notification.api';

export const fetchNotifications = createAsyncThunk('notifications/fetch', async () => {
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = currentUser.role === 0;
  
  if (isAdmin) {
    const response = await notificationAPI.getAllWithUsers();
    return response.data;
  } else {
    const response = await notificationAPI.getByUser(currentUser.id);
    return response.data;
  }
});

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: { data: null as any, loading: false, lastFetched: null as number | null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => { state.loading = true; })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
        state.lastFetched = Date.now();
      });
  },
});

export default notificationSlice.reducer;