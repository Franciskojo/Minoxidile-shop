import { useNavigate, NavLink, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { closeMobileSidebar } from '../store/slices/uiSlice.js';
import {
    FiGrid, FiPackage, FiShoppingBag, FiUsers, FiTag,
    FiTruck, FiArrowLeft, FiMoreVertical, FiLayers, FiX, FiMail
} from 'react-icons/fi';
import { MdStore } from 'react-icons/md';

export default function AdminLayout() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { mobileSidebarOpen } = useSelector((state) => state.ui);

    const menuItems = [
        { label: 'Dashboard', icon: FiGrid, to: '/admin/dashboard' },
        { label: 'Products', icon: FiPackage, to: '/admin/products' },
        { label: 'Orders', icon: FiShoppingBag, to: '/admin/orders' },
        { label: 'Users', icon: FiUsers, to: '/admin/users' },
        { label: 'Categories', icon: FiLayers, to: '/admin/categories' },
        { label: 'Store Requests', icon: MdStore, to: '/admin/vendors/applications' },
        { label: 'Coupons', icon: FiTag, to: '/admin/coupons' },
        { label: 'Messages', icon: FiMail, to: '/admin/messages' },
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
                <div style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', marginBottom: '0.5rem' }} className="sidebar-mobile-header">
                    <span style={{ fontWeight: 800, fontSize: '0.8rem', color: 'var(--text-muted)' }}>ADMIN PANEL</span>
                    <button className="btn btn-icon btn-sm" onClick={() => dispatch(closeMobileSidebar())}>
                        <FiX />
                    </button>
                </div>
                <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
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
                                boxShadow: isActive ? '0 4px 12px rgba(124, 58, 237, 0.3)' : 'none',
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
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <Outlet />
                </div>
            </main>

            <style>{`
        .sidebar-mobile-header { display: none; }
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
          .sidebar-mobile-header { display: flex; }
        }
      `}</style>
        </div>
    );
}
