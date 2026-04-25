import { Link } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiMapPin } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { useAddToCartMutation } from '../store/slices/categoriesApiSlice.js';
import { useToggleWishlistMutation } from '../store/slices/usersApiSlice.js';
import { selectIsAuthenticated } from '../store/slices/authSlice.js';
import { syncCart } from '../store/slices/cartSlice.js';
import Rating from './Rating.jsx';
import toast from 'react-hot-toast';
import { useState } from 'react';

export default function ProductCard({ product }) {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const [addToCart, { isLoading: addingToCart }] = useAddToCartMutation();
    const [toggleWishlist] = useToggleWishlistMutation();

    // Check if product is in user's wishlist
    const isWishlisted = user?.wishlist?.includes(product._id) ||
        (Array.isArray(user?.wishlist) && user.wishlist.some(item => (item._id || item) === product._id));

    const effectivePrice = product.salePrice > 0 && product.salePrice < product.price
        ? product.salePrice : product.price;

    const discountPct = product.salePrice > 0 && product.salePrice < product.price
        ? Math.round(((product.price - product.salePrice) / product.price) * 100) : 0;

    const image = product.images?.[0]?.url || 'https://placehold.co/400x400/111118/7c3aed?text=No+Image';

    const handleAddToCart = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            toast.error('Please login to add items to cart');
            return;
        }
        try {
            const result = await addToCart({ productId: product._id, qty: 1 }).unwrap();
            dispatch(syncCart(result.cart));
            toast.success('Added to cart!');
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to add to cart');
        }
    };

    const handleWishlist = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) { toast.error('Please login to save items'); return; }
        try {
            await toggleWishlist(product._id).unwrap();
            toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
        } catch {
            toast.error('Action failed');
        }
    };

    return (
        <Link to={`/product/${product.slug}`} style={{ display: 'block' }}>
            <div className="card animate-fadeInScale" style={{ cursor: 'pointer', height: '100%' }}>
                {/* Image */}
                <div style={{ position: 'relative', aspectRatio: '1', overflow: 'hidden', background: 'var(--bg-input)' }}>
                    <img
                        loading="lazy"
                        src={image}
                        alt={product.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                        onMouseEnter={e => e.target.style.transform = 'scale(1.06)'}
                        onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                    />
                    {/* Badges */}
                    <div style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        {discountPct > 0 && (
                            <span className="badge badge-danger">-{discountPct}%</span>
                        )}
                        {product.isFeatured && (
                            <span className="badge badge-primary">Featured</span>
                        )}
                        {product.stock === 0 && (
                            <span className="badge badge-warning">Out of Stock</span>
                        )}
                    </div>
                    {/* Wishlist */}
                    <button
                        onClick={handleWishlist}
                        style={{
                            position: 'absolute', top: '0.75rem', right: '0.75rem',
                            width: 34, height: 34, borderRadius: '50%',
                            background: isWishlisted ? 'var(--danger)' : 'rgba(10,10,15,0.7)',
                            backdropFilter: 'blur(8px)',
                            border: `1px solid ${isWishlisted ? 'transparent' : 'var(--border-color)'}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: isWishlisted ? '#fff' : 'var(--text-muted)',
                            transition: 'var(--transition)',
                        }}
                        onMouseEnter={e => {
                            if (!isWishlisted) e.currentTarget.style.color = 'var(--danger)';
                        }}
                        onMouseLeave={e => {
                            if (!isWishlisted) e.currentTarget.style.color = 'var(--text-muted)';
                        }}
                        aria-label="Wishlist"
                    >
                        <FiHeart size={14} fill={isWishlisted ? 'currentColor' : 'none'} />
                    </button>
                </div>

                {/* Content */}
                <div style={{ padding: '1rem' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--accent-secondary)', fontWeight: 600, marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                        {product.category?.name}
                    </div>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem', lineHeight: 1.4 }}
                        className="truncate">
                        {product.name}
                    </h3>
                    <Rating value={product.rating} numReviews={product.numReviews} size={13} />
                    {product.location && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.4rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                            <FiMapPin size={10} />
                            <span>{product.location}</span>
                        </div>
                    )}
                    {/* Price */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.75rem', marginBottom: '0.75rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '1rem', color: discountPct > 0 ? 'var(--accent-secondary)' : 'var(--text-primary)' }}>
                            ₵{effectivePrice.toFixed(2)}
                        </span>
                        {discountPct > 0 && (
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textDecoration: 'line-through' }}>
                                ₵{product.price.toFixed(2)}
                            </span>
                        )}
                    </div>
                    {/* Add to cart */}
                    <button
                        onClick={handleAddToCart}
                        disabled={product.stock === 0 || addingToCart}
                        className="btn btn-primary btn-sm btn-block"
                    >
                        <FiShoppingCart size={14} />
                        {product.stock === 0 ? 'Out of Stock' : addingToCart ? 'Adding…' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        </Link>
    );
}
