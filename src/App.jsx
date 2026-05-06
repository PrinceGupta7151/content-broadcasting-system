import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ToastContainer } from './components/common/Toast';
import { Loading } from './components/common/Loading';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './hooks/useAuth';

// Pages
import { Login } from './pages/auth/Login';
import { TeacherDashboard } from './pages/teacher/Dashboard';
import { Upload } from './pages/teacher/Upload';
import { MyContent } from './pages/teacher/MyContent';
import { PrincipalDashboard } from './pages/principal/Dashboard';
import { PendingApprovals } from './pages/principal/PendingApprovals';
import { AllContent } from './pages/principal/AllContent';
import { Live } from './pages/public/Live';

function AppContent() {
  const { loading } = useAuth();

  if (loading) {
    return <Loading message="Loading application..." />;
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/live/:teacherId" element={<Live />} />

      {/* Teacher Routes */}
      <Route
        path="/teacher/dashboard"
        element={
          <ProtectedRoute requiredRole="teacher">
            <TeacherDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/upload"
        element={
          <ProtectedRoute requiredRole="teacher">
            <Upload />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/content"
        element={
          <ProtectedRoute requiredRole="teacher">
            <MyContent />
          </ProtectedRoute>
        }
      />

      {/* Principal Routes */}
      <Route
        path="/principal/dashboard"
        element={
          <ProtectedRoute requiredRole="principal">
            <PrincipalDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/principal/pending"
        element={
          <ProtectedRoute requiredRole="principal">
            <PendingApprovals />
          </ProtectedRoute>
        }
      />
      <Route
        path="/principal/content"
        element={
          <ProtectedRoute requiredRole="principal">
            <AllContent />
          </ProtectedRoute>
        }
      />

      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <Suspense fallback={<Loading />}>
            <AppContent />
          </Suspense>
          <ToastContainer />
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;