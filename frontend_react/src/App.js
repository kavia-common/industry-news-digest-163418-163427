import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import './App.css';
import './index.css';
import useAuthStore from './store/authStore';
import Dashboard from './pages/Dashboard';
import Preferences from './pages/Preferences';
import Archive from './pages/Archive';
import EmailSubscription from './pages/EmailSubscription';
import Login from './pages/Login';
import Register from './pages/Register';
import ArticleDetail from './pages/ArticleDetail';

// PUBLIC_INTERFACE
function RequireAuth({ children }) {
  /** Ensures user is authenticated, otherwise redirects to /login. */
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();
  return isAuthenticated ? children : <Navigate to="/login" replace state={{ from: location }} />;
}

// PUBLIC_INTERFACE
function Layout({ children }) {
  /** Main application layout with left navigation and top bar. */
  const { isAuthenticated, user, logout } = useAuthStore();
  const location = useLocation();
  const navItems = [
    { path: '/', label: 'Daily Digest' },
    { path: '/archive', label: 'Archive' },
    { path: '/preferences', label: 'Preferences' },
    { path: '/email-subscription', label: 'Email Subscription' }
  ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-dot" />
          Industry News Digest
        </div>
        <div className="nav-section">
          <div className="nav-title">Navigate</div>
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={
                'nav-item ' + (location.pathname === item.path ? 'active' : '')
              }
            >
              <span>•</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
        <div className="nav-section">
          <div className="nav-title">Categories</div>
          {['All', 'Risk', 'Compliance', 'Quality', 'M&A', 'Independence', 'New Launches'].map(c => (
            <span key={c} className="nav-item" role="button">
              <span>#</span>
              <span>{c}</span>
            </span>
          ))}
        </div>
      </aside>
      <div className="content">
        <div className="topbar">
          <div className="search">
            <span role="img" aria-label="search">🔎</span>
            <input placeholder="Search headlines, sources, tags..." />
          </div>
          <div className="user-actions">
            {isAuthenticated ? (
              <>
                <span className="card" style={{ padding: '8px 12px' }}>
                  {user?.email || 'User'}
                </span>
                <button className="btn" onClick={logout}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn">Login</Link>
                <Link to="/register" className="btn btn-primary">Register</Link>
              </>
            )}
          </div>
        </div>
        <main className="page container">
          {children}
        </main>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  /** App entry: sets up routes and authentication guards. */
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            </Layout>
          }
        />
        <Route
          path="/article/:id"
          element={
            <Layout>
              <RequireAuth>
                <ArticleDetail />
              </RequireAuth>
            </Layout>
          }
        />
        <Route
          path="/preferences"
          element={
            <Layout>
              <RequireAuth>
                <Preferences />
              </RequireAuth>
            </Layout>
          }
        />
        <Route
          path="/archive"
          element={
            <Layout>
              <RequireAuth>
                <Archive />
              </RequireAuth>
            </Layout>
          }
        />
        <Route
          path="/email-subscription"
          element={
            <Layout>
              <RequireAuth>
                <EmailSubscription />
              </RequireAuth>
            </Layout>
          }
        />
        <Route
          path="/login"
          element={
            <Layout>
              <Login />
            </Layout>
          }
        />
        <Route
          path="/register"
          element={
            <Layout>
              <Register />
            </Layout>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
