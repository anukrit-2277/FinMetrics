import { useState, useEffect } from 'react';
import { HiOutlineX } from 'react-icons/hi';

function TransactionForm({ transaction, onSubmit, onClose }) {
  const [form, setForm] = useState({
    amount: '',
    type: 'EXPENSE',
    category: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  useEffect(() => {
    if (transaction) {
      setForm({
        amount: transaction.amount || '',
        type: transaction.type || 'EXPENSE',
        category: transaction.category || '',
        date: transaction.date
          ? new Date(transaction.date).toISOString().split('T')[0]
          : '',
        notes: transaction.notes || '',
      });
    }
  }, [transaction]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  const isEditing = !!transaction;

  const categories = {
    INCOME: ['Salary', 'Freelance', 'Investments', 'Dividends', 'Rental Income', 'Other'],
    EXPENSE: ['Rent', 'Utilities', 'Groceries', 'Transport', 'Entertainment', 'Healthcare', 'Software', 'Marketing', 'Other'],
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {isEditing ? 'Edit Transaction' : 'New Transaction'}
          </h2>
          <button className="modal-close" onClick={onClose}>
            <HiOutlineX />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Amount ($)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="0.00"
                  step="0.01"
                  min="0.01"
                  max="9999999999.99"
                  value={form.amount}
                  onChange={(e) => handleChange('amount', e.target.value)}
                  required
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label className="form-label">Type</label>
                <select
                  className="form-select"
                  value={form.type}
                  onChange={(e) => handleChange('type', e.target.value)}
                  required
                >
                  <option value="INCOME">Income</option>
                  <option value="EXPENSE">Expense</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={form.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  required
                >
                  <option value="">Select category</option>
                  {(categories[form.type] || []).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={form.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Notes (optional)</label>
              <input
                type="text"
                className="form-input"
                placeholder="Add a note..."
                value={form.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                maxLength={500}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {isEditing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TransactionForm;
