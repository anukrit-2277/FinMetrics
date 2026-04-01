import { HiOutlinePencil, HiOutlineBan, HiOutlineCheckCircle } from 'react-icons/hi';

function UserList({ users, onEdit, onToggleStatus }) {
  if (!users || users.length === 0) {
    return (
      <div className="card">
        <div className="empty-state">
          <div className="empty-state-icon">👥</div>
          <p className="empty-state-text">No users found</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  const getInitials = (name) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  return (
    <div className="card">
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: user.isActive
                          ? 'linear-gradient(135deg, #dc2626, #991b1b)'
                          : 'rgba(100,116,139,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 12,
                        fontWeight: 700,
                        color: 'white',
                        flexShrink: 0,
                      }}
                    >
                      {getInitials(user.name)}
                    </div>
                    <span style={{ fontWeight: 500 }}>{user.name}</span>
                  </div>
                </td>
                <td style={{ color: 'var(--text-secondary)' }}>{user.email}</td>
                <td>
                  <span className="badge badge-role">{user.role?.name || user.role}</span>
                </td>
                <td>
                  <span className={`badge ${user.isActive ? 'badge-active' : 'badge-inactive'}`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td style={{ color: 'var(--text-muted)' }}>{formatDate(user.createdAt)}</td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      className="btn btn-icon btn-secondary"
                      onClick={() => onEdit(user)}
                      title="Edit user"
                    >
                      <HiOutlinePencil />
                    </button>
                    <button
                      className={`btn btn-icon ${user.isActive ? 'btn-danger' : 'btn-primary'}`}
                      onClick={() => onToggleStatus(user)}
                      title={user.isActive ? 'Deactivate' : 'Activate'}
                      style={{ fontSize: 16 }}
                    >
                      {user.isActive ? <HiOutlineBan /> : <HiOutlineCheckCircle />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserList;
