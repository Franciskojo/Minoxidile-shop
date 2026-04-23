import { useState } from 'react';
import { useGetAllUsersQuery, useUpdateUserAdminMutation, useDeleteUserAdminMutation } from '../store/slices/usersApiSlice.js';
import Loader from '../components/Loader.jsx';
import { FiCheck, FiX, FiTrash2, FiEdit2, FiSearch, FiUser, FiShield, FiBriefcase } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminUsersPage() {
    const { data, isLoading, refetch } = useGetAllUsersQuery();
    const [updateUser] = useUpdateUserAdminMutation();
    const [deleteUser] = useDeleteUserAdminMutation();
    const [searchTerm, setSearchTerm] = useState('');

    const users = data?.users || [];
    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            try {
                await deleteUser(id).unwrap();
                toast.success('User deleted successfully');
                refetch();
            } catch (err) {
                toast.error(err?.data?.message || 'Failed to delete user');
            }
        }
    };

    const handleRoleChange = async (user, newRole) => {
        try {
            await updateUser({ id: user._id, role: newRole }).unwrap();
            toast.success(`User role updated to ${newRole}`);
            refetch();
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to update role');
        }
    };

    const handleToggleStatus = async (user) => {
        try {
            await updateUser({ id: user._id, isActive: !user.isActive }).unwrap();
            toast.success(`User ${user.isActive ? 'deactivated' : 'activated'} successfully`);
            refetch();
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to update status');
        }
    };

    if (isLoading) return <Loader />;

    return (
        <div className="animate-fadeIn">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>User Management</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>View and manage all registered users</p>
                </div>
                <div style={{ position: 'relative', width: 300 }}>
                    <FiSearch style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input
                        className="form-control"
                        placeholder="Search users..."
                        style={{ paddingLeft: '2.75rem' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="card table-wrapper">
                <table className="table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Joined</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                                    No users found matching your search
                                </td>
                            </tr>
                        ) : (
                            filteredUsers.map((user) => (
                                <tr key={user._id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{
                                                width: 36, height: 36, borderRadius: '50%',
                                                background: 'var(--gradient-primary)', display: 'flex',
                                                alignItems: 'center', justifyContent: 'center',
                                                color: '#fff', fontWeight: 700
                                            }}>
                                                {user.name[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 700 }}>{user.name}</div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <select
                                                className="form-control"
                                                value={user.role}
                                                onChange={(e) => handleRoleChange(user, e.target.value)}
                                                style={{
                                                    padding: '0.25rem 0.5rem',
                                                    fontSize: '0.75rem',
                                                    height: 'auto',
                                                    width: 'auto',
                                                    background: user.role === 'admin' ? 'var(--info-bg)' : user.role === 'vendor' ? 'var(--warning-bg)' : 'var(--bg-input)',
                                                    color: user.role === 'admin' ? 'var(--info)' : user.role === 'vendor' ? 'var(--warning)' : 'var(--text-primary)',
                                                    border: '1px solid var(--border-color)',
                                                    fontWeight: 700
                                                }}
                                            >
                                                <option value="user">User</option>
                                                <option value="vendor">Vendor</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </div>
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => handleToggleStatus(user)}
                                            className={`badge ${user.isActive ? 'badge-success' : 'badge-danger'}`}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            {user.isActive ? 'Active' : 'Banned'}
                                        </button>
                                    </td>
                                    <td style={{ fontSize: '0.825rem' }}>{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                className="btn btn-icon btn-secondary btn-sm"
                                                style={{ color: 'var(--danger)' }}
                                                onClick={() => handleDelete(user._id)}
                                                title="Delete User"
                                            >
                                                <FiTrash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
