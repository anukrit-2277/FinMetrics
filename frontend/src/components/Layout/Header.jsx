import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  HiOutlineUser,
  HiOutlineKey,
  HiOutlineLogout,
  HiOutlineChevronDown,
  HiOutlineMenu,
  HiOutlineBookOpen,
} from 'react-icons/hi';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/transactions': 'Transactions',
  '/insights': 'Financial Insights',
  '/users': 'User Management',
  '/profile': 'My Profile',
  '/change-password': 'Change Password',
};

function Header({ onMenuToggle }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const title = pageTitles[location.pathname] || 'FinMetrics';

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Hamburger — visible only on mobile */}
        <button
          className="hamburger-btn"
          onClick={onMenuToggle}
          aria-label="Toggle menu"
        >
          <HiOutlineMenu />
        </button>
        <h1 className="header-title">{title}</h1>
      </div>

      {/* User menu on the right */}
      <div className="header-actions" ref={menuRef} style={{ position: 'relative' }}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '6px 12px',
            borderRadius: 8,
            border: '1px solid #2a2a2a',
            backgroundColor: menuOpen ? 'rgba(255,255,255,0.05)' : 'transparent',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
        >
          <div style={{
            width: 30,
            height: 30,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #dc2626, #991b1b)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 11,
            fontWeight: 700,
            color: 'white',
            flexShrink: 0,
          }}>
            {user ? getInitials(user.name) : '?'}
          </div>
          <div className="header-user-info" style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#ffffff', lineHeight: 1.2 }}>{user?.name}</div>
            <div style={{ fontSize: 11, color: '#737373' }}>{user?.role}</div>
          </div>
          <HiOutlineChevronDown style={{
            fontSize: 14,
            color: '#737373',
            transform: menuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s',
          }} />
        </button>

        {/* Dropdown */}
        {menuOpen && (
          <div style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: 8,
            width: 200,
            backgroundColor: '#1a1a1a',
            border: '1px solid #2a2a2a',
            borderRadius: 10,
            overflow: 'hidden',
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            animation: 'fadeIn 0.15s ease',
            zIndex: 200,
          }}>
            <button
              onClick={() => { setMenuOpen(false); navigate('/profile'); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                width: '100%', padding: '11px 16px',
                fontSize: 13, fontWeight: 500, color: '#a3a3a3',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#ffffff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#a3a3a3'; }}
            >
              <HiOutlineUser style={{ fontSize: 16 }} />
              My Profile
            </button>

            <button
              onClick={() => { setMenuOpen(false); navigate('/change-password'); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                width: '100%', padding: '11px 16px',
                fontSize: 13, fontWeight: 500, color: '#a3a3a3',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#ffffff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#a3a3a3'; }}
            >
              <HiOutlineKey style={{ fontSize: 16 }} />
              Change Password
            </button>

            <div style={{ height: 1, backgroundColor: '#2a2a2a' }} />

            <button
              onClick={handleLogout}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                width: '100%', padding: '11px 16px',
                fontSize: 13, fontWeight: 500, color: '#dc2626',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(220,38,38,0.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <HiOutlineLogout style={{ fontSize: 16 }} />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
