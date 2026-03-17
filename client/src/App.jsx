import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Dashboard from './pages/Dashboard';
import BudgetGamePage from './pages/BudgetGamePage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import LearningDashboard from '../features/learning/components/LearningDashboard';
import LessonsPage from '../features/learning/components/LessonsPage';
import PersonalizedFinance from './pages/PersonalizedFinance';
import BooksPage from './pages/BooksPage';
import AdminBooks from './pages/AdminBooks';
import AdminLearning from './pages/AdminLearning';
import AdminLessons from './pages/AdminLessons';
import AdminLessonEditor from './pages/AdminLessonEditor';
import GovFinancePage from './pages/GovFinancePage';
import AdminGovFinance from './pages/AdminGovFinance';
import ModuleDetail from './pages/ModuleDetail';
import LessonViewer from './pages/LessonViewer';
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
              <Route path="/learning/modules/:moduleId" element={user ? <ModuleDetail user={user} /> : <Navigate to="/login" />} />
              <Route path="/lessons/:lessonId" element={user ? <LessonViewer user={user} /> : <Navigate to="/login" />} />
              <Route path="/books" element={user ? <BooksPage user={user} /> : <Navigate to="/login" />} />
              <Route path="/admin/books" element={user?.role === 'admin' ? <AdminBooks user={user} /> : <Navigate to="/login" />} />
              <Route path="/admin/learning" element={user?.role === 'admin' ? <AdminLearning user={user} /> : <Navigate to="/login" />} />
              <Route path="/admin/gov" element={user?.role === 'admin' ? <AdminGovFinance user={user} /> : <Navigate to="/login" />} />
              <Route path="/admin/modules/:moduleId" element={user?.role === 'admin' ? <AdminLessons user={user} /> : <Navigate to="/login" />} />
              <Route path="/admin/lesson-editor/:lessonId" element={user?.role === 'admin' ? <AdminLessonEditor user={user} /> : <Navigate to="/login" />} />
              <Route path="/gov-finance" element={user ? <GovFinancePage user={user} /> : <Navigate to="/login" />} />
              <Route path="/personalized-finance" element={user ? <PersonalizedFinance user={user} /> : <Navigate to="/login" />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
