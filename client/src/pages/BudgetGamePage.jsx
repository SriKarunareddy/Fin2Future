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
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-indigo-400 hover:text-indigo-300 font-semibold transition-colors bg-indigo-900/40 px-4 py-2 rounded-lg border border-indigo-500/30">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Dashboard
          </Link>
        </div>
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
