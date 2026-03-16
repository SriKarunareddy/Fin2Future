import { Link } from 'react-router-dom';

export default function Dashboard({ user, onLogout }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-amber-200 antialiased">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Welcome, {user.email}</h1>
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
          >
            Log out
          </button>
        </header>

        <nav className="space-x-4 mb-8">
          <Link
            to="/budget-game"
            className="px-3 py-2 bg-amber-600 rounded hover:bg-amber-700"
          >
            Budget Game
          </Link>
          <Link
            to="#"
            className="px-3 py-2 bg-amber-600 rounded hover:bg-amber-700"
          >
            Learning Modules
          </Link>
          <Link
            to="#"
            className="px-3 py-2 bg-amber-600 rounded hover:bg-amber-700"
          >
            Analytics
          </Link>
        </nav>

        <p className="text-gray-400">
          Choose a module above to get started.
        </p>
      </div>
    </div>
  );
}
