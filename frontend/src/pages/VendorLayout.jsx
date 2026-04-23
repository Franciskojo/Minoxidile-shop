import { useNavigate, NavLink, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { closeMobileSidebar } from '../store/slices/uiSlice.js';
import {
    FiGrid, FiPackage, FiShoppingBag, FiLayers, FiSettings, FiMessageCircle, FiX
} from 'react-icons/fi';

export default function VendorLayout() {
    const dispatch = useDispatch();
    const { mobileSidebarOpen } = useSelector((state) => state.ui);

    const menuItems = [
        { label: 'Overview', icon: FiGrid, to: '/vendor/dashboard' },
        { label: 'Messages', icon: FiMessageCircle, to: '/vendor/chat' },
        { label: 'My Products', icon: FiPackage, to: '/vendor/products' },
        { label: 'Store Orders', icon: FiShoppingBag, to: '/vendor/orders' },
        { label: 'Settings', icon: FiSettings, to: '/vendor/settings' },
    ];

    return (
        <div className={`admin-layout ${mobileSidebarOpen ? 'sidebar-open' : ''}`} style={{ background: 'var(--bg-primary)' }}>
            {/* Mobile Overlay */}
            {mobileSidebarOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() => dispatch(closeMobileSidebar())}
                    style={{
                        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
                        backdropFilter: 'blur(4px)', zIndex: 90, cursor: 'pointer'
                    }}
                />
            )}

            {/* Sidebar */}
            <aside className={`admin-sidebar glass ${mobileSidebarOpen ? 'open' : ''}`} style={{
                borderRight: '1px solid var(--border-color)',
                top: 'var(--navbar-height)',
                height: 'calc(100vh - var(--navbar-height))',
                zIndex: 100
            }}>
                <div style={{ padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Vendor Panel</div>
                    <button className="btn btn-icon btn-sm sidebar-close-btn" onClick={() => dispatch(closeMobileSidebar())} style={{ display: 'none' }}>
                        <FiX />
                    </button>
                </div>
                <div style={{ padding: '0 1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            onClick={() => dispatch(closeMobileSidebar())}
                            style={({ isActive }) => ({
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.875rem 1.25rem',
                                borderRadius: 'var(--radius-md)',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                                background: isActive ? 'var(--gradient-primary)' : 'transparent',
                                transition: 'var(--transition)',
                            })}
                        >
                            <item.icon size={18} />
                            <span className="sidebar-text">{item.label}</span>
                        </NavLink>
                    ))}
                </div>
            </aside>

            {/* Main Content */}
            <main className="admin-content" style={{ overflowY: 'auto' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem' }}>
                    <Outlet />
                </div>
            </main>

            <style>{`
        @media (max-width: 992px) {
          .admin-sidebar { 
            position: fixed;
            left: -280px;
            width: 280px !important;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .admin-sidebar.open {
            left: 0;
            box-shadow: 20px 0 50px rgba(0,0,0,0.5);
          }
          .admin-content { margin-left: 0 !important; }
          .sidebar-close-btn { display: flex !important; }
        }
      `}</style>
        </div>
    );
}
