import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function LearningDashboard() {
  const [progress, setProgress] = useState({
    overall: 0,
    completed: 0,
    inProgress: 0,
    available: 0
  });

  useEffect(() => {
    // TODO: Fetch progress from API
    // For now, using mock data
    setProgress({
      overall: 0,
      completed: 0,
      inProgress: 0,
      available: 0
    });
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link to="/" className="inline-flex items-center text-emerald-500 hover:text-emerald-400 font-semibold mb-6 transition-colors bg-emerald-900/40 px-4 py-2 rounded-lg border border-emerald-500/30">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Dashboard
        </Link>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-600 mb-2">
              Learning Dashboard
            </h1>
            <p className="text-emerald-200/80">Track your financial education progress</p>
          </div>
          <Link
            to="/lessons"
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Lessons
          </Link>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700 mb-8">
        <h2 className="text-2xl font-bold mb-6">Overall Progress</h2>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-medium">{progress.overall}% complete</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-4 rounded-full transition-all duration-500"
              style={{ width: `${progress.overall}%` }}
            ></div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-700/50 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-emerald-400 mb-2">{progress.completed}</div>
            <div className="text-emerald-200/80">Completed</div>
          </div>
          <div className="bg-slate-700/50 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">{progress.inProgress}</div>
            <div className="text-blue-200/80">In Progress</div>
          </div>
          <div className="bg-slate-700/50 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">{progress.available}</div>
            <div className="text-purple-200/80">Available</div>
          </div>
        </div>

        {/* View All Lessons Button */}
        <div className="mt-8 text-center">
          <Link
            to="/lessons"
            className="inline-block bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            View All Lessons
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/lessons"
          className="group bg-gradient-to-br from-blue-900 to-blue-950 rounded-2xl p-6 border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 hover:-translate-y-1"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-500/20 rounded-xl group-hover:scale-110 transition-transform">
              <span className="text-2xl">📚</span>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1">Browse Lessons</h3>
              <p className="text-blue-200/80">Explore all available financial lessons</p>
            </div>
          </div>
        </Link>

        <div className="bg-gradient-to-br from-purple-900 to-purple-950 rounded-2xl p-6 border border-purple-500/30">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-purple-500/20 rounded-xl">
              <span className="text-2xl">🎯</span>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-1">Continue Learning</h3>
              <p className="text-purple-200/80">Pick up where you left off</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}