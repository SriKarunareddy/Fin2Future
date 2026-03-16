import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import LearningDashboard from './pages/LearningDashboard';
import LessonList from './pages/LessonList';
import LessonPlayer from './pages/LessonPlayer';
import { theme } from './theme';

const Nav = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <nav style={{
      backgroundColor: theme.surface,
      borderBottom: `1px solid ${theme.border}`,
      padding: '0 32px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      height: '60px',
    }}>
      <span style={{ color: theme.textPrimary, fontWeight: '700', fontSize: '18px', marginRight: '24px', letterSpacing: '-0.3px' }}>
        📚 Fin2Future
      </span>
      {[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Lessons', path: '/lessons' }].map(({ label, path }) => (
        <Link key={path} to={path} style={{
          textDecoration: 'none',
          color: isActive(path) ? theme.blue : theme.textSecondary,
          fontWeight: isActive(path) ? '600' : '400',
          fontSize: '14px',
          padding: '6px 14px',
          borderRadius: '8px',
          backgroundColor: isActive(path) ? `${theme.blue}18` : 'transparent',
          transition: 'all 0.15s',
        }}>{label}</Link>
      ))}
    </nav>
  );
};

const App = () => (
  <BrowserRouter>
    <div style={{ minHeight: '100vh', backgroundColor: theme.bg, fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      <Nav />
      <Routes>
        <Route path="/dashboard" element={<LearningDashboard />} />
        <Route path="/lessons" element={<LessonList />} />
        <Route path="/lessons/:id" element={<LessonPlayer />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </div>
  </BrowserRouter>
);

export default App;
