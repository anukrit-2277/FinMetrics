import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const COLORS = [
  '#14b8a6', '#8b5cf6', '#f97316', '#3b82f6',
  '#10b981', '#ef4444', '#eab308', '#ec4899',
  '#06b6d4', '#84cc16',
];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div
      style={{
        background: '#1e293b',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 8,
        padding: '10px 14px',
        fontSize: 13,
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 4 }}>{d.name}</div>
      <div style={{ color: d.payload.fill }}>
        ${d.value.toLocaleString()}
      </div>
    </div>
  );
};

function CategoryChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="card chart-card">
        <div className="card-header">
          <span className="card-title">Category Breakdown</span>
        </div>
        <div className="empty-state">
          <p className="empty-state-text">No category data available</p>
        </div>
      </div>
    );
  }

  // Aggregate by category
  const categoryMap = {};
  data.forEach((item) => {
    const key = item.category;
    if (!categoryMap[key]) {
      categoryMap[key] = { name: key, value: 0 };
    }
    categoryMap[key].value += item.total;
  });

  const chartData = Object.values(categoryMap)
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);

  return (
    <div className="card chart-card">
      <div className="card-header">
        <span className="card-title">Category Breakdown</span>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
          >
            {chartData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: 12, color: '#94a3b8' }}
            iconType="circle"
            iconSize={8}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CategoryChart;
