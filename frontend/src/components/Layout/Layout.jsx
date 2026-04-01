import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      {/* Mobile sidebar overlay */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'visible' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

      <main className="main-content">
        <div style={{ flex: 1 }}>
          <Outlet />
        </div>
      </main>

      {/* Full-width footer */}
      <footer className="app-footer">
        <div className="app-footer-inner">
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link
              to="/docs"
              target="_blank"
              style={{
                fontSize: 12,
                color: '#dc2626',
                fontWeight: 600,
                transition: 'color 0.2s',
              }}
            >
              📄 API Docs
            </Link>
            <span>© {new Date().getFullYear()} • React, Express & PostgreSQL</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
