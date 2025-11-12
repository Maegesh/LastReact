import { createBrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import AdminDashboard from '../pages/AdminDashboard';
import DonorDashboard from '../pages/DonorDashboard';
import RecipientDashboard from '../pages/RecipientDashboard';
import ProtectedRoute from '../auth/ProtectedRoute';

// Donor pages
import DonorBloodRequestList from '../pages/BloodRequests/DonorBloodRequestList';
import DonorAppointmentList from '../pages/Appointments/DonorAppointmentList';
import DonorDonationList from '../pages/Donations/DonorDonationList';
import BloodBankList from '../pages/BloodBanks/BloodBankList';
import BloodStockList from '../pages/BloodStock/BloodStockList';
import NotificationList from '../pages/Notifications/NotificationList';

// Recipient pages
import RecipientBloodRequestList from '../pages/BloodRequests/RecipientBloodRequestList';
import CreateBloodRequest from '../pages/BloodRequests/CreateBloodRequest';

import Navbar from '../components/Navbar';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute requiredRole={0}>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/donor",
    element: (
      <ProtectedRoute requiredRole={1}>
        <DonorDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/donor/requests",
    element: (
      <ProtectedRoute requiredRole={1}>
        <><Navbar title="Donor Dashboard" userInfo={JSON.parse(localStorage.getItem('user') || '{}').FirstName || JSON.parse(localStorage.getItem('user') || '{}').Email} /><DonorBloodRequestList /></>
      </ProtectedRoute>
    ),
  },
  {
    path: "/donor/appointments",
    element: (
      <ProtectedRoute requiredRole={1}>
        <><Navbar title="Donor Dashboard" userInfo={JSON.parse(localStorage.getItem('user') || '{}').FirstName || JSON.parse(localStorage.getItem('user') || '{}').Email} /><DonorAppointmentList /></>
      </ProtectedRoute>
    ),
  },
  {
    path: "/donor/donations",
    element: (
      <ProtectedRoute requiredRole={1}>
        <><Navbar title="Donor Dashboard" userInfo={JSON.parse(localStorage.getItem('user') || '{}').FirstName || JSON.parse(localStorage.getItem('user') || '{}').Email} /><DonorDonationList /></>
      </ProtectedRoute>
    ),
  },

  {
    path: "/donor/blood-banks",
    element: (
      <ProtectedRoute requiredRole={1}>
        <><Navbar title="Donor Dashboard" userInfo={JSON.parse(localStorage.getItem('user') || '{}').FirstName || JSON.parse(localStorage.getItem('user') || '{}').Email} /><BloodBankList showActions={false} /></>
      </ProtectedRoute>
    ),
  },
  {
    path: "/donor/blood-stock",
    element: (
      <ProtectedRoute requiredRole={1}>
        <><Navbar title="Donor Dashboard" userInfo={JSON.parse(localStorage.getItem('user') || '{}').FirstName || JSON.parse(localStorage.getItem('user') || '{}').Email} /><BloodStockList /></>
      </ProtectedRoute>
    ),
  },
  {
    path: "/donor/notifications",
    element: (
      <ProtectedRoute requiredRole={1}>
        <><Navbar title="Donor Dashboard" userInfo={JSON.parse(localStorage.getItem('user') || '{}').FirstName || JSON.parse(localStorage.getItem('user') || '{}').Email} /><NotificationList /></>
      </ProtectedRoute>
    ),
  },
  {
    path: "/recipient",
    element: (
      <ProtectedRoute requiredRole={2}>
        <RecipientDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/recipient/create",
    element: (
      <ProtectedRoute requiredRole={2}>
        <><Navbar title="Recipient Dashboard" userInfo={JSON.parse(localStorage.getItem('user') || '{}').firstName || JSON.parse(localStorage.getItem('user') || '{}').email} /><CreateBloodRequest /></>
      </ProtectedRoute>
    ),
  },
  {
    path: "/recipient/requests",
    element: (
      <ProtectedRoute requiredRole={2}>
        <><Navbar title="Recipient Dashboard" userInfo={JSON.parse(localStorage.getItem('user') || '{}').firstName || JSON.parse(localStorage.getItem('user') || '{}').email} /><RecipientBloodRequestList /></>
      </ProtectedRoute>
    ),
  },
  {
    path: "/recipient/notifications",
    element: (
      <ProtectedRoute requiredRole={2}>
        <><Navbar title="Recipient Dashboard" userInfo={JSON.parse(localStorage.getItem('user') || '{}').firstName || JSON.parse(localStorage.getItem('user') || '{}').email} /><NotificationList /></>
      </ProtectedRoute>
    ),
  },
]);