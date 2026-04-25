import { useGetAllOrdersQuery, useUpdateOrderStatusMutation } from '../store/slices/ordersApiSlice.js';
import Loader from '../components/Loader.jsx';
import Pagination from '../components/Pagination.jsx';
import { useSearchParams, Link } from 'react-router-dom';
import { FiEye, FiClock, FiTruck, FiCheckCircle, FiXCircle, FiFilter } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useState } from 'react';

const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrderListPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const page = searchParams.get('page') || 1;
    const status = searchParams.get('status') || '';

    const { data, isLoading, refetch } = useGetAllOrdersQuery({ page, status, limit: 10 });
    const [updateStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();

    const orders = data?.orders || [];
    const pages = data?.pages || 1;

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await updateStatus({ id, status: newStatus }).unwrap();
            toast.success(`Order status updated to ${newStatus}`);
        } catch (err) {
            toast.error(err?.data?.message || 'Update failed');
        }
    };

    const getStatusIcon = (s) => {
        switch (s) {
            case 'pending': return <FiClock />;
            case 'shipped': return <FiTruck />;
            case 'delivered': return <FiCheckCircle />;
            case 'cancelled': return <FiXCircle />;
            default: return <FiClock />;
        }
    };

    if (isLoading) return <Loader />;

    return (
        <div className="animate-fadeIn">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Order Management</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Track and manage customer orders</p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <FiFilter style={{ color: 'var(--text-muted)' }} />
                    <select
                        className="form-control"
                        style={{ width: 'auto', minWidth: 150 }}
                        value={status}
                        onChange={(e) => {
                            const next = new URLSearchParams(searchParams);
                            if (e.target.value) next.set('status', e.target.value);
                            else next.delete('status');
                            next.set('page', '1');
                            setSearchParams(next);
                        }}
                    >
                        <option value="">All Statuses</option>
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                    </select>
                </div>
            </div>

            <div className="card table-wrapper">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Order #</th>
                            <th>Date</th>
                            <th>Customer</th>
                            <th>Total</th>
                            <th>Payment</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length === 0 ? (
                            <tr><td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No orders found</td></tr>
                        ) : (
                            orders.map((order) => (
                                <tr key={order._id}>
                                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{order.orderNumber}</td>
                                    <td style={{ fontSize: '0.85rem' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <div style={{ fontWeight: 600 }}>{order.user?.name || 'Guest'}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{order.user?.email}</div>
                                    </td>
                                    <td style={{ fontWeight: 700 }}>₵{order.totalPrice.toFixed(2)}</td>
                                    <td>
                                        {order.isPaid ? (
                                            <span className="badge badge-success">Paid</span>
                                        ) : (
                                            <span className="badge badge-danger">Unpaid</span>
                                        )}
                                    </td>
                                    <td>
                                        <select
                                            className={`status-select status-${order.status}`}
                                            value={order.status}
                                            disabled={isUpdating}
                                            onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                            style={{
                                                padding: '0.25rem 0.5rem',
                                                borderRadius: 'var(--radius-sm)',
                                                fontSize: '0.75rem',
                                                fontWeight: 700,
                                                textTransform: 'uppercase',
                                                border: '1px solid currentColor',
                                                background: 'transparent',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {STATUS_OPTIONS.map(s => (
                                                <option key={s} value={s} style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>
                                                    {s.toUpperCase()}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td>
                                        <Link to={`/admin/order/${order._id}`}>
                                            <button className="btn btn-icon btn-secondary btn-sm" title="View Details">
                                                <FiEye />
                                            </button>
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <Pagination
                page={Number(page)}
                pages={pages}
                onPageChange={(p) => {
                    const next = new URLSearchParams(searchParams);
                    next.set('page', p);
                    setSearchParams(next);
                }}
            />
        </div>
    );
}
