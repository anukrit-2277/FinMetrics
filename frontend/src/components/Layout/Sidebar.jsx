import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  HiOutlineChartPie,
  HiOutlineCreditCard,
  HiOutlineUsers,
  HiOutlineLightBulb,
  HiX,
} from 'react-icons/hi';

function Sidebar({ isOpen, onClose }) {
  const { hasRole } = useAuth();

  const handleLinkClick = () => {
    // Close sidebar on mobile after navigation
    if (window.innerWidth <= 768) {
      onClose?.();
    }
  };

  return (
    <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">F</div>
        <span className="sidebar-brand-text">FinMetrics</span>
        {/* Close button — visible only on mobile */}
        <button
          className="sidebar-close-btn"
          onClick={onClose}
          style={{
            marginLeft: 'auto',
            display: 'none',
            fontSize: 20,
            color: '#737373',
            padding: 4,
          }}
        >
          <HiX />
        </button>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Main</div>

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `sidebar-link ${isActive ? 'active' : ''}`
          }
          onClick={handleLinkClick}
        >
          <HiOutlineChartPie className="sidebar-link-icon" />
          Dashboard
        </NavLink>

        {hasRole('ANALYST', 'ADMIN') && (
          <NavLink
            to="/transactions"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
            onClick={handleLinkClick}
          >
            <HiOutlineCreditCard className="sidebar-link-icon" />
            Transactions
          </NavLink>
        )}

        {hasRole('ANALYST', 'ADMIN') && (
          <NavLink
            to="/insights"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
            onClick={handleLinkClick}
          >
            <HiOutlineLightBulb className="sidebar-link-icon" />
            Insights
          </NavLink>
        )}

        {hasRole('ADMIN') && (
          <>
            <div className="sidebar-section-label">Administration</div>
            <NavLink
              to="/users"
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
              onClick={handleLinkClick}
            >
              <HiOutlineUsers className="sidebar-link-icon" />
              User Management
            </NavLink>
          </>
        )}
      </nav>
    </aside>
  );
}

export default Sidebar;
