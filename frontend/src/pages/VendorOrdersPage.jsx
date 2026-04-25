import { useGetVendorOrdersQuery } from '../store/slices/vendorApiSlice.js';
import Loader from '../components/Loader.jsx';
import { FiShoppingBag, FiEye, FiClock, FiCheckCircle, FiTruck, FiCornerUpRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function VendorOrdersPage() {
    const { data, isLoading } = useGetVendorOrdersQuery();
    const orders = data?.orders || [];

    if (isLoading) return <Loader />;

    return (
        <div className="animate-fadeIn">
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>My Sales</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Track and manage orders for your products</p>
            </div>

            <div className="card table-wrapper" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Items</th>
                            <th>Your Earnings</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                                    <div style={{ marginBottom: '1rem', fontSize: '3rem', opacity: 0.2 }}><FiShoppingBag /></div>
                                    <p>No orders yet. Increase your sales by adding more products!</p>
                                </td>
                            </tr>
                        ) : (
                            orders.map((order) => (
                                <tr key={order._id}>
                                    <td>
                                        <div style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>
                                            #{order._id.slice(-8).toUpperCase()}
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: 600 }}>{order.user?.name}</div>
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{order.user?.email}</div>
                                    </td>
                                    <td>
                                        <div style={{ fontSize: '0.825rem' }}>
                                            {order.items.map(item => (
                                                <div key={item._id}>
                                                    {item.qty}x {item.name}
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: 800, color: 'var(--success)' }}>
                                            ₵{order.vendorSubtotal.toFixed(2)}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`status-badge status-${order.status || 'pending'}`}>
                                            {order.status || 'Received'}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ fontSize: '0.825rem' }}>
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td>
                                        <Link to={`/vendor/order/${order._id}`}>
                                            <button className="btn btn-secondary btn-icon btn-sm" title="View Full Order Details">
                                                <FiEye size={14} />
                                            </button>
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="status-grid" style={{ marginTop: '2.5rem', display: 'grid', gap: '1.5rem' }}>
                <div className="card" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'var(--info-bg)', color: 'var(--info)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FiClock size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>To Process</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{orders.filter(o => o.status === 'processing').length}</div>
                    </div>
                </div>
                <div className="card" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'var(--warning-bg)', color: 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FiTruck size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>In Transit</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{orders.filter(o => o.status === 'shipped').length}</div>
                    </div>
                </div>
                <div className="card" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'var(--success-bg)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FiCheckCircle size={24} />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Completed</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{orders.filter(o => o.status === 'delivered').length}</div>
                    </div>
                </div>
            </div>

            <style>{`
                .status-grid {
                    grid-template-columns: repeat(3, 1fr);
                }
                @media (max-width: 1024px) {
                    .status-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }
                @media (max-width: 640px) {
                    .status-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
}
