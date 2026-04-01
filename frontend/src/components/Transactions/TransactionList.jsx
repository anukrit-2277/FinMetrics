import { HiOutlineArrowUp, HiOutlineArrowDown, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';

function TransactionList({ transactions, pagination, onPageChange, onEdit, onDelete, canModify }) {
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

  if (!transactions || transactions.length === 0) {
    return (
      <div className="card">
        <div className="empty-state">
          <div className="empty-state-icon">📊</div>
          <p className="empty-state-text">No transactions found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Notes</th>
              <th>Created By</th>
              {canModify && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
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
                <td style={{ color: 'var(--text-secondary)' }}>
                  {tx.user?.name || '—'}
                </td>
                {canModify && (
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        className="btn btn-icon btn-secondary"
                        onClick={() => onEdit(tx)}
                        title="Edit"
                      >
                        <HiOutlinePencil />
                      </button>
                      <button
                        className="btn btn-icon btn-danger"
                        onClick={() => onDelete(tx.id)}
                        title="Delete"
                      >
                        <HiOutlineTrash />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            disabled={pagination.page <= 1}
            onClick={() => onPageChange(pagination.page - 1)}
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {pagination.page} of {pagination.totalPages} ({pagination.total} records)
          </span>
          <button
            className="pagination-btn"
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => onPageChange(pagination.page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default TransactionList;
