import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import PartnerDashboard from './pages/partner/PartnerDashboard';
import CourierDashboard from './pages/courier/CourierDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<CustomerDashboard />} />
        <Route path="/partner" element={<PartnerDashboard />} />
        <Route path="/courier" element={<CourierDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
