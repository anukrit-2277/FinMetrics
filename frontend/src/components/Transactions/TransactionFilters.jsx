function TransactionFilters({ filters, onChange, categories }) {
  const handleChange = (field, value) => {
    onChange({ ...filters, [field]: value, page: 1 });
  };

  const handleReset = () => {
    onChange({
      type: '',
      category: '',
      startDate: '',
      endDate: '',
      search: '',
      page: 1,
      limit: 15,
    });
  };

  return (
    <div className="filters-bar">
      <input
        type="text"
        className="form-input"
        placeholder="Search transactions..."
        value={filters.search || ''}
        onChange={(e) => handleChange('search', e.target.value)}
        style={{ minWidth: 200 }}
      />

      <select
        className="form-select"
        value={filters.type || ''}
        onChange={(e) => handleChange('type', e.target.value)}
      >
        <option value="">All Types</option>
        <option value="INCOME">Income</option>
        <option value="EXPENSE">Expense</option>
      </select>

      <select
        className="form-select"
        value={filters.category || ''}
        onChange={(e) => handleChange('category', e.target.value)}
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <input
        type="date"
        className="form-input"
        value={filters.startDate || ''}
        onChange={(e) => handleChange('startDate', e.target.value)}
        style={{ minWidth: 140 }}
      />

      <input
        type="date"
        className="form-input"
        value={filters.endDate || ''}
        onChange={(e) => handleChange('endDate', e.target.value)}
        style={{ minWidth: 140 }}
      />

      <button className="btn btn-secondary btn-sm" onClick={handleReset}>
        Reset
      </button>
    </div>
  );
}

export default TransactionFilters;
