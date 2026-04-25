import { Link } from 'react-router-dom';
import heroImg from '../assets/hero.webp';
import { useGetFeaturedProductsQuery, useGetTopRatedQuery } from '../store/slices/productsApiSlice.js';
import { useGetCategoriesQuery } from '../store/slices/categoriesApiSlice.js';
import ProductCard from '../components/ProductCard.jsx';
import Loader from '../components/Loader.jsx';
import SkeletonLoader from '../components/SkeletonLoader.jsx';
import Meta from '../components/Meta.jsx';
import { FiArrowRight, FiShield, FiTruck, FiRefreshCw, FiHeadphones } from 'react-icons/fi';

const FEATURES = [
    { icon: FiTruck, title: 'Free Shipping', desc: 'On orders over $100' },
    { icon: FiShield, title: 'Secure Payments', desc: '256-bit SSL encryption' },
    { icon: FiRefreshCw, title: 'Easy Returns', desc: '30-day hassle-free returns' },
    { icon: FiHeadphones, title: '24/7 Support', desc: 'Round-the-clock assistance' },
];

export default function HomePage() {
    const { data: featuredData, isLoading: featuredLoading } = useGetFeaturedProductsQuery(8);
    const { data: topData, isLoading: topLoading } = useGetTopRatedQuery();
    const { data: categoriesData } = useGetCategoriesQuery();

    const categories = categoriesData?.categories?.slice(0, 6) || [];
    const featured = featuredData?.products || [];
    const topRated = topData?.products || [];

    return (
        <div>
            <Meta />
            {/* Hero */}
            <section className="hero-section">
                <div className="hero-blob" />
                <div className="hero-blob-2" />
                <div className="container hero-container">
                    <div className="hero-content">
                        <div className="hero-badge animate-fade-in">
                            <span className="sparkle">✨</span> Premium Grooming Solutions
                        </div>
                        <h1 className="hero-title animate-slide-up">
                            Unlock Your <br />
                            <span className="text-gradient">Ultimate Potential</span>
                        </h1>
                        <p className="hero-subtitle animate-slide-up-delayed">
                            Discover the science of growth. Premium minoxidil treatments, 
                            organic beard oils, and professional grooming tools designed for the modern man.
                        </p>
                        <div className="hero-actions animate-slide-up-delayed-2">
                            <Link to="/shop">
                                <button className="btn btn-primary btn-lg hero-btn">
                                    Shop Collection <FiArrowRight className="btn-icon" />
                                </button>
                            </Link>
                            <Link to="/shop?featured=true">
                                <button className="btn btn-outline btn-lg hero-btn">
                                    View Featured
                                </button>
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="hero-stats animate-fade-in-delayed">
                            {[['10K+', 'Products'], ['50K+', 'Customers'], ['4.9★', 'Rating']].map(([num, label]) => (
                                <div key={label} className="stat-item">
                                    <div className="stat-value">{num}</div>
                                    <div className="stat-label">{label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="hero-image-wrapper animate-float">
                        <div className="image-glow" />
                        <img 
                            src={heroImg} 
                            alt="Premium Grooming Products" 
                            className="hero-main-image"
                        />
                    </div>
                </div>
            </section>

            {/* Features */}
            <div style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
                <div className="container features-grid">
                    {FEATURES.map(({ icon: Icon, title, desc }, i) => (
                        <div key={title} className="feature-item">
                            <div style={{
                                width: 44, height: 44, borderRadius: 'var(--radius-md)',
                                background: 'rgba(124,58,237,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'var(--accent-secondary)', flexShrink: 0,
                            }}>
                                <Icon size={20} />
                            </div>
                            <div>
                                <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{title}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{desc}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Categories */}
            {categories.length > 0 && (
                <section className="section">
                    <div className="container">
                        <div className="section-header">
                            <h2 className="section-title">Shop by Category</h2>
                            <Link to="/shop" style={{ color: 'var(--accent-secondary)', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                Browse All <FiArrowRight />
                            </Link>
                        </div>
                        <div className="category-grid">
                            {categories.map((cat) => (
                                <Link key={cat._id} to={`/shop?category=${cat._id}`}>
                                    <div className="card category-card" style={{ padding: '1.5rem 1rem', textAlign: 'center', cursor: 'pointer' }}>
                                        <div className="category-icon-wrapper">
                                            🛍️
                                        </div>
                                        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}
                                            className="truncate">
                                            {cat.name}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <style>{`
                .hero-section {
                    position: relative;
                    padding-top: calc(var(--navbar-height) + 4rem);
                    min-height: 90vh;
                    display: flex;
                    align-items: center;
                    overflow: hidden;
                    background: var(--bg-primary);
                }

                .hero-blob {
                    position: absolute;
                    top: -10%;
                    right: -10%;
                    width: 60%;
                    height: 80%;
                    background: radial-gradient(circle, rgba(124, 58, 237, 0.08) 0%, transparent 70%);
                    filter: blur(80px);
                    z-index: 0;
                }

                .hero-blob-2 {
                    position: absolute;
                    bottom: -10%;
                    left: -10%;
                    width: 40%;
                    height: 60%;
                    background: radial-gradient(circle, rgba(168, 85, 247, 0.05) 0%, transparent 70%);
                    filter: blur(80px);
                    z-index: 0;
                }

                .hero-container {
                    position: relative;
                    z-index: 1;
                    display: grid;
                    grid-template-columns: 1.2fr 1fr;
                    gap: 4rem;
                    align-items: center;
                }

                .hero-content {
                    max-width: 680px;
                }

                .hero-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: rgba(124, 58, 237, 0.1);
                    color: var(--accent-secondary);
                    padding: 0.5rem 1rem;
                    border-radius: var(--radius-full);
                    font-size: 0.875rem;
                    font-weight: 600;
                    margin-bottom: 2rem;
                    border: 1px solid rgba(124, 58, 237, 0.2);
                }

                .hero-title {
                    font-size: clamp(2.5rem, 6vw, 4.5rem);
                    font-weight: 900;
                    line-height: 1.1;
                    margin-bottom: 1.5rem;
                    color: var(--text-primary);
                }

                .text-gradient {
                    background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .hero-subtitle {
                    font-size: 1.25rem;
                    color: var(--text-secondary);
                    margin-bottom: 2.5rem;
                    line-height: 1.7;
                    max-width: 540px;
                }

                .hero-actions {
                    display: flex;
                    gap: 1.5rem;
                    margin-bottom: 4rem;
                }

                .hero-btn {
                    padding: 1rem 2rem;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    transition: all 0.3s ease;
                }

                .hero-btn:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 10px 25px -5px rgba(124, 58, 237, 0.4);
                }

                .hero-stats {
                    display: flex;
                    gap: 3rem;
                }

                .stat-value {
                    font-size: 1.75rem;
                    font-weight: 800;
                    color: var(--text-primary);
                }

                .stat-label {
                    font-size: 0.875rem;
                    color: var(--text-muted);
                    font-weight: 500;
                }

                .hero-image-wrapper {
                    position: relative;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                .image-glow {
                    position: absolute;
                    width: 120%;
                    height: 120%;
                    background: radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, transparent 60%);
                    z-index: -1;
                }

                .hero-main-image {
                    max-width: 100%;
                    height: auto;
                    border-radius: 2rem;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }

                /* Animations */
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }

                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }

                .animate-fade-in {
                    animation: fadeIn 0.8s ease-out forwards;
                }

                .animate-slide-up {
                    animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }

                .animate-slide-up-delayed {
                    opacity: 0;
                    animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards;
                }

                .animate-slide-up-delayed-2 {
                    opacity: 0;
                    animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards;
                }

                .animate-fade-in-delayed {
                    opacity: 0;
                    animation: fadeIn 1s ease-out 0.6s forwards;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                /* Mobile-First Base Framework */
                .features-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 1rem;
                    padding-top: 2rem;
                    padding-bottom: 2rem;
                }
                .feature-item {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem;
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-md);
                    background: var(--bg-card);
                }
                
                .category-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 1rem;
                }

                .category-card {
                    transition: all 0.3s ease;
                }

                .category-card:hover {
                    transform: translateY(-5px);
                    border-color: var(--accent-secondary);
                }

                .category-icon-wrapper {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    background: var(--gradient-primary);
                    margin: 0 auto 0.75rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.3rem;
                    transition: transform 0.3s ease;
                }

                .category-card:hover .category-icon-wrapper {
                    transform: scale(1.1) rotate(10deg);
                }

                /* Responsive Overrides */
                @media (max-width: 992px) {
                    .hero-container {
                        grid-template-columns: 1fr;
                        gap: 3rem;
                        text-align: center;
                    }
                    .hero-content {
                        max-width: 100%;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                    }
                    .hero-actions {
                        justify-content: center;
                    }
                    .hero-stats {
                        justify-content: center;
                    }
                    .hero-subtitle {
                        max-width: 100%;
                    }
                    .hero-image-wrapper {
                        order: -1;
                    }
                    .hero-main-image {
                        max-width: 80%;
                    }
                }

                @media (max-width: 640px) {
                    .hero-section { padding-top: calc(var(--navbar-height) + 2rem); min-height: 80vh; }
                    .hero-title { font-size: 2.5rem; }
                    .hero-subtitle { font-size: 1.125rem; }
                    .hero-actions { width: 100%; flex-direction: column; gap: 1rem; }
                    .hero-btn { width: 100%; justify-content: center; }
                    .hero-stats { gap: 1.5rem; flex-wrap: wrap; justify-content: center; }
                    .stat-value { font-size: 1.5rem; }
                }

                /* Tablet Breakpoint */
                @media (min-width: 577px) {
                    .features-grid { grid-template-columns: repeat(2, 1fr); padding-top: 0; padding-bottom: 0; gap: 0; }
                    .feature-item { border: none; border-radius: 0; background: transparent; padding: 1.5rem 0; justify-content: center; }
                    .category-grid { grid-template-columns: repeat(4, 1fr); gap: 1.5rem;}
                }

                /* Desktop Breakpoint */
                @media (min-width: 993px) {
                    .features-grid { grid-template-columns: repeat(4, 1fr); }
                    .feature-item { padding: 2rem 1.5rem; justify-content: flex-start; }
                    .feature-item:not(:last-child) { border-right: 1px solid var(--border-color); }
                    .category-grid { grid-template-columns: repeat(6, 1fr); gap: 1.5rem;}
                }
            `}</style>

            {/* Featured Products */}
            <section className="section" style={{ background: 'var(--bg-secondary)', paddingTop: '3rem', paddingBottom: '3rem' }}>
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Featured Products</h2>
                        <Link to="/shop?featured=true" style={{ color: 'var(--accent-secondary)', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            View All <FiArrowRight />
                        </Link>
                    </div>
                    {featuredLoading ? (
                        <SkeletonLoader count={8} />
                    ) : featured.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">🛍️</div>
                            <p style={{ color: 'var(--text-muted)' }}>No featured products yet</p>
                        </div>
                    ) : (
                        <div className="grid-4">
                            {featured.slice(0, 8).map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Top Rated */}
            {topRated.length > 0 && (
                <section className="section">
                    <div className="container">
                        <div className="section-header">
                            <h2 className="section-title">Top Rated</h2>
                            <Link to="/shop?sort=rating" style={{ color: 'var(--accent-secondary)', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                See More <FiArrowRight />
                            </Link>
                        </div>
                        <div className="grid-4">
                            {topRated.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA Banner */}
            <section style={{
                background: 'linear-gradient(135deg, #4c1d95, #7c3aed, #a855f7)',
                padding: '5rem 0', position: 'relative', overflow: 'hidden',
            }}>
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.05) 0%, transparent 70%)',
                }} />
                <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                    <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', fontWeight: 900, color: '#fff', marginBottom: '1rem' }}>
                        Ready to Shop?
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', marginBottom: '2rem' }}>
                        Join over 50,000 satisfied customers. Sign up and get 10% off your first order.
                    </p>
                    <Link to="/register">
                        <button style={{
                            background: '#fff', color: '#7c3aed', border: 'none',
                            padding: '0.875rem 2.5rem', borderRadius: 'var(--radius-full)',
                            fontWeight: 700, fontSize: '1rem', cursor: 'pointer',
                            boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
                            transition: 'var(--transition)',
                        }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            Get Started Free
                        </button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
