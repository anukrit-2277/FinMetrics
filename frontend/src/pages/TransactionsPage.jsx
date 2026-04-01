import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import TransactionFilters from '../components/Transactions/TransactionFilters';
import TransactionList from '../components/Transactions/TransactionList';
import TransactionForm from '../components/Transactions/TransactionForm';
import { HiOutlinePlus } from 'react-icons/hi';

function TransactionsPage() {
  const { hasRole } = useAuth();
  const canModify = hasRole('ADMIN');

  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTx, setEditingTx] = useState(null);

  const [filters, setFilters] = useState({
    type: '',
    category: '',
    startDate: '',
    endDate: '',
    search: '',
    page: 1,
    limit: 15,
  });

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      Object.entries(filters).forEach(([key, val]) => {
        if (val) params[key] = val;
      });

      const res = await api.get('/transactions', { params });
      setTransactions(res.data.transactions);
      setPagination(res.data.pagination);
    } catch (err) {
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/transactions/categories');
      setCategories(res.data.data);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async (data) => {
    try {
      await api.post('/transactions', data);
      toast.success('Transaction created');
      setShowForm(false);
      fetchTransactions();
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create transaction');
    }
  };

  const handleUpdate = async (data) => {
    try {
      await api.put(`/transactions/${editingTx.id}`, data);
      toast.success('Transaction updated');
      setEditingTx(null);
      fetchTransactions();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update transaction');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    try {
      await api.delete(`/transactions/${id}`);
      toast.success('Transaction deleted');
      fetchTransactions();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete transaction');
    }
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Transactions</h1>
          <p className="page-subtitle">
            Manage and view all financial records
          </p>
        </div>
        {canModify && (
          <button
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
          >
            <HiOutlinePlus />
            New Transaction
          </button>
        )}
      </div>

      <TransactionFilters
        filters={filters}
        onChange={setFilters}
        categories={categories}
      />

      {loading ? (
        <div className="loading-container">
          <div className="spinner" />
          <p className="loading-text">Loading transactions...</p>
        </div>
      ) : (
        <TransactionList
          transactions={transactions}
          pagination={pagination}
          onPageChange={handlePageChange}
          onEdit={(tx) => setEditingTx(tx)}
          onDelete={handleDelete}
          canModify={canModify}
        />
      )}

      {showForm && (
        <TransactionForm
          onSubmit={handleCreate}
          onClose={() => setShowForm(false)}
        />
      )}

      {editingTx && (
        <TransactionForm
          transaction={editingTx}
          onSubmit={handleUpdate}
          onClose={() => setEditingTx(null)}
        />
      )}
    </div>
  );
}

export default TransactionsPage;
