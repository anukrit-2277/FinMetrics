import { useState, useEffect } from 'react';
import api from '../api/client';

function InsightsPage() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const res = await api.get('/dashboard/insights');
        setInsights(res.data.data);
      } catch (err) {
        console.error('Failed to fetch insights:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, []);

  const typeStyles = {
    success: { border: '#16a34a', bg: 'rgba(22,163,74,0.08)', glow: 'rgba(22,163,74,0.15)' },
    warning: { border: '#f59e0b', bg: 'rgba(245,158,11,0.08)', glow: 'rgba(245,158,11,0.15)' },
    danger:  { border: '#dc2626', bg: 'rgba(220,38,38,0.08)', glow: 'rgba(220,38,38,0.15)' },
    info:    { border: '#6366f1', bg: 'rgba(99,102,241,0.08)', glow: 'rgba(99,102,241,0.15)' },
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <p className="loading-text">Analyzing financial data...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '0 4px' }}>
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#ffffff', marginBottom: 6 }}>
          Financial Insights
        </h2>
        <p style={{ fontSize: 13, color: '#737373' }}>
          Rule-based analysis of your financial data — patterns, anomalies, and recommendations.
        </p>
      </div>

      {/* Summary strip */}
      <div style={{
        display: 'flex',
        gap: 12,
        marginBottom: 24,
        flexWrap: 'wrap',
      }}>
        {[
          { label: 'Total Insights', value: insights.length, color: '#6366f1' },
          { label: 'Warnings', value: insights.filter(i => i.type === 'warning' || i.type === 'danger').length, color: '#f59e0b' },
          { label: 'Positive', value: insights.filter(i => i.type === 'success').length, color: '#16a34a' },
        ].map((s, i) => (
          <div key={i} style={{
            flex: '1 1 140px',
            background: '#1a1a1a',
            border: '1px solid #2a2a2a',
            borderRadius: 10,
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
          }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: `${s.color}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              fontWeight: 800,
              color: s.color,
            }}>{s.value}</div>
            <span style={{ fontSize: 12, color: '#737373', fontWeight: 500 }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Insights cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {insights.map((insight, idx) => {
          const style = typeStyles[insight.type] || typeStyles.info;
          return (
            <div
              key={idx}
              style={{
                background: style.bg,
                border: `1px solid ${style.border}30`,
                borderLeft: `4px solid ${style.border}`,
                borderRadius: 10,
                padding: '18px 22px',
                transition: 'all 0.3s',
                animation: `fadeIn 0.4s ease ${idx * 0.08}s both`,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = `0 4px 24px ${style.glow}`;
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 20 }}>{insight.icon}</span>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: '#e5e5e5', margin: 0 }}>
                  {insight.title}
                </h3>
                <span style={{
                  marginLeft: 'auto',
                  fontSize: 10,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: 0.8,
                  color: style.border,
                  background: `${style.border}15`,
                  padding: '2px 8px',
                  borderRadius: 4,
                }}>
                  {insight.type}
                </span>
              </div>
              <p style={{ fontSize: 13, color: '#a3a3a3', lineHeight: 1.7, margin: 0 }}>
                {insight.text}
              </p>
            </div>
          );
        })}
      </div>

      {/* Disclaimer */}
      <p style={{
        marginTop: 28,
        fontSize: 11,
        color: '#525252',
        textAlign: 'center',
        fontStyle: 'italic',
      }}>
        Insights are generated using rule-based analysis of your financial data. Not financial advice.
      </p>
    </div>
  );
}

export default InsightsPage;
