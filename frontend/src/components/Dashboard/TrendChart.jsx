import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: '#1a1a1a',
        border: '1px solid #2a2a2a',
        borderRadius: 8,
        padding: '10px 14px',
        fontSize: 13,
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 6, color: '#a3a3a3' }}>
        {label}
      </div>
      {payload.map((p) => (
        <div key={p.name} style={{ color: p.color, marginBottom: 2 }}>
          {p.name}: ${p.value.toLocaleString()}
        </div>
      ))}
    </div>
  );
};

function TrendChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="card chart-card">
        <div className="card-header">
          <span className="card-title">Monthly Trends</span>
        </div>
        <div className="empty-state">
          <p className="empty-state-text">No trend data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card chart-card">
      <div className="card-header">
        <span className="card-title">Monthly Trends</span>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="gradientIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradientExpense" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f97316" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
          <XAxis
            dataKey="month"
            tick={{ fill: '#737373', fontSize: 12 }}
            axisLine={{ stroke: '#2a2a2a' }}
          />
          <YAxis
            tick={{ fill: '#737373', fontSize: 12 }}
            axisLine={{ stroke: '#2a2a2a' }}
            tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: 12, color: '#a3a3a3' }}
            iconType="circle"
            iconSize={8}
          />
          <Area
            type="monotone"
            dataKey="income"
            name="Income"
            stroke="#10b981"
            fill="url(#gradientIncome)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="expense"
            name="Expenses"
            stroke="#f97316"
            fill="url(#gradientExpense)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default TrendChart;
