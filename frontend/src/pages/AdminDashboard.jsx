import { useGetDashboardStatsQuery } from '../store/slices/categoriesApiSlice.js';
import Loader from '../components/Loader.jsx';
import { FiUsers, FiShoppingBag, FiDollarSign, FiClock, FiArchive, FiArrowUpRight } from 'react-icons/fi';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, Cell, PieChart, Pie
} from 'recharts';

export default function AdminDashboard() {
    const { data, isLoading } = useGetDashboardStatsQuery();

    if (isLoading) return <Loader />;

    const { stats, recentOrders, salesChart, topProducts, ordersByStatus } = data || {};

    const statCards = [
        { label: 'Total Revenue', value: `$${stats?.totalRevenue.toFixed(2)}`, icon: FiDollarSign, color: 'var(--success)' },
        { label: 'Total Orders', value: stats?.totalOrders, icon: FiShoppingBag, color: 'var(--accent-secondary)' },
        { label: 'Total Customers', value: stats?.totalUsers, icon: FiUsers, color: 'var(--info)' },
        { label: 'Pending Orders', value: stats?.pendingOrders, icon: FiClock, color: 'var(--warning)' },
    ];

    const STATUS_COLORS = {
        pending: '#f59e0b',
        processing: '#3b82f6',
        shipped: '#a855f7',
        delivered: '#10b981',
        cancelled: '#ef4444'
    };

    return (
        <div className="animate-fadeIn admin-dashboard">
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '2rem' }}>Dashboard Overview</h1>

            {/* Stats Grid */}
            <div className="stats-grid" style={{ display: 'grid', gap: '1.5rem', marginBottom: '2.5rem' }}>
                {statCards.map((card) => (
                    <div key={card.label} className="card" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <div style={{
                                width: 48, height: 48, borderRadius: 'var(--radius-md)',
                                background: `${card.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: card.color
                            }}>
                                <card.icon size={24} />
                            </div>
                            <span style={{ color: 'var(--success)', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '2px' }}>
                                <FiArrowUpRight /> +12%
                            </span>
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>{card.value}</div>
                        <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', fontWeight: 500 }}>{card.label}</div>
                    </div>
                ))}
            </div>

            <div className="main-charts-grid" style={{ display: 'grid', gap: '1.5rem', marginBottom: '1.5rem' }}>
                {/* Sales Chart */}
                <div className="card" style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem' }}>Revenue Analysis (Last 7 Days)</h3>
                    <div style={{ width: '100%', height: 300, minWidth: 0 }}>
                        <ResponsiveContainer>
                            <LineChart data={salesChart}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                                <XAxis dataKey="_id" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                                <Tooltip
                                    contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}
                                    itemStyle={{ color: 'var(--accent-secondary)' }}
                                />
                                <Line type="monotone" dataKey="revenue" stroke="var(--accent-primary)" strokeWidth={3} dot={{ fill: 'var(--accent-primary)', r: 4 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Orders by Status Pie */}
                <div className="card" style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem' }}>Order Status</h3>
                    <div style={{ width: '100%', height: 300, minWidth: 0 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={ordersByStatus}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="count"
                                    nameKey="_id"
                                >
                                    {ordersByStatus?.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry._id] || 'var(--accent-primary)'} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
                        {ordersByStatus?.map(s => (
                            <div key={s._id} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem' }}>
                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: STATUS_COLORS[s._id] }} />
                                <span style={{ textTransform: 'capitalize', color: 'var(--text-secondary)' }}>{s._id} ({s.count})</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="recent-grid" style={{ display: 'grid', gap: '1.5rem' }}>
                {/* Recent Orders */}
                <div className="card" style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Recent Orders</h3>
                    <div className="table-wrapper" style={{ border: 'none', overflowX: 'auto' }}>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Order</th>
                                    <th>Customer</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders?.map(order => (
                                    <tr key={order._id}>
                                        <td style={{ fontWeight: 600 }}>{order.orderNumber}</td>
                                        <td>{order.user?.name}</td>
                                        <td style={{ fontWeight: 700 }}>${order.totalPrice.toFixed(2)}</td>
                                        <td><span className={`status-badge status-${order.status}`}>{order.status}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top Products */}
                <div className="card" style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Top Products by Sales</h3>
                    <div className="flex flex-col gap-4">
                        {topProducts?.map(p => (
                            <div key={p._id} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-sm)', background: 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <FiArchive color="var(--text-muted)" />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{p.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.totalSold} units sold</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--accent-secondary)' }}>${p.revenue.toFixed(2)}</div>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--success)' }}>Revenue</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
                .stats-grid { grid-template-columns: repeat(4, 1fr); }
                .main-charts-grid { grid-template-columns: 2fr 1fr; }
                .recent-grid { grid-template-columns: repeat(2, 1fr); }

                @media (max-width: 1280px) {
                    .stats-grid { grid-template-columns: repeat(2, 1fr); }
                }
                
                @media (max-width: 1024px) {
                    .main-charts-grid { grid-template-columns: 1fr; }
                    .recent-grid { grid-template-columns: 1fr; }
                }

                @media (max-width: 640px) {
                    .stats-grid { grid-template-columns: 1fr; }
                    .card { padding: 1.25rem !important; }
                    h1 { fontSize: 1.5rem !important; }
                }
            `}</style>
        </div>
    );
}
