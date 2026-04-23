import { useState } from 'react';
import {
    useGetAllVendorApplicationsQuery,
    useUpdateVendorApplicationStatusMutation
} from '../store/slices/vendorApplicationApiSlice.js';
import Loader from '../components/Loader.jsx';
import { FiCheck, FiX, FiInfo, FiExternalLink, FiSearch } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminVendorApplicationsPage() {
    const { data, isLoading, refetch } = useGetAllVendorApplicationsQuery();
    const [updateStatus, { isLoading: isUpdating }] = useUpdateVendorApplicationStatusMutation();
    const [filter, setFilter] = useState('pending');

    const applications = data?.applications || [];
    const filteredApps = applications.filter(app => filter === 'all' ? true : app.status === filter);

    const handleAction = async (id, status) => {
        let adminComment = '';
        if (status === 'rejected') {
            adminComment = window.prompt('Provide a reason for rejection:');
            if (adminComment === null) return;
        }

        try {
            await updateStatus({ id, status, adminComment }).unwrap();
            toast.success(`Application ${status}`);
            refetch();
        } catch (err) {
            toast.error(err?.data?.message || 'Update failed');
        }
    };

    if (isLoading) return <Loader />;

    return (
        <div className="animate-fadeIn">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Vendor Applications</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Review requests to join the marketplace</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-input)', padding: '0.25rem', borderRadius: 'var(--radius-md)' }}>
                    {['pending', 'approved', 'rejected', 'all'].map((s) => (
                        <button
                            key={s}
                            onClick={() => setFilter(s)}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: 'var(--radius-sm)',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                textTransform: 'capitalize',
                                background: filter === s ? 'var(--accent-primary)' : 'transparent',
                                color: filter === s ? '#fff' : 'var(--text-secondary)',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'var(--transition)'
                            }}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            <div className="card table-wrapper">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Applicant</th>
                            <th>Store Details</th>
                            <th>Contact</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredApps.length === 0 ? (
                            <tr><td colSpan="6" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>No applications found in this category</td></tr>
                        ) : (
                            filteredApps.map((app) => (
                                <tr key={app._id}>
                                    <td>
                                        <div style={{ fontWeight: 700 }}>{app.user?.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{app.user?.email}</div>
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: 800, color: 'var(--accent-secondary)' }}>{app.storeName}</div>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {app.storeDescription}
                                        </p>
                                    </td>
                                    <td>
                                        <div style={{ fontSize: '0.825rem' }}>{app.businessEmail}</div>
                                        <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>{app.businessPhone}</div>
                                    </td>
                                    <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`status-badge status-${app.status}`}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td>
                                        {app.status === 'pending' ? (
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button className="btn btn-icon btn-secondary btn-sm" style={{ color: 'var(--success)' }} onClick={() => handleAction(app._id, 'approved')}>
                                                    <FiCheck size={16} />
                                                </button>
                                                <button className="btn btn-icon btn-secondary btn-sm" style={{ color: 'var(--danger)' }} onClick={() => handleAction(app._id, 'rejected')}>
                                                    <FiX size={16} />
                                                </button>
                                            </div>
                                        ) : (
                                            <button className="btn btn-icon btn-secondary btn-sm" title="View Details">
                                                <FiExternalLink size={14} />
                                            </button>
                                        )}
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
