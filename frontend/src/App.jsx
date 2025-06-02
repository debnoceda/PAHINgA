import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import Journal from './pages/Journal';
import Profile from './pages/Profile';
import Landing from './pages/Landing';
import Welcome from './pages/Welcome';
import ProtectedRoute from './components/ProtectedRoute';
import { ACCESS_TOKEN } from './constants';
import './styles/index.css';

// Auth-related components
function Logout() {
  localStorage.clear();
  return <Navigate to="/login" replace />;
}

// Public routes that should redirect to home if user is authenticated
function PublicRoute({ children }) {
  const isAuthenticated = localStorage.getItem(ACCESS_TOKEN) !== null;
  return isAuthenticated ? <Navigate to="/" replace /> : children;
}

function App() {
  return (
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
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/journal" element={
          <ProtectedRoute>
            <Journal />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />

        {/* Public Routes */}
        <Route path="/" element={
          <PublicRoute>
            <Landing />
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
  );
}

export default App;
