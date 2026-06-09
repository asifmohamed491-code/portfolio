import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Portfolio from './pages/Portfolio';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import { AuthProvider, useAuth } from './context/AuthContext';

// ─── Protected Route ──────────────────────────────────────────────────────────
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="w-12 h-12 spinner" />
      </div>
    );
  }
  return user ? children : <Navigate to="/admin/login" replace />;
};

// ─── App ──────────────────────────────────────────────────────────────────────
function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#0f1629',
            color: '#e2e8f0',
            border: '1px solid rgba(0, 245, 255, 0.2)',
            fontFamily: "'DM Sans', sans-serif",
            borderRadius: '12px',
          },
          success: { iconTheme: { primary: '#00f5ff', secondary: '#050811' } },
          error:   { iconTheme: { primary: '#f472b6', secondary: '#050811' } },
        }}
      />

      <Router>
        <Routes>
          <Route path="/"            element={<Portfolio />} />
          <Route path="/admin/login" element={<LoginPage />} />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
