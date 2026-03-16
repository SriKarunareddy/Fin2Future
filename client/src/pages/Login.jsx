import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authApi from '../api/auth.api';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const data = await authApi.login(email, password);
      const token = data.data.token;
      const userData = await authApi.me(token);
      onLogin({ ...userData.data, token });
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-slate-800 rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Log In</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 rounded bg-slate-700"
          />
        </div>
        <div>
          <label className="block mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 rounded bg-slate-700"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-amber-500 text-slate-900 rounded hover:bg-amber-600"
        >
          Sign In
        </button>
      </form>
      <p className="mt-4 text-center text-sm">
        Don't have an account?{' '}
        <Link to="/signup" className="text-amber-400 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
