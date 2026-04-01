import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  HiOutlineChartPie,
  HiOutlineCreditCard,
  HiOutlineUsers,
  HiOutlineLogout,
} from 'react-icons/hi';

function Sidebar() {
  const { user, logout, hasRole } = useAuth();

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">F</div>
        <span className="sidebar-brand-text">FinMetrics</span>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Main</div>

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? 'active' : ''}`
          }
        >
          <HiOutlineChartPie className="sidebar-link-icon" />
          Dashboard
        </NavLink>

        <NavLink
          to="/transactions"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? 'active' : ''}`
          }
        >
          <HiOutlineCreditCard className="sidebar-link-icon" />
          Transactions
        </NavLink>

        {hasRole('ADMIN') && (
          <>
            <div className="sidebar-section-label">Administration</div>
            <NavLink
              to="/users"
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <HiOutlineUsers className="sidebar-link-icon" />
              User Management
            </NavLink>
          </>
        )}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">
            {user ? getInitials(user.name) : '?'}
          </div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.name}</div>
            <div className="sidebar-user-role">{user?.role}</div>
          </div>
          <button
            onClick={logout}
            title="Sign out"
            style={{ color: 'var(--text-muted)', fontSize: 18, padding: 4 }}
          >
            <HiOutlineLogout />
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
