import { useState, useEffect } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import SummaryCards from '../components/Dashboard/SummaryCards';
import CategoryChart from '../components/Dashboard/CategoryChart';
import TrendChart from '../components/Dashboard/TrendChart';
import RecentTransactions from '../components/Dashboard/RecentTransactions';

function DashboardPage() {
  const { hasRole } = useAuth();
  const [summary, setSummary] = useState(null);
  const [categories, setCategories] = useState([]);
  const [trends, setTrends] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch all data in parallel
      const requests = [
        api.get('/dashboard/summary'),
        api.get('/dashboard/recent'),
      ];

      // Only fetch analytics data for Analyst and Admin
      if (hasRole('ANALYST', 'ADMIN')) {
        requests.push(api.get('/dashboard/category-totals'));
        requests.push(api.get('/dashboard/trends'));
      }

      const responses = await Promise.all(requests);

      setSummary(responses[0].data.data);
      setRecent(responses[1].data.data);

      if (hasRole('ANALYST', 'ADMIN')) {
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
      </div>

      <SummaryCards data={summary} />

      {hasRole('ANALYST', 'ADMIN') && (
        <div className="charts-grid">
          <TrendChart data={trends} />
          <CategoryChart data={categories} />
        </div>
      )}

      <RecentTransactions data={recent} />
    </div>
  );
}

export default DashboardPage;
