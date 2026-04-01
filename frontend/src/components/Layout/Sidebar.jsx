import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  HiOutlineChartPie,
  HiOutlineCreditCard,
  HiOutlineUsers,
} from 'react-icons/hi';

function Sidebar() {
  const { hasRole } = useAuth();

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

        {hasRole('ANALYST', 'ADMIN') && (
          <NavLink
            to="/transactions"
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <HiOutlineCreditCard className="sidebar-link-icon" />
            Transactions
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
