import { useGetVendorStatsQuery } from '../store/slices/vendorApiSlice.js';
import Loader from '../components/Loader.jsx';
import { FiDollarSign, FiPackage, FiShoppingBag, FiTrendingUp } from 'react-icons/fi';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line
} from 'recharts';

export default function VendorDashboard() {
    const { data, isLoading } = useGetVendorStatsQuery();

    if (isLoading) return <Loader />;

    const { stats } = data || {};

    const statCards = [
        { label: 'Vendor Revenue', value: `₵${stats?.totalRevenue.toFixed(2)}`, icon: FiDollarSign, color: 'var(--success)' },
        { label: 'Units Sold', value: stats?.totalOrders, icon: FiShoppingBag, color: 'var(--accent-secondary)' },
        { label: 'Total Products', value: stats?.totalProducts, icon: FiPackage, color: 'var(--info)' },
        { label: 'Conversion', value: '3.2%', icon: FiTrendingUp, color: 'var(--warning)' },
    ];

    return (
        <div className="animate-fadeIn vendor-dashboard">
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '2rem' }}>Vendor Overview</h1>

            <div className="stats-grid" style={{ display: 'grid', gap: '1.5rem', marginBottom: '2.5rem' }}>
                {statCards.map((card) => (
                    <div key={card.label} className="card" style={{ padding: '1.5rem' }}>
                        <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', background: `${card.color}15`, color: card.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                            <card.icon size={20} />
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>{card.value}</div>
                        <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>{card.label}</div>
                    </div>
                ))}
            </div>

            <div className="charts-grid" style={{ display: 'grid', gap: '1.5rem' }}>
                <div className="card" style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.5rem' }}>Sales Performance (Last 6 Months)</h3>
                    <div style={{ height: 300, minWidth: 0 }}>
                        <ResponsiveContainer>
                            <BarChart data={stats?.monthlySales}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                                <XAxis dataKey="_id" stroke="var(--text-muted)" fontSize={12} tickFormatter={(m) => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][m - 1]} />
                                <YAxis stroke="var(--text-muted)" fontSize={12} />
                                <Tooltip
                                    contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}
                                />
                                <Bar dataKey="revenue" fill="var(--accent-primary)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔥</div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Keep it up!</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                        Your shop is performing 15% better than last month. Consider running a coupon campaign to boost sales further.
                    </p>
                    <button className="btn btn-secondary" style={{ marginTop: '1.5rem' }}>Apply Promo</button>
                </div>
            </div>

            <style>{`
                .stats-grid {
                    grid-template-columns: repeat(4, 1fr);
                }
                .charts-grid {
                    grid-template-columns: 2fr 1fr;
                }
                @media (max-width: 1024px) {
                    .stats-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                    .charts-grid {
                        grid-template-columns: 1fr;
                    }
                }
                @media (max-width: 640px) {
                    .stats-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
}
