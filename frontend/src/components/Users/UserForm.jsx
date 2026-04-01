import { useState, useEffect } from 'react';
import { HiOutlineX } from 'react-icons/hi';

function UserForm({ user, roles, onSubmit, onClose }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    roleId: '',
  });

  const isEditing = !!user;

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        password: '',
        roleId: user.roleId || '',
      });
    }
  }, [user]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const data = { ...form };
      if (isEditing) {
        delete data.password;
        delete data.email;
      }
      await onSubmit(data);
    } catch {
      // error handled by parent
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {isEditing ? 'Edit User' : 'Create User'}
          </h2>
          <button className="modal-close" onClick={onClose}>
            <HiOutlineX />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="John Doe"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
                minLength={2}
                autoFocus
              />
            </div>

            {!isEditing && (
              <>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="user@example.com"
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="Min 8 chars, A-Z, a-z, 0-9, special"
                    value={form.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    required
                    minLength={8}
                    pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$"
                    title="Min 8 characters with uppercase, lowercase, number and special character"
                  />
                  <p style={{ fontSize: 11, color: '#737373', marginTop: 4 }}>
                    Must include: uppercase, lowercase, number, special char (@$!%*?&)
                  </p>
                </div>
              </>
            )}

            <div className="form-group">
              <label className="form-label">Role</label>
              <select
                className="form-select"
                value={form.roleId}
                onChange={(e) => handleChange('roleId', e.target.value)}
                required
              >
                <option value="">Select role</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ opacity: loading ? 0.7 : 1, position: 'relative' }}>
              {loading && <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2, position: 'absolute', left: 12 }} />}
              {loading ? 'Saving...' : (isEditing ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserForm;
