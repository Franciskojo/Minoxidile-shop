import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FiShoppingCart, FiSearch, FiUser, FiMenu, FiX, FiHeart, FiLogOut, FiSettings, FiPackage, FiGrid } from 'react-icons/fi';
import { MdAdminPanelSettings, MdStore } from 'react-icons/md';
import { selectCurrentUser, selectIsAdmin, selectIsAuthenticated, selectIsVendor } from '../store/slices/authSlice.js';
import { selectCartCount } from '../store/slices/cartSlice.js';
import { useLogoutUserMutation } from '../store/slices/usersApiSlice.js';
import { toggleMobileSidebar } from '../store/slices/uiSlice.js';
import { useState, useRef, useEffect } from 'react';
import useDebounce from '../hooks/useDebounce.js';
import toast from 'react-hot-toast';

export default function Navbar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(selectCurrentUser);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const isAdmin = useSelector(selectIsAdmin);
    const isVendor = useSelector(selectIsVendor);
    const cartCount = useSelector(selectCartCount);
    const [logoutUser] = useLogoutUserMutation();
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearch = useDebounce(searchQuery, 400);

    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const location = useLocation();
    const isDashboardRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/vendor');

    // Auto-search logic (Optimization)
    useEffect(() => {
        if (debouncedSearch.trim()) {
            navigate(`/shop?search=${encodeURIComponent(debouncedSearch.trim())}`);
        }
    }, [debouncedSearch, navigate]);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        // Handled by debounced search
    };

    const handleLogout = async () => {
        try {
            await logoutUser().unwrap();
            toast.success('Logged out successfully');
            navigate('/');
        } catch {
            toast.error('Logout failed');
        }
        setUserMenuOpen(false);
    };

    return (
        <nav className="navbar" style={{
            position: 'fixed',
            top: 0, left: 0, right: 0,
            zIndex: 100,
            height: 'var(--navbar-height)',
            background: scrolled ? 'rgba(10, 10, 15, 0.95)' : 'rgba(10, 10, 15, 0.8)',
            backdropFilter: 'blur(20px)',
            borderBottom: `1px solid ${scrolled ? 'var(--border-color)' : 'transparent'}`,
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
        }}>
            <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', width: '100%' }}>
                {/* Mobile menu btn */}
                <button
                    onClick={() => {
                        if (isDashboardRoute) {
                            dispatch(toggleMobileSidebar());
                        } else {
                            setMobileMenuOpen(!mobileMenuOpen);
                        }
                    }}
                    className="btn btn-icon btn-secondary"
                    style={{ display: 'none' }}
                    id="mobile-menu-btn"
                >
                    {mobileMenuOpen && !isDashboardRoute ? <FiX /> : <FiMenu />}
                </button>

                {/* Logo */}
                <Link to="/" style={{
                    fontWeight: 900,
                    fontSize: '1.4rem',
                    background: 'var(--gradient-primary)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                }}>
                    Minoxidile
                </Link>

                {/* Navigation links */}
                <div style={{ display: 'flex', gap: '0.25rem', flexShrink: 0 }} className="nav-links">
                    {[['/', 'Home'], ['/shop', 'Shop'], ['/about', 'About'], ['/contact', 'Contact']].map(([to, label]) => (
                        <Link key={to} to={to} style={{
                            padding: '0.4rem 0.85rem',
                            borderRadius: 'var(--radius-full)',
                            color: 'var(--text-secondary)',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            transition: 'var(--transition)',
                        }}
                            onMouseEnter={e => { e.target.style.color = 'var(--text-primary)'; e.target.style.background = 'var(--bg-hover)'; }}
                            onMouseLeave={e => { e.target.style.color = 'var(--text-secondary)'; e.target.style.background = 'transparent'; }}
                        >{label}</Link>
                    ))}
                </div>

                {/* Search bar */}
                <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: 400 }}>
                    <div style={{ position: 'relative' }}>
                        <FiSearch style={{
                            position: 'absolute', left: '0.85rem', top: '50%',
                            transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: '0.9rem',
                        }} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search products…"
                            className="form-control"
                            style={{ paddingLeft: '2.4rem', paddingTop: '0.5rem', paddingBottom: '0.5rem', borderRadius: 'var(--radius-full)' }}
                        />
                    </div>
                </form>

                {/* Right actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto', flexShrink: 0 }}>
                    {/* Cart */}
                    <Link to="/cart" style={{ position: 'relative' }}>
                        <button className="btn btn-icon btn-secondary" id="cart-icon-btn">
                            <FiShoppingCart />
                            {cartCount > 0 && (
                                <span style={{
                                    position: 'absolute', top: '-4px', right: '-4px',
                                    background: 'var(--gradient-primary)',
                                    color: '#fff', fontSize: '0.65rem', fontWeight: 700,
                                    width: '18px', height: '18px', borderRadius: '50%',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    {cartCount > 9 ? '9+' : cartCount}
                                </span>
                            )}
                        </button>
                    </Link>

                    {/* User menu */}
                    {isAuthenticated ? (
                        <div ref={menuRef} style={{ position: 'relative' }}>
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                                    background: 'var(--bg-input)', border: '1px solid var(--border-color)',
                                    borderRadius: 'var(--radius-full)', padding: '0.4rem 0.85rem',
                                    color: 'var(--text-primary)', cursor: 'pointer', transition: 'var(--transition)',
                                }}
                                id="user-menu-btn"
                            >
                                <div style={{
                                    width: 28, height: 28, borderRadius: '50%',
                                    background: 'var(--gradient-primary)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '0.75rem', fontWeight: 700, color: '#fff',
                                }}>
                                    {user?.name?.[0]?.toUpperCase() || 'U'}
                                </div>
                                <span style={{ fontSize: '0.825rem', fontWeight: 600, maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {user?.name?.split(' ')[0]}
                                </span>
                            </button>

                            {userMenuOpen && (
                                <div className="glass animate-slideDown" style={{
                                    position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                                    minWidth: 200, padding: '0.5rem', zIndex: 200,
                                    animation: 'slideDown 0.2s ease',
                                }}>
                                    <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid var(--border-color)', marginBottom: '0.25rem' }}>
                                        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{user?.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user?.email}</div>
                                    </div>
                                    {[
                                        ['/account/profile', FiSettings, 'Account'],
                                        ['/account/orders', FiPackage, 'My Orders'],
                                        ['/account/wishlist', FiHeart, 'Wishlist'],
                                    ].map(([to, Icon, label]) => (
                                        <Link key={to} to={to} onClick={() => setUserMenuOpen(false)}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '0.65rem',
                                                padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)',
                                                color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500,
                                                transition: 'var(--transition)',
                                            }}
                                            onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                                        >
                                            <Icon /> {label}
                                        </Link>
                                    ))}
                                    {!isVendor && (
                                        <Link to="/become-vendor" onClick={() => setUserMenuOpen(false)}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '0.65rem',
                                                padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)',
                                                color: 'var(--accent-primary)', fontSize: '0.875rem', fontWeight: 600,
                                                transition: 'var(--transition)',
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                        >
                                            <MdStore size={14} /> Become a Vendor
                                        </Link>
                                    )}
                                    {isAdmin && (
                                        <Link to="/admin/dashboard" onClick={() => setUserMenuOpen(false)}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '0.65rem',
                                                padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)',
                                                color: 'var(--accent-secondary)', fontSize: '0.875rem', fontWeight: 500,
                                                transition: 'var(--transition)',
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,58,237,0.1)'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                        >
                                            <MdAdminPanelSettings /> Admin Dashboard
                                        </Link>
                                    )}
                                    {isVendor && !isAdmin && (
                                        <Link to="/vendor/dashboard" onClick={() => setUserMenuOpen(false)}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '0.65rem',
                                                padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)',
                                                color: 'var(--success)', fontSize: '0.875rem', fontWeight: 500,
                                                transition: 'var(--transition)',
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(16,185,129,0.1)'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                        >
                                            <FiGrid size={18} /> Vendor Dashboard
                                        </Link>
                                    )}
                                    <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '0.25rem 0' }} />
                                    <button onClick={handleLogout}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '0.65rem',
                                            padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)',
                                            color: 'var(--danger)', fontSize: '0.875rem', fontWeight: 500,
                                            width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                                            transition: 'var(--transition)',
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'var(--danger-bg)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <FiLogOut /> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <Link to="/login"><button className="btn btn-secondary btn-sm">Login</button></Link>
                            <Link to="/register"><button className="btn btn-primary btn-sm">Sign Up</button></Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Public Mobile Dropdown Menu */}
            {!isDashboardRoute && mobileMenuOpen && (
                <div className="glass animate-slideDown" style={{
                    position: 'absolute', top: '100%', left: 0, right: 0,
                    padding: '1.5rem', zIndex: 90,
                    borderBottom: '1px solid var(--border-color)',
                    background: 'var(--bg-primary)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                    display: 'flex', flexDirection: 'column', gap: '0.75rem',
                }}>
                    {[['/', 'Home'], ['/shop', 'Shop'], ['/about', 'About'], ['/contact', 'Contact']].map(([to, label]) => (
                        <Link key={to} to={to} onClick={() => setMobileMenuOpen(false)}
                            style={{
                                padding: '1rem', borderRadius: 'var(--radius-md)',
                                color: 'var(--text-primary)', fontWeight: 700, fontSize: '1.1rem',
                                background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            }}
                        >
                            {label}
                        </Link>
                    ))}
                    {!isAuthenticated && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
                            <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                                <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }}>Login</button>
                            </Link>
                            <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                                <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Sign Up</button>
                            </Link>
                        </div>
                    )}
                </div>
            )}

            <style>{`
        @media (max-width: 992px) {
          #mobile-menu-btn { display: flex !important; }
          .nav-links { display: none !important; }
          .navbar form { max-width: 160px !important; }
        }
        @media (max-width: 640px) {
          .navbar form { display: none !important; }
        }
      `}</style>
        </nav>
    );
}
