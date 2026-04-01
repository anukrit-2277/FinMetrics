import { HiOutlineTrendingUp, HiOutlineTrendingDown, HiOutlineScale, HiOutlineCollection } from 'react-icons/hi';

function SummaryCards({ data }) {
  if (!data) return null;

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);

  const cards = [
    {
      label: 'Total Income',
      value: formatCurrency(data.totalIncome),
      type: 'income',
      icon: <HiOutlineTrendingUp />,
    },
    {
      label: 'Total Expenses',
      value: formatCurrency(data.totalExpenses),
      type: 'expense',
      icon: <HiOutlineTrendingDown />,
    },
    {
      label: 'Net Balance',
      value: formatCurrency(data.netBalance),
      type: 'balance',
      icon: <HiOutlineScale />,
    },
    {
      label: 'Transactions',
      value: data.transactionCount,
      type: 'count',
      icon: <HiOutlineCollection />,
    },
  ];

  return (
    <div className="summary-grid">
      {cards.map((card) => (
        <div
          key={card.type}
          className={`card summary-card ${card.type} animate-in`}
        >
          <div className="summary-card-icon">{card.icon}</div>
          <div className="summary-card-label">{card.label}</div>
          <div className="summary-card-value">{card.value}</div>
        </div>
      ))}
    </div>
  );
}

export default SummaryCards;
