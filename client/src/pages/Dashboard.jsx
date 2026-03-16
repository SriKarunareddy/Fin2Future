import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Dashboard({ user, onLogout }) {
  const [analytics, setAnalytics] = useState({ gamesPlayed: 0, modulesCompleted: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user analytics from backend
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(`/api/quiz/analytics/${user._id}`);
        const data = await response.json();
        if (data.success) {
          setAnalytics(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch analytics", error);
      } finally {
        setLoading(false);
      }
    };

    if (user && user._id) {
      fetchAnalytics();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-100 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="z-10 w-full max-w-5xl">
        <header className="flex flex-col md:flex-row justify-between items-center mb-12 bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <div className="h-16 w-16 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg shadow-indigo-500/30">
              {user.email.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-300">
                Welcome back,
              </h1>
              <p className="text-slate-400 font-medium">{user.email}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="px-6 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-rose-500/20"
          >
            Log out
          </button>
        </header>

        {/* Navigation */}
        <nav className="flex flex-wrap gap-4 mb-8">
          <Link
            to="/"
            className="px-6 py-3 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
          >
            Dashboard
          </Link>
          <Link
            to="/budget-game"
            className="px-6 py-3 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
          >
            Budget Game
          </Link>
          <Link
            to="/learning"
            className="px-6 py-3 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
          >
            Learning
          </Link>
          <Link
            to="/lessons"
            className="px-6 py-3 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
          >
            Lessons
          </Link>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Analytics Column (Spans 1 col) */}
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl flex flex-col items-start transition-all hover:-translate-y-1 hover:border-indigo-500/50 hover:shadow-indigo-500/20 group">
              <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-xl mb-4 group-hover:bg-indigo-500/30 transition-colors">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <p className="text-slate-400 font-medium mb-1">Games Played</p>
              <h2 className="text-4xl font-black text-white">
                {loading ? <span className="animate-pulse text-slate-600">...</span> : analytics.gamesPlayed}
              </h2>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl flex flex-col items-start transition-all hover:-translate-y-1 hover:border-emerald-500/50 hover:shadow-emerald-500/20 group">
              <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl mb-4 group-hover:bg-emerald-500/30 transition-colors">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 14l9-5-9-5-9 5 9 5z"></path><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"></path></svg>
              </div>
              <p className="text-slate-400 font-medium mb-1">Modules Completed</p>
              <h2 className="text-4xl font-black text-white">
                {loading ? <span className="animate-pulse text-slate-600">...</span> : analytics.modulesCompleted}
              </h2>
            </div>
          </div>

          {/* Action Column (Spans 2 cols) */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Link
              to="/budget-game"
              className="group relative overflow-hidden bg-gradient-to-br from-indigo-900 to-indigo-950 rounded-3xl p-8 border border-indigo-500/30 shadow-2xl transition-all duration-300 hover:shadow-indigo-500/40 hover:-translate-y-2 flex flex-col justify-end min-h-[250px]"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute top-6 right-6 p-4 bg-indigo-500/20 rounded-2xl backdrop-blur-sm group-hover:scale-110 transition-transform">
                <span className="text-3xl">🎮</span>
              </div>
              <div className="z-10">
                <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 mb-2">Budget Game</h3>
                <p className="text-indigo-200/80 font-medium group-hover:text-white transition-colors">Test your financial planning skills in our interactive simulation.</p>
              </div>
            </Link>

            <Link
              to="/learning"
              className="group relative overflow-hidden bg-gradient-to-br from-emerald-900 to-emerald-950 rounded-3xl p-8 border border-emerald-500/30 shadow-2xl transition-all duration-300 hover:shadow-emerald-500/40 hover:-translate-y-2 flex flex-col justify-end min-h-[250px]"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute top-6 right-6 p-4 bg-emerald-500/20 rounded-2xl backdrop-blur-sm group-hover:scale-110 transition-transform">
                <span className="text-3xl">📚</span>
              </div>
              <div className="z-10">
                <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 mb-2">Learning Modules</h3>
                <p className="text-emerald-200/80 font-medium group-hover:text-white transition-colors">Expand your knowledge with interactive financial courses.</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
