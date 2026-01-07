import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { CurrencyProvider } from './context/CurrencyContext';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Services from './pages/Services';
import ServiceDetails from './pages/ServiceDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import ProviderDetails from './pages/ProviderDetails';
import NotFound from './pages/NotFound';
import BackendTest from './pages/BackendTest';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminProviders from './pages/admin/Providers';
import AdminServices from './pages/admin/Services';
import AdminCategories from './pages/admin/Categories';
import AdminRequests from './pages/admin/Requests';
import AdminPayments from './pages/admin/Payments';
import AdminReports from './pages/admin/Reports';
import AdminNotifications from './pages/admin/Notifications';
import AdminLayout from './layouts/AdminLayout';

// Provider Pages
import ProviderDashboard from './pages/provider/Dashboard';
import ProviderServices from './pages/provider/MyServices';
import AddService from './pages/provider/AddService';
import EditService from './pages/provider/EditService';
import ProviderCertificates from './pages/provider/Certificates';
import ProviderRequests from './pages/provider/ServiceRequests';
import ProviderReviews from './pages/provider/Reviews';
import ProviderProfile from './pages/provider/Profile';
import ProviderNotifications from './pages/provider/Notifications';
import ProviderSubmitReport from './pages/provider/SubmitReport';
import ProviderMyReports from './pages/provider/MyReports';
import ProviderLayout from './layouts/ProviderLayout';

// Customer Pages
import CustomerDashboard from './pages/customer/Dashboard';
import CustomerRequests from './pages/customer/MyRequests';
import CustomerProfile from './pages/customer/Profile';
import CustomerNotifications from './pages/customer/Notifications';
import CustomerSubmitReport from './pages/customer/SubmitReport';
import CustomerMyReports from './pages/customer/MyReports';
import CustomerLayout from './layouts/CustomerLayout';

const AdminLayoutWrapper = () => (
  <AdminLayout>
    <Outlet />
  </AdminLayout>
);

const ProviderLayoutWrapper = () => (
  <ProviderLayout>
    <Outlet />
  </ProviderLayout>
);

const CustomerLayoutWrapper = () => (
  <CustomerLayout>
    <Outlet />
  </CustomerLayout>
);

function AppRoutes() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0BA5EC]"></div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:id" element={<ServiceDetails />} />
        <Route path="/provider-details/:id" element={<ProviderDetails />} />
        <Route path="/backend-test" element={<BackendTest />} />

        <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/" replace /> : <Register />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayoutWrapper />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="providers" element={<AdminProviders />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="requests" element={<AdminRequests />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="notifications" element={<AdminNotifications />} />
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Route>

        {/* Provider Routes */}
        <Route
          path="/provider"
          element={
            <ProtectedRoute requiredRole="provider">
              <ProviderLayoutWrapper />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/provider/dashboard" replace />} />
          <Route path="dashboard" element={<ProviderDashboard />} />
          <Route path="services" element={<ProviderServices />} />
          <Route path="services/add" element={<AddService />} />
          <Route path="services/edit/:id" element={<EditService />} />
          <Route path="certificates" element={<ProviderCertificates />} />
          <Route path="requests" element={<ProviderRequests />} />
          <Route path="reviews" element={<ProviderReviews />} />
          <Route path="profile" element={<ProviderProfile />} />
          <Route path="notifications" element={<ProviderNotifications />} />
          <Route path="submit-report" element={<ProviderSubmitReport />} />
          <Route path="my-reports" element={<ProviderMyReports />} />
          <Route path="*" element={<Navigate to="/provider/dashboard" replace />} />
        </Route>

        {/* Customer Routes */}
        <Route
          path="/customer"
          element={
            <ProtectedRoute requiredRole="customer">
              <CustomerLayoutWrapper />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/customer/dashboard" replace />} />
          <Route path="dashboard" element={<CustomerDashboard />} />
          <Route path="requests" element={<CustomerRequests />} />
          <Route path="profile" element={<CustomerProfile />} />
          <Route path="notifications" element={<CustomerNotifications />} />
          <Route path="submit-report" element={<CustomerSubmitReport />} />
          <Route path="my-reports" element={<CustomerMyReports />} />
          <Route path="*" element={<Navigate to="/customer/dashboard" replace />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <CurrencyProvider>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </CurrencyProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
