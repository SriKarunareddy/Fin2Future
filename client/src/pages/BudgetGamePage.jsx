import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Quiz from '../../features/budget-game/components/Quiz';
import GameHub from '../../features/budget-game/components/GameHub';

// This page hosts the budget game quiz + games; it expects a userId prop.
export default function BudgetGamePage({ userId }) {
  const [view, setView] = useState('quiz'); // 'quiz' or 'games'
  const [userLevel, setUserLevel] = useState('Basic');
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
    setTimeout(() => setView('games'), 2000);
  };

  // navigation based on URL
  useEffect(() => {
    const handleNavigation = () => {
      const path = window.location.pathname;
      if (path === '/budget-game/games') {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-amber-200 antialiased">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {view === 'quiz' ? (
          <Quiz userId={userId} onComplete={handleQuizComplete} />
        ) : (
          <GameHub userLevel={userLevel} userId={userId} />
        )}
        {jsError && (
          <div className="mt-4 p-2 bg-red-700 text-white">
            JS Error: {jsError}
          </div>
        )}
      </div>
    </div>
  );
}
