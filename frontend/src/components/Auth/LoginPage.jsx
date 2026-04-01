import { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineShieldCheck } from 'react-icons/hi';

const DEMO_ACCOUNTS = [
  { role: 'Admin', email: 'admin@finmetrics.com', password: 'Admin@2025!', color: '#dc2626', desc: 'Full access' },
  { role: 'Analyst', email: 'analyst@finmetrics.com', password: 'Analyst@2025!', color: '#dc2626', desc: 'Read + analytics' },
  { role: 'Viewer', email: 'viewer@finmetrics.com', password: 'Viewer@2025!', color: '#dc2626', desc: 'Read only' },
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
      {/* Prototype notice */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: 'linear-gradient(135deg, rgba(220,38,38,0.12), rgba(153,27,27,0.08))',
        borderBottom: '1px solid rgba(220,38,38,0.2)',
        padding: '10px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backdropFilter: 'blur(8px)',
      }}>
        <span style={{ fontSize: 14 }}>⚠️</span>
        <span style={{ fontSize: 12, color: '#a3a3a3' }}>
          <strong style={{ color: '#ef4444' }}>Prototype Mode</strong> — Seeded credentials are for demo only. For production, modify <code style={{ fontSize: 11, color: '#ef4444', background: 'rgba(220,38,38,0.1)', padding: '1px 5px', borderRadius: 3 }}>prisma/seed.js</code>
        </span>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 40, paddingBottom: 10 }}>
        <div className="login-card">
          {/* Brand */}
          <div className="login-brand">
            <div className="login-brand-icon">F</div>
            <h1>FinMetrics</h1>
            <p>Your premium finance dashboard</p>
          </div>

          {/* Role Toggle Buttons */}
          <div style={{ marginBottom: 28, textAlign: 'center' }}>
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

          <form onSubmit={handleSubmit} autoComplete="off">
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
                autoComplete="off"
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
                autoComplete="new-password"
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
        padding: '16px 24px',
        borderTop: '1px solid #2a2a2a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '8px 20px',
        flexShrink: 0,
        position: 'relative',
        zIndex: 1,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{
            width: 20,
            height: 20,
            background: 'linear-gradient(135deg, #dc2626, #991b1b)',
            borderRadius: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 9,
            fontWeight: 800,
            color: 'white',
          }}>F</div>
          <span style={{ fontSize: 12, fontWeight: 600, color: '#a3a3a3' }}>
            FinMetrics
          </span>
          <span style={{ fontSize: 11, color: '#525252' }}>—</span>
          <span style={{ fontSize: 11, color: '#525252' }}>
            Finance Dashboard System
          </span>
        </div>
        <span style={{ fontSize: 11, color: '#525252' }}>
          React • Express • PostgreSQL • Prisma
        </span>
        <Link to="/docs" target="_blank" style={{ fontSize: 11, color: '#dc2626', fontWeight: 600, textDecoration: 'none' }}>📄 Docs</Link>
        <span style={{ fontSize: 11, color: '#525252' }}>
          © {new Date().getFullYear()}
        </span>
      </footer>
    </div>
  );
}

export default LoginPage;
