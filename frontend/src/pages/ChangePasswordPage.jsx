import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/client';
import { HiOutlineLockClosed, HiOutlineKey, HiOutlineCheckCircle } from 'react-icons/hi';

function ChangePasswordPage() {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const isStrong = (pw) => {
    return (
      pw.length >= 8 &&
      /[A-Z]/.test(pw) &&
      /[a-z]/.test(pw) &&
      /[0-9]/.test(pw) &&
      /[@$!%*?&#^()_+=\-[\]{}|\\:;"'<>,./~`]/.test(pw)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (!isStrong(form.newPassword)) {
      toast.error('Password must contain uppercase, lowercase, number & special char');
      return;
    }

    if (form.currentPassword === form.newPassword) {
      toast.error('New password must be different from current password');
      return;
    }

    setLoading(true);
    try {
      await api.put('/auth/change-password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      toast.success('Password changed successfully!');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const checks = [
    { label: 'At least 8 characters', pass: form.newPassword.length >= 8 },
    { label: 'Uppercase letter (A-Z)', pass: /[A-Z]/.test(form.newPassword) },
    { label: 'Lowercase letter (a-z)', pass: /[a-z]/.test(form.newPassword) },
    { label: 'Number (0-9)', pass: /[0-9]/.test(form.newPassword) },
    { label: 'Special character (@$!%*?&)', pass: /[@$!%*?&#^()_+=\-[\]{}|\\:;"'<>,./~`]/.test(form.newPassword) },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Change Password</h1>
          <p className="page-subtitle">Update your password securely</p>
        </div>
      </div>

      <div className="card" style={{ maxWidth: 480 }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              <HiOutlineLockClosed style={{ marginRight: 6, verticalAlign: 'middle' }} />
              Current Password
            </label>
            <input
              type="password"
              className="form-input"
              placeholder="Enter current password"
              value={form.currentPassword}
              onChange={(e) => handleChange('currentPassword', e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <HiOutlineKey style={{ marginRight: 6, verticalAlign: 'middle' }} />
              New Password
            </label>
            <input
              type="password"
              className="form-input"
              placeholder="Enter new password"
              value={form.newPassword}
              onChange={(e) => handleChange('newPassword', e.target.value)}
              required
              minLength={8}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <HiOutlineCheckCircle style={{ marginRight: 6, verticalAlign: 'middle' }} />
              Confirm New Password
            </label>
            <input
              type="password"
              className="form-input"
              placeholder="Re-enter new password"
              value={form.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              required
              minLength={8}
            />
            {form.confirmPassword && form.newPassword !== form.confirmPassword && (
              <p style={{ fontSize: 12, color: '#dc2626', marginTop: 4 }}>Passwords do not match</p>
            )}
          </div>

          {/* Strength indicators */}
          {form.newPassword && (
            <div style={{ marginBottom: 20, padding: '14px 16px', backgroundColor: '#0f0f0f', borderRadius: 8, border: '1px solid #2a2a2a' }}>
              <p style={{ fontSize: 11, color: '#737373', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 10 }}>
                Password Requirements
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {checks.map((check) => (
                  <div key={check.label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                    <span style={{ color: check.pass ? '#10b981' : '#737373', fontSize: 14 }}>
                      {check.pass ? '✓' : '○'}
                    </span>
                    <span style={{ color: check.pass ? '#a3a3a3' : '#737373' }}>
                      {check.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChangePasswordPage;
