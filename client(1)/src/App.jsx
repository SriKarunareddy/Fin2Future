import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import Login from './features/auth/login';
import Signup from './pages/Signup';
import LearningDashboard from './pages/LearningDashboard';
import LessonList from './pages/LessonList';
import LessonPlayer from './features/learning/Lessons';
import authService from './services/authService';

const PrivateRoute = ({ children }) => {
  return authService.isAuthenticated() ? children : <Navigate to="/login" />;
};

const App = () => {
  const handleLogout = () => {
    authService.logout();
    window.location.href = '/login';
  };

  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
        {authService.isAuthenticated() && (
          <nav style={{ 
            backgroundColor: 'white', 
            padding: '15px 30px', 
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', gap: '20px' }}>
              <Link to="/dashboard" style={{ textDecoration: 'none', color: '#2196F3' }}>
                Dashboard
              </Link>
              <Link to="/lessons" style={{ textDecoration: 'none', color: '#2196F3' }}>
                Lessons
              </Link>
            </div>
            <button onClick={handleLogout} style={{ cursor: 'pointer' }}>
              Logout
            </button>
          </nav>
        )}

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <LearningDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/lessons"
            element={
              <PrivateRoute>
                <LessonList />
              </PrivateRoute>
            }
          />
          <Route
            path="/lessons/:id"
            element={
              <PrivateRoute>
                <LessonPlayer />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
