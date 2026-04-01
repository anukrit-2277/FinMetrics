import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/transactions': 'Transactions',
  '/users': 'User Management',
};

function Header() {
  const location = useLocation();
  const { user } = useAuth();
  const title = pageTitles[location.pathname] || 'FinMetrics';

  return (
    <header className="header">
      <h1 className="header-title">{title}</h1>
      <div className="header-actions">
        <span className="badge badge-role">{user?.role}</span>
      </div>
    </header>
  );
}

export default Header;
