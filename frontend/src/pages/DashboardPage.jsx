import { useState, useEffect } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import SummaryCards from '../components/Dashboard/SummaryCards';
import CategoryChart from '../components/Dashboard/CategoryChart';
import TrendChart from '../components/Dashboard/TrendChart';
import RecentTransactions from '../components/Dashboard/RecentTransactions';
import { HiOutlineLockClosed, HiOutlineChartBar } from 'react-icons/hi';

function DashboardPage() {
  const { hasRole, user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [categories, setCategories] = useState([]);
  const [trends, setTrends] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  const isViewer = user?.role === 'VIEWER';
  const canSeeAnalytics = hasRole('ANALYST', 'ADMIN');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const requests = [
        api.get('/dashboard/summary'),
        api.get('/dashboard/recent'),
      ];

      if (canSeeAnalytics) {
        requests.push(api.get('/dashboard/category-totals'));
        requests.push(api.get('/dashboard/trends'));
      }

      const responses = await Promise.all(requests);

      setSummary(responses[0].data.data);
      setRecent(responses[1].data.data);

      if (canSeeAnalytics) {
        setCategories(responses[2].data.data);
        setTrends(responses[3].data.data);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <p className="loading-text">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Your financial overview at a glance</p>
        </div>
        {/* Role indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 14px',
          borderRadius: 8,
          backgroundColor: '#0f0f0f',
          border: '1px solid #2a2a2a',
          fontSize: 12,
          color: '#737373',
        }}>
          <div style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: user?.role === 'ADMIN' ? '#dc2626' : user?.role === 'ANALYST' ? '#10b981' : '#3b82f6',
          }} />
          <span>Logged in as <strong style={{ color: '#a3a3a3' }}>{user?.role}</strong></span>
        </div>
      </div>

      <SummaryCards data={summary} />

      {/* Charts section — visible for Analyst/Admin, locked for Viewer */}
      {canSeeAnalytics ? (
        <div className="charts-grid">
          <TrendChart data={trends} />
          <CategoryChart data={categories} />
        </div>
      ) : (
        <div className="charts-grid" style={{ marginBottom: 24 }}>
          {/* Locked chart placeholders for Viewer */}
          <div className="card chart-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 280, textAlign: 'center', opacity: 0.7 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 12,
              backgroundColor: 'rgba(59,130,246,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 14,
            }}>
              <HiOutlineLockClosed style={{ fontSize: 24, color: '#3b82f6' }} />
            </div>
            <p style={{ fontSize: 15, fontWeight: 600, color: '#a3a3a3', marginBottom: 6 }}>Monthly Trends</p>
            <p style={{ fontSize: 12, color: '#737373', maxWidth: 220 }}>
              Upgrade to <strong style={{ color: '#10b981' }}>Analyst</strong> role to access trend insights and analytics
            </p>
          </div>

          <div className="card chart-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 280, textAlign: 'center', opacity: 0.7 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 12,
              backgroundColor: 'rgba(59,130,246,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 14,
            }}>
              <HiOutlineChartBar style={{ fontSize: 24, color: '#3b82f6' }} />
            </div>
            <p style={{ fontSize: 15, fontWeight: 600, color: '#a3a3a3', marginBottom: 6 }}>Category Breakdown</p>
            <p style={{ fontSize: 12, color: '#737373', maxWidth: 220 }}>
              Upgrade to <strong style={{ color: '#10b981' }}>Analyst</strong> role to view category-wise spending
            </p>
          </div>
        </div>
      )}

      <RecentTransactions data={recent} />

      {/* Viewer restriction notice */}
      {isViewer && (
        <div style={{
          marginTop: 20,
          padding: '14px 20px',
          backgroundColor: '#0f0f0f',
          border: '1px solid #2a2a2a',
          borderRadius: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          fontSize: 13,
          color: '#737373',
        }}>
          <HiOutlineLockClosed style={{ fontSize: 18, color: '#3b82f6', flexShrink: 0 }} />
          <span>
            You have <strong style={{ color: '#3b82f6' }}>Viewer</strong> access — dashboard summary and recent transactions only. 
            Contact an admin for elevated permissions.
          </span>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
