import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import heroImg from '../assets/hero.webp';
import { useGetFeaturedProductsQuery, useGetTopRatedQuery, useGetProductsQuery } from '../store/slices/productsApiSlice.js';
import { useGetCategoriesQuery } from '../store/slices/categoriesApiSlice.js';
import ProductCard from '../components/ProductCard.jsx';
import Loader from '../components/Loader.jsx';
import SkeletonLoader from '../components/SkeletonLoader.jsx';
import Meta from '../components/Meta.jsx';
import { FiArrowRight, FiShield, FiTruck, FiRefreshCw, FiHeadphones } from 'react-icons/fi';

const FEATURES = [
    { icon: FiTruck, title: 'Free Shipping', desc: 'On orders over ₵100' },
    { icon: FiShield, title: 'Secure Payments', desc: '256-bit SSL encryption' },
    { icon: FiRefreshCw, title: 'Easy Returns', desc: '30-day hassle-free returns' },
    { icon: FiHeadphones, title: '24/7 Support', desc: 'Round-the-clock assistance' },
];

const TESTIMONIALS = [
    {
        name: 'Kofi Mensah',
        role: 'Verified Customer',
        rating: 5,
        text: 'Best Minoxidil shop in Ghana. The results are visible after just 2 months of using their beard growth bundle! Quick delivery too.',
        avatar: '👨🏾‍💼'
    },
    {
        name: 'Ama Serwaa',
        role: 'Verified Customer',
        rating: 5,
        text: 'Bought the organic beard wash and tools for my husband. Excellent quality and the customer support was extremely helpful.',
        avatar: '👩🏾'
    },
    {
        name: 'Emmanuel Osei',
        role: 'Verified Customer',
        rating: 5,
        text: 'Super fast delivery and authentic products. The real-time chat with vendors made it easy to ask questions about usage.',
        avatar: '👨🏾'
    }
];

const getCategoryDetails = (name) => {
    const lower = name.toLowerCase();
    if (lower.includes('minoxidil') || lower.includes('growth') || lower.includes('serum')) {
        return { icon: '🧪', gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' };
    }
    if (lower.includes('beard') || lower.includes('oil') || lower.includes('balm')) {
        return { icon: '🧔', gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' };
    }
    if (lower.includes('shampoo') || lower.includes('wash') || lower.includes('soap') || lower.includes('conditioner')) {
        return { icon: '🧴', gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' };
    }
    if (lower.includes('tool') || lower.includes('derma') || lower.includes('roller') || lower.includes('comb') || lower.includes('brush')) {
        return { icon: '🪮', gradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)' };
    }
    if (lower.includes('vitamin') || lower.includes('supplement') || lower.includes('biotin') || lower.includes('pill')) {
        return { icon: '💊', gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)' };
    }
    return { icon: '🛍️', gradient: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)' };
};


export default function HomePage() {
    const { data: featuredData, isLoading: featuredLoading } = useGetFeaturedProductsQuery(8);
    const { data: topData, isLoading: topLoading } = useGetTopRatedQuery();
    const { data: categoriesData } = useGetCategoriesQuery();

    const [activeTab, setActiveTab] = useState('new');
    const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
    const { data: newArrivalsData, isLoading: loadingNew } = useGetProductsQuery({ sort: 'newest', limit: 8 });
    const { data: trendingData, isLoading: loadingTrending } = useGetProductsQuery({ sort: 'popular', limit: 8 });

    const categories = categoriesData?.categories?.slice(0, 6) || [];
    const featured = featuredData?.products || [];
    const topRated = topData?.products || [];
    const newArrivals = newArrivalsData?.products || [];
    const trendingProducts = trendingData?.products || [];

    // Carousel Slide State & Auto-sliding logic
    const [currentIndex, setCurrentIndex] = useState(0);
    const [cardsToShow, setCardsToShow] = useState(4);

    // Reset slide index when activeTab changes
    useEffect(() => {
        setCurrentIndex(0);
    }, [activeTab]);

    // Handle screen resize to dynamically change the number of visible cards
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width < 576) setCardsToShow(3);
            else if (width < 992) setCardsToShow(4);
            else setCardsToShow(3); // split screen desktop mode
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const activeProducts = activeTab === 'new' ? newArrivals : trendingProducts;

    // Automatic transition interval
    useEffect(() => {
        if (activeProducts.length <= cardsToShow) {
            setCurrentIndex(0);
            return;
        }
        const interval = setInterval(() => {
            setCurrentIndex((prev) => {
                const maxIndex = activeProducts.length - cardsToShow;
                if (prev >= maxIndex) return 0;
                return prev + 1;
            });
        }, 4000);
        return () => clearInterval(interval);
    }, [activeProducts, cardsToShow]);

    return (
        <div>
            <Meta />
            {/* Hero Section Widescreen Showcase */}
            <section className="hero-section">
                <div className="hero-blob" />
                <div className="hero-blob-2" />
                <div className="container hero-grid">
                    
                    {/* Left Column: Bold Value Statement and CTAs */}
                    <div className="hero-left-content animate-slide-up">
                        <div className="hero-rating-badge">
                            <span className="stars">★★★★★</span>
                            <span className="rating-text">4.9/5 from 12k+ Happy Customers</span>
                        </div>
                        <h1 className="hero-headline">
                            Grow Your Best Beard. <br/>
                            <span className="text-gradient">Reclaim Your Hair.</span>
                        </h1>
                        <p className="hero-description">
                            Authentic, dermatologist-tested formulas and premium tools tailored for visible hair regrowth and beard thickness. Start your routine today.
                        </p>
                        
                        <div className="hero-cta-group">
                            <Link to="/shop" className="btn btn-primary btn-lg">
                                Shop All Products
                            </Link>
                            <a href="#bundles-section" className="btn btn-secondary btn-lg">
                                Explore Kits & Save
                            </a>
                        </div>

                        <div className="hero-trust-row">
                            <div className="trust-seal">
                                <span className="seal-icon">🔬</span>
                                <span>FDA-Approved Active Ingredients</span>
                            </div>
                            <div className="trust-seal">
                                <span className="seal-icon">🧪</span>
                                <span>Dermatologist Tested</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sliding Showcase Carousel */}
                    <div className="hero-right-showcase animate-slide-up-delayed">
                        <div className="hero-showcase-inner-header">
                            <h2 style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', fontWeight: 700, marginBottom: '0.75rem' }}>
                                Interactive Catalog
                            </h2>
                        </div>
                        <div className="hero-tab-header">
                            <button 
                                className={`hero-tab-btn ${activeTab === 'new' ? 'active' : ''}`}
                                onClick={() => setActiveTab('new')}
                            >
                                ✨ New Arrivals
                            </button>
                            <button 
                                className={`hero-tab-btn ${activeTab === 'trending' ? 'active' : ''}`}
                                onClick={() => setActiveTab('trending')}
                            >
                                🔥 Trending
                            </button>
                        </div>

                        <div className="showcase-slider-wrapper">
                            {loadingNew || loadingTrending ? (
                                <SkeletonLoader count={3} />
                            ) : activeProducts.length === 0 ? (
                                <div className="empty-state">
                                    <p style={{ color: 'var(--text-muted)' }}>No products found</p>
                                </div>
                            ) : (
                                <div className="showcase-slider-viewport">
                                    <div 
                                        className="showcase-slider-track"
                                        style={{ transform: `translate3d(calc(-${currentIndex} * (100cqw + var(--gap)) / var(--cards-to-show)), 0, 0)` }}
                                    >
                                        {activeProducts.map((product) => (
                                            <div key={product._id} className="showcase-slide-item">
                                                <ProductCard product={product} hidePrice={true} hideAddToCart={true} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
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
                            {categories.map((cat) => {
                                const { icon, gradient } = getCategoryDetails(cat.name);
                                return (
                                    <Link key={cat._id} to={`/shop?category=${cat._id}`}>
                                        <div className="card category-card" style={{ padding: '1.5rem 1rem', textAlign: 'center', cursor: 'pointer' }}>
                                            <div className="category-icon-wrapper" style={{ background: gradient }}>
                                                {icon}
                                            </div>
                                            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}
                                                className="truncate">
                                                {cat.name}
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            <style>{`
                .hero-section {
                    position: relative;
                    padding-top: calc(var(--navbar-height) + 2rem);
                    padding-bottom: 4rem;
                    min-height: auto;
                    display: flex;
                    align-items: center;
                    overflow: hidden;
                    background: var(--bg-primary);
                    border-bottom: 1px solid var(--border-color);
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

                /* Hero Grid Split Layout */
                .hero-grid {
                    display: grid;
                    grid-template-columns: 1.1fr 0.9fr;
                    gap: 3.5rem;
                    align-items: center;
                    width: 100%;
                    position: relative;
                    z-index: 1;
                }

                @media (max-width: 1024px) {
                    .hero-grid {
                        grid-template-columns: 1fr;
                        gap: 3rem;
                        text-align: center;
                    }
                }

                /* Hero Content styling */
                .hero-left-content {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                @media (max-width: 1024px) {
                    .hero-left-content {
                        align-items: center;
                    }
                }

                .hero-rating-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.6rem;
                    background: rgba(124, 58, 237, 0.1);
                    border: 1px solid rgba(124, 58, 237, 0.2);
                    padding: 0.4rem 1rem;
                    border-radius: var(--radius-full);
                    width: fit-content;
                }

                .hero-rating-badge .stars {
                    color: var(--warning);
                    font-weight: 700;
                    font-size: 0.9rem;
                    letter-spacing: 1px;
                }

                .hero-rating-badge .rating-text {
                    font-size: 0.75rem;
                    font-weight: 600;
                    color: var(--accent-light);
                }

                .hero-headline {
                    font-size: clamp(2.25rem, 5vw, 3.5rem);
                    font-weight: 900;
                    line-height: 1.15;
                    color: #fff;
                    letter-spacing: -0.02em;
                }

                .text-gradient {
                    background: linear-gradient(135deg, #a855f7 0%, #c084fc 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .hero-description {
                    font-size: clamp(1rem, 2vw, 1.1rem);
                    color: var(--text-secondary);
                    line-height: 1.6;
                    max-width: 540px;
                }

                .hero-cta-group {
                    display: flex;
                    gap: 1rem;
                    flex-wrap: wrap;
                }

                @media (max-width: 576px) {
                    .hero-cta-group {
                        width: 100%;
                        flex-direction: column;
                    }
                    .hero-cta-group .btn {
                        width: 100%;
                    }
                }

                .hero-trust-row {
                    display: flex;
                    gap: 1.5rem;
                    flex-wrap: wrap;
                    margin-top: 0.5rem;
                }

                @media (max-width: 1024px) {
                    .hero-trust-row {
                        justify-content: center;
                    }
                }

                .trust-seal {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.8rem;
                    font-weight: 600;
                    color: var(--text-muted);
                }

                .seal-icon {
                    font-size: 1rem;
                }

                /* Hero Right Showcase */
                .hero-right-showcase {
                    width: 100%;
                    overflow: hidden;
                    background: rgba(22, 22, 31, 0.4);
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-xl);
                    padding: 1.5rem;
                    backdrop-filter: blur(10px);
                }

                .hero-showcase-inner-header {
                    text-align: left;
                }

                @media (max-width: 1024px) {
                    .hero-showcase-inner-header {
                        text-align: center;
                    }
                }

                /* Tab Segment Switch */
                .hero-tab-header {
                    display: inline-flex;
                    background: var(--bg-card);
                    border: 1px solid var(--border-color);
                    padding: 0.25rem;
                    border-radius: var(--radius-full);
                    margin-bottom: 1.5rem;
                    box-shadow: var(--shadow-sm);
                }

                .hero-tab-btn {
                    padding: 0.5rem 1.25rem;
                    border-radius: var(--radius-full);
                    font-size: 0.8rem;
                    font-weight: 700;
                    color: var(--text-secondary);
                    transition: var(--transition);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.4rem;
                    background: transparent;
                    border: none;
                }

                .hero-tab-btn.active {
                    background: var(--gradient-primary);
                    color: #fff;
                    box-shadow: 0 4px 12px rgba(124, 58, 237, 0.25);
                }

                .hero-tab-btn:hover:not(.active) {
                    color: var(--text-primary);
                    background: var(--bg-hover);
                }

                /* Slider viewport and track styling */
                .showcase-slider-wrapper {
                    width: 100%;
                    position: relative;
                }

                .showcase-slider-viewport {
                    width: 100%;
                    overflow: hidden;
                    padding: 0.25rem 0;
                    container-type: inline-size;
                    container-name: viewport;
                }

                .showcase-slider-track {
                    display: flex;
                    gap: var(--gap);
                    transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
                }

                .showcase-slide-item {
                    flex: 0 0 calc((100% - (var(--cards-to-show) - 1) * var(--gap)) / var(--cards-to-show));
                    max-width: calc((100% - (var(--cards-to-show) - 1) * var(--gap)) / var(--cards-to-show));
                }

                .hero-section {
                    --cards-to-show: 3;
                    --gap: 1rem;
                }

                @media (max-width: 1024px) {
                    .hero-section {
                        --cards-to-show: 2;
                    }
                }

                @media (max-width: 576px) {
                    .hero-section {
                        --cards-to-show: 1;
                    }
                }

                /* Bundle Section Styling */
                .bundle-card {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    background: var(--gradient-card);
                }

                .bundle-image-wrapper {
                    position: relative;
                    aspect-ratio: 16/10;
                    overflow: hidden;
                    background: var(--bg-input);
                }

                .bundle-image-wrapper img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: var(--transition-slow);
                }

                .bundle-card:hover .bundle-image-wrapper img {
                    transform: scale(1.05);
                }

                .bundle-discount-badge {
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    background: var(--danger);
                    color: #fff;
                    font-size: 0.75rem;
                    font-weight: 800;
                    padding: 0.3rem 0.75rem;
                    border-radius: var(--radius-full);
                    box-shadow: var(--shadow-sm);
                }

                .bundle-card-body {
                    padding: 1.5rem;
                    display: flex;
                    flex-direction: column;
                    flex: 1;
                }

                .bundle-title {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: #fff;
                    margin-bottom: 0.5rem;
                }

                .bundle-desc {
                    font-size: 0.85rem;
                    color: var(--text-secondary);
                    margin-bottom: 1.25rem;
                    line-height: 1.5;
                }

                .bundle-includes {
                    list-style: none;
                    margin-bottom: 1.5rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .bundle-includes li {
                    font-size: 0.8rem;
                    color: var(--text-primary);
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .bundle-price-row {
                    margin-top: auto;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    border-top: 1px solid var(--border-color);
                    padding-top: 1rem;
                }

                .bundle-price {
                    display: flex;
                    flex-direction: column;
                }

                .bundle-price .old-price {
                    font-size: 0.8rem;
                    text-decoration: line-through;
                    color: var(--text-muted);
                }

                .bundle-price .new-price {
                    font-size: 1.25rem;
                    font-weight: 800;
                    color: var(--success);
                }

                /* Newsletter Section styling */
                .newsletter-section {
                    position: relative;
                }

                .newsletter-icon {
                    font-size: 2.5rem;
                    display: block;
                    margin-bottom: 1rem;
                }

                /* Rest of standard categories/features styles */
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

                /* Testimonials styles */
                .testimonials-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 1.5rem;
                }
                .testimonial-card {
                    padding: 2rem;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    height: 100%;
                }
                .testimonial-stars {
                    color: var(--warning);
                    margin-bottom: 1rem;
                    display: flex;
                    gap: 2px;
                }
                .testimonial-user {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin-top: 1.5rem;
                }
                .testimonial-avatar {
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    background: var(--bg-hover);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.25rem;
                    border: 1px solid var(--border-color);
                }

                @media (min-width: 768px) {
                    .testimonials-grid {
                        grid-template-columns: repeat(3, 1fr);
                    }
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

            {/* Kits & Bundles Section */}
            <section id="bundles-section" className="section" style={{ borderTop: '1px solid var(--border-color)' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>Value Packages</span>
                        <h2 className="section-title" style={{ fontSize: '2rem', display: 'inline-block' }}>Grooming Kits & Bundle Deals</h2>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Save up to 20% on our premium curated routines and growth kits</p>
                    </div>

                    <div className="grid-3">
                        {/* Bundle Card 1 */}
                        <div className="card bundle-card">
                            <div className="bundle-image-wrapper">
                                <img src="https://images.unsplash.com/photo-1626015253241-c7a659fa5243?w=800&q=80" alt="Advanced Hair Regrowth Kit" />
                                <span className="bundle-discount-badge">Save ₵15</span>
                            </div>
                            <div className="bundle-card-body">
                                <h3 className="bundle-title">Advanced Hair Regrowth Kit</h3>
                                <p className="bundle-desc">The ultimate 3-step routine targeting severe patchiness and vertex thinning.</p>
                                <ul className="bundle-includes">
                                    <li>🧪 Kirkland Minoxidil (6-Month Supply)</li>
                                    <li>💊 Biotin Growth Gummies (60 Count)</li>
                                    <li>🪮 Stainless Steel Derma Roller (0.5mm)</li>
                                </ul>
                                <div className="bundle-price-row">
                                    <div className="bundle-price">
                                        <span className="old-price">₵104.99</span>
                                        <span className="new-price">₵89.99</span>
                                    </div>
                                    <Link to="/shop" className="btn btn-outline btn-sm">View Details</Link>
                                </div>
                            </div>
                        </div>

                        {/* Bundle Card 2 */}
                        <div className="card bundle-card">
                            <div className="bundle-image-wrapper">
                                <img src="https://images.unsplash.com/photo-1590159413207-6880017de87f?w=800&q=80" alt="Ultimate Beard Growth Bundle" />
                                <span className="bundle-discount-badge">Save ₵10</span>
                            </div>
                            <div className="bundle-card-body">
                                <h3 className="bundle-title">Ultimate Beard Growth Bundle</h3>
                                <p className="bundle-desc">Fully nourish follicles, hydrate skin, and style your growing beard.</p>
                                <ul className="bundle-includes">
                                    <li>🧔 Organic Scented Beard Oil (50ml)</li>
                                    <li>🧴 Premium Conditioning Beard Balm</li>
                                    <li>🪮 Derma Roller (0.5mm) & Wood Comb</li>
                                </ul>
                                <div className="bundle-price-row">
                                    <div className="bundle-price">
                                        <span className="old-price">₵69.99</span>
                                        <span className="new-price">₵59.99</span>
                                    </div>
                                    <Link to="/product/professional-grooming-kit" className="btn btn-outline btn-sm">Shop Now</Link>
                                </div>
                            </div>
                        </div>

                        {/* Bundle Card 3 */}
                        <div className="card bundle-card">
                            <div className="bundle-image-wrapper">
                                <img src="https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=800&q=80" alt="Follicle Booster Starter Pack" />
                                <span className="bundle-discount-badge">Save ₵12</span>
                            </div>
                            <div className="bundle-card-body">
                                <h3 className="bundle-title">Follicle Booster Starter Pack</h3>
                                <p className="bundle-desc">Perfect combination for beginners to strengthen and boost beard density.</p>
                                <ul className="bundle-includes">
                                    <li>🧪 Minoxidil Booster Serum 10%</li>
                                    <li>🧴 Biotin Thickening Shampoo (250ml)</li>
                                    <li>🎁 Free Pocket Grooming Comb</li>
                                </ul>
                                <div className="bundle-price-row">
                                    <div className="bundle-price">
                                        <span className="old-price">₵91.99</span>
                                        <span className="new-price">₵79.99</span>
                                    </div>
                                    <Link to="/shop" className="btn btn-outline btn-sm">View Details</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

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

            {/* Testimonials */}
            <section className="section" style={{ background: 'var(--bg-primary)' }}>
                <div className="container">
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <h2 className="section-title" style={{ display: 'inline-block' }}>What Our Clients Say</h2>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '0.95rem' }}>Real growth stories from verified customers</p>
                    </div>
                    <div className="testimonials-grid">
                        {TESTIMONIALS.map((t, i) => (
                            <div key={i} className="card testimonial-card">
                                <div>
                                    <div className="testimonial-stars">
                                        {[...Array(t.rating)].map((_, idx) => (
                                            <span key={idx}>★</span>
                                        ))}
                                    </div>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.6, fontStyle: 'italic' }}>
                                        "{t.text}"
                                    </p>
                                </div>
                                <div className="testimonial-user">
                                    <div className="testimonial-avatar">
                                        {t.avatar}
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>{t.name}</h4>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="section newsletter-section" style={{ borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-secondary)' }}>
                <div className="container" style={{ maxWidth: '600px', textAlign: 'center' }}>
                    <span className="newsletter-icon">✉️</span>
                    <h2 className="section-title" style={{ fontSize: '1.8rem', display: 'inline-block', marginBottom: '0.5rem' }}>Join the Grooming Club</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.925rem' }}>
                        Subscribe to get grooming advice, updates on new shipments, and an instant <strong>10% OFF discount code</strong>.
                    </p>
                    
                    {newsletterSubscribed ? (
                        <div className="glass animate-fadeIn" style={{ padding: '1rem', borderColor: 'var(--success)' }}>
                            <span style={{ color: 'var(--success)', fontWeight: 700, fontSize: '0.9rem', display: 'block' }}>
                                🎉 Success! Use discount code <strong style={{ color: '#fff', background: 'var(--success)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>GROW10</strong> at checkout for 10% off.
                            </span>
                        </div>
                    ) : (
                        <form onSubmit={(e) => { e.preventDefault(); setNewsletterSubscribed(true); }} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <input 
                                type="email" 
                                required 
                                placeholder="Enter your email address..." 
                                className="form-control" 
                                style={{ flex: 1, minWidth: '240px', borderRadius: 'var(--radius-full)' }} 
                            />
                            <button type="submit" className="btn btn-primary" style={{ borderRadius: 'var(--radius-full)', paddingLeft: '2rem', paddingRight: '2rem' }}>
                                Subscribe
                            </button>
                        </form>
                    )}
                </div>
            </section>

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
