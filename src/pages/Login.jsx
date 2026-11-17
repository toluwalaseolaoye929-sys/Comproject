import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/book');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border border-line rounded-2xl p-8 shadow-sm">
        <h2 className="text-2xl font-display font-bold text-ink mb-6">Welcome back</h2>
        {error && <p className="text-deep text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required
            className="w-full bg-bg border border-line rounded-xl px-4 py-3 text-ink placeholder:text-ink-45 outline-none focus:border-gold"
          />
          <input
            type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required
            className="w-full bg-bg border border-line rounded-xl px-4 py-3 text-ink placeholder:text-ink-45 outline-none focus:border-gold"
          />
          <button className="w-full bg-ink text-white py-3 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-ink/90 transition">
            Sign In
          </button>
        </form>
        <p className="text-sm text-ink-70 mt-4 text-center">
          Don't have an account? <Link to="/register" className="text-gold underline hover:text-ink">Register</Link>
        </p>
      </div>
    </div>
  );
}