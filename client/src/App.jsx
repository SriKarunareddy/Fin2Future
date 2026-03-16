import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Dashboard from './pages/Dashboard';
import BudgetGamePage from './pages/BudgetGamePage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import LearningDashboard from '../features/learning/components/LearningDashboard';
import LessonsPage from '../features/learning/components/LessonsPage';
import ErrorBoundary from './ErrorBoundary';
import Header from './components/Header';
import Footer from './components/Footer';

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
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white antialiased">
          <Header user={user} onLogout={handleLogout} />
          <main className="flex-grow flex flex-col">
            <Routes>
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
              <Route path="/signup" element={<Signup onLogin={handleLogin} />} />
              <Route path="/" element={<Dashboard user={user} onLogout={handleLogout} />} />
              <Route path="/budget-game" element={user ? <BudgetGamePage userId={user?._id} /> : <Navigate to="/login" />} />
              <Route path="/learning" element={user ? <LearningDashboard userId={user?._id} /> : <Navigate to="/login" />} />
              <Route path="/lessons" element={user ? <LessonsPage /> : <Navigate to="/login" />} />
              <Route path="/books" element={user ? <div className="p-10 text-center">Books Feature Coming Soon</div> : <Navigate to="/login" />} />
              <Route path="/gov-finance" element={user ? <div className="p-10 text-center">Gov Finance Feature Coming Soon</div> : <Navigate to="/login" />} />
              <Route path="/personalized-finance" element={user ? <div className="p-10 text-center">Personalized Finance Feature Coming Soon</div> : <Navigate to="/login" />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
