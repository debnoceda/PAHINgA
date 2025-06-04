import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import Journal from './pages/Journal';
import Profile from './pages/Profile';
import LandingPage from './pages/LandingPage';
import Welcome from './pages/Welcome';
import ProtectedRoute from './components/ProtectedRoute';
import Entry from './pages/Entry';
import { ACCESS_TOKEN } from './constants';
import './styles/index.css';
import { UserProvider } from './context/UserContext';
import { Toaster } from 'react-hot-toast';
import { useUser } from './context/UserContext';

// Auth-related components
function Logout() {
  localStorage.clear();
  return <Navigate to="/landing" replace />;
}

// Public routes that should redirect to home if user is authenticated
function PublicRoute({ children }) {
  const isAuthenticated = localStorage.getItem(ACCESS_TOKEN) !== null;
  return isAuthenticated ? <Navigate to="/" replace /> : children;
}

// Protected route that checks if user has seen welcome page
function WelcomeCheckRoute({ children }) {
  const { user } = useUser();
  const isAuthenticated = localStorage.getItem(ACCESS_TOKEN) !== null;

  if (!isAuthenticated) {
    return <Navigate to="/landing" replace />;
  }

  if (user && !user.profile?.has_seen_welcome) {
    return <Navigate to="/welcome" replace />;
  }

  return children;
}

function App() {
  return (
    <UserProvider>
      <Toaster position="top-right" reverseOrder={false} />
      <BrowserRouter>
        <Routes>
          {/* Protected Routes */}
          <Route path="/welcome" element={
            <ProtectedRoute>
              <Welcome />
            </ProtectedRoute>
          } />
          <Route path="/" element={
            <ProtectedRoute>
              <WelcomeCheckRoute>
                <Home />
              </WelcomeCheckRoute>
            </ProtectedRoute>
          } />
          <Route path="/journal" element={
            <ProtectedRoute>
              <WelcomeCheckRoute>
                <Journal />
              </WelcomeCheckRoute>
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <WelcomeCheckRoute>
                <Profile />
              </WelcomeCheckRoute>
            </ProtectedRoute>
          } />
          <Route path="/entry/:id" element={
            <ProtectedRoute>
              <WelcomeCheckRoute>
                <Entry />
              </WelcomeCheckRoute>
            </ProtectedRoute>
          } />

          {/* Public Routes */}
          <Route path="/landing" element={
            <PublicRoute>
              <LandingPage />
            </PublicRoute>
          } />
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />
          <Route path="/logout" element={<Logout />} />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
