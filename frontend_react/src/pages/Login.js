import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';

// PUBLIC_INTERFACE
export default function Login() {
  /** User login form with redirect to original path. */
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, bootstrap, loading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => { bootstrap(); }, [bootstrap]);

  useEffect(() => {
    if (isAuthenticated) {
      const dest = location.state?.from?.pathname || '/';
      navigate(dest, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  async function submit(e) {
    e.preventDefault();
    await login(email, password);
  }

  return (
    <div className="card" style={{ padding: 16, maxWidth: 480, margin: '0 auto' }}>
      <h2 style={{ marginTop: 0 }}>Welcome back</h2>
      <form onSubmit={submit}>
        <div style={{ marginBottom: 12 }}>
          <label>Email</label>
          <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Password</label>
          <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <button className="btn btn-primary" type="submit" disabled={loading}>{loading ? 'Signing in…' : 'Sign In'}</button>
      </form>
      <div className="footer-note" style={{ marginTop: 12 }}>
        New to the digest? <Link to="/register">Create an account</Link>
      </div>
    </div>
  );
}
