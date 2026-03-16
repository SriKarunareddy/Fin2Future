import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Dashboard from './pages/Dashboard';
import BudgetGamePage from './pages/BudgetGamePage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import LearningDashboard from '../features/learning/components/LearningDashboard';
import LessonsPage from '../features/learning/components/LessonsPage';
import ErrorBoundary from './ErrorBoundary';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white antialiased">
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/signup" element={<Signup onLogin={handleLogin} />} />
            <Route path="/" element={user ? <Dashboard user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} />
            <Route path="/budget-game" element={user ? <BudgetGamePage /> : <Navigate to="/login" />} />
            <Route path="/learning" element={user ? <LearningDashboard /> : <Navigate to="/login" />} />
            <Route path="/lessons" element={user ? <LessonsPage /> : <Navigate to="/login" />} />
          </Routes>
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
