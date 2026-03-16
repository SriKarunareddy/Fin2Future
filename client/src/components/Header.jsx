import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Header({ user, onLogout }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="z-50 w-full max-w-6xl mx-auto flex justify-between items-center p-6 relative">
      <Link to="/" className="flex items-center space-x-2 group">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg transform rotate-12 flex items-center justify-center shadow-lg group-hover:rotate-0 transition-transform duration-300">
          <span className="text-xl font-bold -rotate-12 group-hover:rotate-0 transition-transform duration-300">F2F</span>
        </div>
        <h1 className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
          FIN2FUTURE
        </h1>
      </Link>

      <div className="relative">
        <button 
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          className="flex items-center space-x-3 p-1 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 shadow-inner"
        >
          {user ? (
            <div className="h-10 w-10 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-lg font-bold shadow-indigo-500/30 shadow-md">
              {user.email.charAt(0).toUpperCase()}
            </div>
          ) : (
            <div className="h-10 w-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 border border-slate-700">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
            </div>
          )}
        </button>

        {showProfileMenu && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setShowProfileMenu(false)}
            ></div>
            <div className="absolute right-0 mt-3 w-64 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 ring-1 ring-white/10">
              {user ? (
                <div className="space-y-4">
                  <div className="border-b border-white/10 pb-3">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">User Profile</p>
                    <p className="text-white font-semibold truncate">{user.email}</p>
                    {user.name && <p className="text-sm text-slate-400">{user.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs text-slate-500 px-1 font-medium">Role: {user.role || 'User'}</p>
                    <button 
                      onClick={() => {
                        onLogout();
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl text-sm font-bold transition-colors border border-rose-500/20"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="border-b border-white/10 pb-3">
                    <p className="text-white font-bold">Welcome, Guest</p>
                    <p className="text-sm text-slate-400">Sign in to track progress</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Link 
                      to="/login" 
                      onClick={() => setShowProfileMenu(false)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-center rounded-xl text-sm font-bold transition-colors shadow-lg shadow-indigo-600/20"
                    >
                      Login
                    </Link>
                    <Link 
                      to="/signup" 
                      onClick={() => setShowProfileMenu(false)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-center rounded-xl text-sm font-bold border border-white/5 transition-colors"
                    >
                      Signup
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  );
}
