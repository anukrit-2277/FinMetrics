import { HiOutlineArrowUp, HiOutlineArrowDown } from 'react-icons/hi';

function RecentTransactions({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="card">
        <div className="card-header">
          <span className="card-title">Recent Transactions</span>
        </div>
        <div className="empty-state">
          <p className="empty-state-text">No recent transactions</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(val);

  return (
    <div className="card">
      <div className="card-header">
        <span className="card-title">Recent Transactions</span>
      </div>
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {data.map((tx) => (
              <tr key={tx.id}>
                <td>
                  {tx.type === 'INCOME' ? (
                    <span className="badge badge-income">
                      <HiOutlineArrowUp style={{ marginRight: 4 }} />
                      Income
                    </span>
                  ) : (
                    <span className="badge badge-expense">
                      <HiOutlineArrowDown style={{ marginRight: 4 }} />
                      Expense
                    </span>
                  )}
                </td>
                <td>{tx.category}</td>
                <td
                  style={{
                    fontWeight: 600,
                    color:
                      tx.type === 'INCOME'
                        ? 'var(--color-income)'
                        : 'var(--color-expense)',
                  }}
                >
                  {tx.type === 'INCOME' ? '+' : '-'}
                  {formatCurrency(tx.amount)}
                </td>
                <td style={{ color: 'var(--text-secondary)' }}>
                  {formatDate(tx.date)}
                </td>
                <td
                  style={{
                    color: 'var(--text-muted)',
                    maxWidth: 200,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {tx.notes || '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RecentTransactions;
