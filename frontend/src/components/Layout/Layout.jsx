import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

function Layout() {
  return (
    <div className="app-layout">
      <Sidebar />
      <Header />
      <main className="main-content">
        <div style={{ flex: 1 }}>
          <Outlet />
        </div>

        {/* Footer — always at bottom */}
        <footer style={{
          marginTop: 48,
          padding: '20px 0',
          borderTop: '1px solid #2a2a2a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: 12,
          color: '#737373',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 20,
              height: 20,
              background: 'linear-gradient(135deg, #dc2626, #991b1b)',
              borderRadius: 5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 9,
              fontWeight: 800,
              color: 'white',
            }}>F</div>
            <span style={{ fontWeight: 600, color: '#a3a3a3' }}>FinMetrics</span>
            <span>— Finance Dashboard</span>
          </div>
          <span>© {new Date().getFullYear()} • Built with React, Express & PostgreSQL</span>
        </footer>
      </main>
    </div>
  );
}

export default Layout;
