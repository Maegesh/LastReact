import { configureStore } from '@reduxjs/toolkit';
import dashboardReducer from './dashboardSlice';
import donorReducer from './donorSlice';
import bloodBankReducer from './bloodBankSlice';
import bloodRequestReducer from './bloodRequestSlice';
import userReducer from './userSlice';
import recipientReducer from './recipientSlice';
import donationReducer from './donationSlice';
import appointmentReducer from './appointmentSlice';
import bloodStockReducer from './bloodStockSlice';
import notificationReducer from './notificationSlice';

export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    donors: donorReducer,
    bloodBanks: bloodBankReducer,
    bloodRequests: bloodRequestReducer,
    users: userReducer,
    recipients: recipientReducer,
    donations: donationReducer,
    appointments: appointmentReducer,
    bloodStock: bloodStockReducer,
    notifications: notificationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;