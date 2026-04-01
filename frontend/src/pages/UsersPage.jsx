import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../api/client';
import UserList from '../components/Users/UserList';
import UserForm from '../components/Users/UserForm';
import { HiOutlineUserAdd } from 'react-icons/hi';

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users');
      setUsers(res.data.data);
    } catch (err) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await api.get('/users/roles');
      setRoles(res.data.data);
    } catch {
      // ignore
    }
  };

  const handleCreate = async (data) => {
    try {
      await api.post('/users', data);
      toast.success('User created successfully');
      setShowForm(false);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create user');
    }
  };

  const handleUpdate = async (data) => {
    try {
      await api.put(`/users/${editingUser.id}`, data);
      toast.success('User updated successfully');
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update user');
    }
  };

  const handleToggleStatus = async (user) => {
    const action = user.isActive ? 'deactivate' : 'activate';
    if (!window.confirm(`Are you sure you want to ${action} ${user.name}?`)) return;

    try {
      if (user.isActive) {
        await api.delete(`/users/${user.id}`);
        toast.success(`${user.name} deactivated`);
      } else {
        await api.put(`/users/${user.id}`, { isActive: true });
        toast.success(`${user.name} activated`);
      }
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${action} user`);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">User Management</h1>
          <p className="page-subtitle">Manage users and role assignments</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          <HiOutlineUserAdd />
          Add User
        </button>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner" />
          <p className="loading-text">Loading users...</p>
        </div>
      ) : (
        <UserList
          users={users}
          onEdit={(u) => setEditingUser(u)}
          onToggleStatus={handleToggleStatus}
        />
      )}

      {showForm && (
        <UserForm
          roles={roles}
          onSubmit={handleCreate}
          onClose={() => setShowForm(false)}
        />
      )}

      {editingUser && (
        <UserForm
          user={editingUser}
          roles={roles}
          onSubmit={handleUpdate}
          onClose={() => setEditingUser(null)}
        />
      )}
    </div>
  );
}

export default UsersPage;
