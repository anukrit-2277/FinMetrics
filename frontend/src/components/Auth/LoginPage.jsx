import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HiOutlineMail, HiOutlineLockClosed } from 'react-icons/hi';

function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <div className="login-brand-icon">F</div>
          <h1>FinMetrics</h1>
          <p>Sign in to your finance dashboard</p>
        </div>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              <HiOutlineMail style={{ marginRight: 6, verticalAlign: 'middle' }} />
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="admin@finmetrics.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              <HiOutlineLockClosed style={{ marginRight: 6, verticalAlign: 'middle' }} />
              Password
            </label>
            <input
              id="password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary login-btn"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: 24, padding: '14px 16px', backgroundColor: '#0f0f0f', borderRadius: '8px', border: '1px solid #2a2a2a' }}>
          <p style={{ fontSize: 12, color: '#737373', marginBottom: 8, fontWeight: 600 }}>Demo Accounts</p>
          <div style={{ fontSize: 12, color: '#a3a3a3', lineHeight: 1.8 }}>
            <div><strong style={{ color: '#dc2626' }}>Admin:</strong> admin@finmetrics.com / admin123</div>
            <div><strong style={{ color: '#10b981' }}>Analyst:</strong> analyst@finmetrics.com / analyst123</div>
            <div><strong style={{ color: '#3b82f6' }}>Viewer:</strong> viewer@finmetrics.com / viewer123</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
