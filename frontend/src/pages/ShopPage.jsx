import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGetProductsQuery } from '../store/slices/productsApiSlice.js';
import { useGetCategoriesQuery } from '../store/slices/categoriesApiSlice.js';
import ProductCard from '../components/ProductCard.jsx';
import Pagination from '../components/Pagination.jsx';
import Loader from '../components/Loader.jsx';
import SkeletonLoader from '../components/SkeletonLoader.jsx';
import Meta from '../components/Meta.jsx';
import { FiFilter, FiSearch, FiX } from 'react-icons/fi';

const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price_asc', label: 'Price: Low → High' },
    { value: 'price_desc', label: 'Price: High → Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'popular', label: 'Most Popular' },
];

export default function ShopPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [localSearch, setLocalSearch] = useState(searchParams.get('search') || '');

    const params = {
        page: searchParams.get('page') || 1,
        limit: 12,
        search: searchParams.get('search') || undefined,
        category: searchParams.get('category') || undefined,
        sort: searchParams.get('sort') || 'newest',
        minPrice: searchParams.get('minPrice') || undefined,
        maxPrice: searchParams.get('maxPrice') || undefined,
        rating: searchParams.get('rating') || undefined,
    };

    const { data, isLoading, isFetching } = useGetProductsQuery(params);
    const { data: categoriesData } = useGetCategoriesQuery();

    const categories = categoriesData?.categories || [];
    const products = data?.products || [];
    const totalPages = data?.pages || 1;
    const currentPage = Number(params.page);

    const updateParam = (key, value) => {
        const next = new URLSearchParams(searchParams);
        if (value) next.set(key, value);
        else next.delete(key);
        if (key !== 'page') next.delete('page');
        setSearchParams(next);
    };

    const clearFilters = () => {
        setSearchParams({});
        setLocalSearch('');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        updateParam('search', localSearch.trim());
    };

    const hasFilters = searchParams.get('search') || searchParams.get('category') ||
        searchParams.get('minPrice') || searchParams.get('maxPrice') || searchParams.get('rating');

    return (
        <div className="page-wrapper">
            <Meta
                title={params.search ? `Search results for "${params.search}" | Minoxidile` : 'Shop All Products | Minoxidile'}
                description="Browse our complete catalog of premium products, including minoxidil, beard care, electronics, and daily essentials."
            />
            <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
                {/* Header */}
                <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>Shop</h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                            {data?.total ? `${data.total} products found` : 'Exploring our catalog…'}
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        {hasFilters && (
                            <button className="btn btn-secondary btn-sm" onClick={clearFilters}>
                                <FiX size={14} /> Clear Filters
                            </button>
                        )}
                        <select
                            className="form-control"
                            style={{ width: 'auto', padding: '0.5rem 2rem 0.5rem 0.875rem' }}
                            value={params.sort}
                            onChange={(e) => updateParam('sort', e.target.value)}
                        >
                            {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                        <button className="btn btn-secondary btn-sm" onClick={() => setFiltersOpen(!filtersOpen)}>
                            <FiFilter size={14} /> {filtersOpen ? 'Hide' : 'Filters'}
                        </button>
                    </div>
                </div>

                <div className="shop-main-layout" style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '2rem', alignItems: 'start' }}>
                    {/* Filter Overlay */}
                    {filtersOpen && (
                        <div
                            className="filter-overlay"
                            onClick={() => setFiltersOpen(false)}
                            style={{
                                position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
                                backdropFilter: 'blur(4px)', zIndex: 90
                            }}
                        />
                    )}

                    {/* Sidebar Filters */}
                    <aside style={{
                        position: 'sticky', top: 'calc(var(--navbar-height) + 1rem)',
                    }} className={`shop-sidebar ${filtersOpen ? 'open' : ''}`}>
                        <div className="sidebar-mobile-header" style={{ display: 'none', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Filters</h3>
                            <button className="btn btn-icon btn-sm" onClick={() => setFiltersOpen(false)}>
                                <FiX />
                            </button>
                        </div>

                        {/* Search */}
                        <div className="card" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
                            <h4 style={{ fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                                Search
                            </h4>
                            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem' }}>
                                <input
                                    className="form-control"
                                    placeholder="Search products…"
                                    value={localSearch}
                                    onChange={(e) => setLocalSearch(e.target.value)}
                                    style={{ flex: 1 }}
                                />
                                <button className="btn btn-primary btn-sm" type="submit"><FiSearch /></button>
                            </form>
                        </div>

                        {/* Categories */}
                        <div className="card" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
                            <h4 style={{ fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                                Categories
                            </h4>
                            <button
                                onClick={() => { updateParam('category', ''); setFiltersOpen(false); }}
                                style={{
                                    width: '100%', textAlign: 'left', padding: '0.4rem 0.5rem',
                                    borderRadius: 'var(--radius-sm)', background: !searchParams.get('category') ? 'var(--accent-glow)' : 'transparent',
                                    color: !searchParams.get('category') ? 'var(--accent-secondary)' : 'var(--text-secondary)',
                                    border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500,
                                    transition: 'var(--transition)',
                                }}
                            >
                                All Categories
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat._id}
                                    onClick={() => { updateParam('category', cat._id); setFiltersOpen(false); }}
                                    style={{
                                        width: '100%', textAlign: 'left', padding: '0.4rem 0.5rem',
                                        borderRadius: 'var(--radius-sm)',
                                        background: searchParams.get('category') === cat._id ? 'var(--accent-glow)' : 'transparent',
                                        color: searchParams.get('category') === cat._id ? 'var(--accent-secondary)' : 'var(--text-secondary)',
                                        border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500,
                                        transition: 'var(--transition)',
                                    }}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>

                        {/* Price */}
                        <div className="card" style={{ padding: '1.25rem', marginBottom: '1rem' }}>
                            <h4 style={{ fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                                Price Range
                            </h4>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input
                                    className="form-control"
                                    placeholder="Min"
                                    type="number"
                                    min="0"
                                    defaultValue={searchParams.get('minPrice') || ''}
                                    onBlur={(e) => updateParam('minPrice', e.target.value)}
                                />
                                <input
                                    className="form-control"
                                    placeholder="Max"
                                    type="number"
                                    min="0"
                                    defaultValue={searchParams.get('maxPrice') || ''}
                                    onBlur={(e) => updateParam('maxPrice', e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Rating */}
                        <div className="card" style={{ padding: '1.25rem' }}>
                            <h4 style={{ fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                                Min Rating
                            </h4>
                            {[4, 3, 2, 1].map((r) => (
                                <button
                                    key={r}
                                    onClick={() => { updateParam('rating', r); setFiltersOpen(false); }}
                                    style={{
                                        width: '100%', textAlign: 'left', padding: '0.4rem 0.5rem',
                                        borderRadius: 'var(--radius-sm)',
                                        background: Number(searchParams.get('rating')) === r ? 'var(--accent-glow)' : 'transparent',
                                        color: Number(searchParams.get('rating')) === r ? 'var(--accent-secondary)' : 'var(--text-secondary)',
                                        border: 'none', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500, transition: 'var(--transition)',
                                    }}
                                >
                                    {'⭐'.repeat(r)} & Up
                                </button>
                            ))}
                        </div>
                    </aside>

                    {/* Products Grid */}
                    <div>
                        {isLoading || isFetching ? (
                            <SkeletonLoader count={9} />
                        ) : products.length === 0 ? (
                            <div className="empty-state" style={{ minHeight: 400 }}>
                                <div className="empty-state-icon">🔍</div>
                                <h3 style={{ color: 'var(--text-primary)', fontWeight: 700 }}>No products found</h3>
                                <p style={{ color: 'var(--text-muted)' }}>Try adjusting your filters or search terms</p>
                                <button className="btn btn-outline" onClick={clearFilters}>Clear Filters</button>
                            </div>
                        ) : (
                            <>
                                <div className="products-grid grid-3">
                                    {products.map((p) => <ProductCard key={p._id} product={p} />)}
                                </div>
                                <Pagination page={currentPage} pages={totalPages} onPageChange={(p) => updateParam('page', p)} />
                            </>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
        @media (max-width: 1024px) {
          .shop-main-layout { grid-template-columns: 1fr !important; }
          .shop-sidebar { 
            position: fixed !important;
            top: 0 !important;
            left: -300px;
            width: 280px;
            height: 100vh;
            background: var(--bg-primary);
            z-index: 100;
            padding: 1.5rem;
            transition: all 0.3s ease;
            overflow-y: auto;
            border-right: 1px solid var(--border-color);
          }
          .shop-sidebar.open { left: 0; }
          .sidebar-mobile-header { display: flex !important; }
          .products-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .products-grid { grid-template-columns: 1fr !important; }
          h1 { fontSize: 1.5rem !important; }
        }
      `}</style>
        </div>
    );
}
