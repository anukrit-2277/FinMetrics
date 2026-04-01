import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineShieldCheck } from 'react-icons/hi';

const DEMO_ACCOUNTS = [
  { role: 'Admin', email: 'admin@finmetrics.com', password: 'Admin@2025!', color: '#dc2626', desc: 'Full access' },
  { role: 'Analyst', email: 'analyst@finmetrics.com', password: 'Analyst@2025!', color: '#10b981', desc: 'Read + analytics' },
  { role: 'Viewer', email: 'viewer@finmetrics.com', password: 'Viewer@2025!', color: '#3b82f6', desc: 'Read only' },
];

function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeRole, setActiveRole] = useState(null);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleRoleSelect = (account) => {
    setEmail(account.email);
    setPassword(account.password);
    setActiveRole(account.role);
    setError('');
  };

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
    <div className="login-page" style={{ flexDirection: 'column' }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="login-card">
          {/* Brand */}
          <div className="login-brand">
            <div className="login-brand-icon">F</div>
            <h1>FinMetrics</h1>
            <p>Your premium finance dashboard</p>
          </div>

          {/* Role Toggle Buttons */}
          <div style={{ marginBottom: 28 }}>
            <p style={{ fontSize: 11, color: '#737373', marginBottom: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
              Select Role to Login
            </p>
            <p style={{ fontSize: 11, color: '#737373', marginBottom: 12 }}>
              Prototype Mode — credentials auto-fill on selecting a role
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              {DEMO_ACCOUNTS.map((account) => (
                <button
                  key={account.role}
                  type="button"
                  onClick={() => handleRoleSelect(account)}
                  style={{
                    flex: 1,
                    padding: '12px 10px',
                    borderRadius: '10px',
                    border: activeRole === account.role
                      ? `2px solid ${account.color}`
                      : '1px solid #2a2a2a',
                    backgroundColor: activeRole === account.role
                      ? `${account.color}15`
                      : '#0f0f0f',
                    color: activeRole === account.role ? '#ffffff' : '#a3a3a3',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ color: activeRole === account.role ? account.color : '#a3a3a3', marginBottom: 2 }}>
                    {account.role}
                  </div>
                  <div style={{ fontSize: 10, color: '#737373', fontWeight: 400 }}>
                    {account.desc}
                  </div>
                </button>
              ))}
            </div>
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
                onChange={(e) => { setEmail(e.target.value); setActiveRole(null); }}
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
                onChange={(e) => { setPassword(e.target.value); setActiveRole(null); }}
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

          {/* Security badge */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: 6, 
            marginTop: 24, 
            color: '#737373', 
            fontSize: 12 
          }}>
            <HiOutlineShieldCheck style={{ fontSize: 16, color: '#dc2626' }} />
            <span>Secured with bcrypt encryption & session-based auth</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        padding: '20px 32px',
        borderTop: '1px solid #2a2a2a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
        position: 'relative',
        zIndex: 1,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 24,
            height: 24,
            background: 'linear-gradient(135deg, #dc2626, #991b1b)',
            borderRadius: 6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 11,
            fontWeight: 800,
            color: 'white',
          }}>F</div>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#a3a3a3' }}>
            FinMetrics
          </span>
          <span style={{ fontSize: 12, color: '#737373' }}>
            — Finance Dashboard System
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <span style={{ fontSize: 12, color: '#737373' }}>
            React • Express • PostgreSQL • Prisma
          </span>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <Link to="/docs" target="_blank" style={{ fontSize: 12, color: '#dc2626', fontWeight: 600 }}>📄 API Docs</Link>
            <span style={{ fontSize: 12, color: '#737373' }}>
              © {new Date().getFullYear()}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LoginPage;
