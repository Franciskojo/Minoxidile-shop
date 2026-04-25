import { Link } from 'react-router-dom';
import { useGetMyOrdersQuery } from '../store/slices/ordersApiSlice.js';
import Loader from '../components/Loader.jsx';
import Pagination from '../components/Pagination.jsx';
import { useSearchParams } from 'react-router-dom';
import { FiEye, FiShoppingBag } from 'react-icons/fi';

export default function MyOrdersPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const page = searchParams.get('page') || 1;
    const { data, isLoading } = useGetMyOrdersQuery({ page });

    const orders = data?.orders || [];
    const pages = data?.pages || 1;

    if (isLoading) return <div className="page-wrapper"><Loader /></div>;

    return (
        <div className="page-wrapper">
            <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>My Orders</h1>

                {orders.length === 0 ? (
                    <div className="empty-state card">
                        <FiShoppingBag className="empty-state-icon" />
                        <h3>No orders found</h3>
                        <p>You haven't placed any orders yet. Start shopping to see them here!</p>
                        <Link to="/shop"><button className="btn btn-primary">Browse Shop</button></Link>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table */}
                        <div className="table-wrapper card hide-mobile">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Order #</th>
                                        <th>Date</th>
                                        <th>Items</th>
                                        <th>Total</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr key={order._id}>
                                            <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{order.orderNumber}</td>
                                            <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                            <td>{order.items.length} item(s)</td>
                                            <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>₵{order.totalPrice.toFixed(2)}</td>
                                            <td>
                                                <span className={`status-badge status-${order.status}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td>
                                                <Link to={`/order/${order._id}`}>
                                                    <button className="btn btn-secondary btn-sm" title="View Details">
                                                        <FiEye /> View
                                                    </button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card List */}
                        <div className="mobile-order-list show-mobile">
                            {orders.map((order) => (
                                <div key={order._id} className="card" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                        <div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Order Number</div>
                                            <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{order.orderNumber}</div>
                                        </div>
                                        <span className={`status-badge status-${order.status}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
                                        <div>
                                            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Date</div>
                                            <div style={{ fontWeight: 500 }}>{new Date(order.createdAt).toLocaleDateString()}</div>
                                        </div>
                                        <div>
                                            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Total</div>
                                            <div style={{ fontWeight: 700, color: 'var(--accent-secondary)' }}>₵{order.totalPrice.toFixed(2)}</div>
                                        </div>
                                    </div>
                                    <Link to={`/order/${order._id}`}>
                                        <button className="btn btn-secondary btn-block">
                                            <FiEye /> View Details
                                        </button>
                                    </Link>
                                </div>
                            ))}
                        </div>
                        <Pagination page={Number(page)} pages={pages} onPageChange={(p) => setSearchParams({ page: p })} />
                    </>
                )}
            </div>
        </div>
    );
}
