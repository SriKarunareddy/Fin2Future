import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import BudgetGamePage from './pages/BudgetGamePage';
import authApi from './api/auth.api';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // try to restore session
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authApi.me(token)
        .then((data) => {
          setUser({ ...data, token });
        })
        .catch(() => {
          localStorage.removeItem('token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleAuth = (token) => {
    localStorage.setItem('token', token);
    authApi.me(token).then((data) => setUser({ ...data, token }));
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  if (loading) {
    return <div className="text-center mt-20">Loading…</div>;
  }

  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={
              user ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleAuth} />
            }
          />
          <Route
            path="/signup"
            element={
              user ? <Navigate to="/dashboard" replace /> : <Signup onSignup={handleAuth} />
            }
          />
          <Route
            path="/dashboard"
            element={
              user ? <Dashboard user={user} onLogout={logout} /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/budget-game/*"
            element={
              user ? <BudgetGamePage userId={user._id} /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/"
            element={<Navigate to={user ? '/dashboard' : '/login'} replace />}
          />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
