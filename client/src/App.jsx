import { useState, useEffect } from 'react';
import Quiz from '../features/budget-game/components/Quiz';
import GameHub from '../features/budget-game/components/GameHub';
import ErrorBoundary from './ErrorBoundary';

// global error state collector
function App() {
  const [view, setView] = useState('quiz'); // 'quiz' or 'games'
  const [userLevel, setUserLevel] = useState('Basic');
  const [userId] = useState('demo-user-123');
  const [jsError, setJsError] = useState(null);

  useEffect(() => {
    window.onerror = (message, source, lineno, colno, error) => {
      setJsError(message || (error && error.message));
    };
    window.onunhandledrejection = (evt) => {
      setJsError(evt.reason ? evt.reason.message || evt.reason : String(evt));
    };
  }, []);

  const handleQuizComplete = (level) => {
    setUserLevel(level);
    // Auto-navigate to games after quiz
    setTimeout(() => {
      setView('games');
    }, 2000);
  };

  // Listen for navigation
  useEffect(() => {
    const handleNavigation = () => {
      const path = window.location.pathname;
      if (path === '/games') {
        setView('games');
      } else {
        setView('quiz');
      }
    };

    window.addEventListener('popstate', handleNavigation);
    handleNavigation();

    return () => window.removeEventListener('popstate', handleNavigation);
  }, []);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-amber-200 antialiased">
        <div className="max-w-6xl mx-auto px-4 py-6">
          {view === 'quiz' ? (
            <Quiz userId={userId} onComplete={handleQuizComplete} />
          ) : (
            <GameHub userLevel={userLevel} userId={userId} />
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;
