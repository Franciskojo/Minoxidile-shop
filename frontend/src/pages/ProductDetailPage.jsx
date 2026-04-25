import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetProductBySlugQuery, useGetRelatedProductsQuery } from '../store/slices/productsApiSlice.js';
import { useGetProductReviewsQuery, useCreateReviewMutation, useAddToCartMutation } from '../store/slices/categoriesApiSlice.js';
import { useToggleWishlistMutation } from '../store/slices/usersApiSlice.js';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsAuthenticated, selectCurrentUser } from '../store/slices/authSlice.js';
import { syncCart } from '../store/slices/cartSlice.js';
import Loader from '../components/Loader.jsx';
import Rating from '../components/Rating.jsx';
import ProductCard from '../components/ProductCard.jsx';
import ChatWidget from '../components/ChatWidget.jsx';
import Meta from '../components/Meta.jsx';
import toast from 'react-hot-toast';
import { FiShoppingCart, FiHeart, FiShare2, FiMinus, FiPlus, FiCheck, FiMapPin } from 'react-icons/fi';
import { MdVerified } from 'react-icons/md';

export default function ProductDetailPage() {
    const { slug } = useParams();
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const user = useSelector(selectCurrentUser);
    const [selectedImage, setSelectedImage] = useState(0);
    const [qty, setQty] = useState(1);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewTitle, setReviewTitle] = useState('');
    const [reviewComment, setReviewComment] = useState('');

    const { data, isLoading } = useGetProductBySlugQuery(slug);
    const product = data?.product;

    const { data: reviewsData } = useGetProductReviewsQuery(
        { productId: product?._id }, { skip: !product?._id }
    );
    const { data: relatedData } = useGetRelatedProductsQuery(
        product?._id, { skip: !product?._id }
    );

    const [addToCart, { isLoading: addingToCart }] = useAddToCartMutation();
    const [toggleWishlist] = useToggleWishlistMutation();
    const [createReview, { isLoading: submittingReview }] = useCreateReviewMutation();

    const reviews = reviewsData?.reviews || [];
    const related = relatedData?.products || [];

    const isWishlisted = user?.wishlist?.includes(product?._id) ||
        (Array.isArray(user?.wishlist) && user.wishlist.some(item => (item._id || item) === product?._id));

    const handleWishlist = async () => {
        if (!isAuthenticated) { toast.error('Please login to save items'); return; }
        try {
            await toggleWishlist(product._id).unwrap();
            toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
        } catch {
            toast.error('Action failed');
        }
    };

    const handleQty = (delta) => {
        setQty((q) => Math.max(1, Math.min(product?.stock || 1, q + delta)));
    };

    const handleAddToCart = async () => {
        if (!isAuthenticated) { toast.error('Please login to add items to cart'); return; }
        try {
            const result = await addToCart({ productId: product._id, qty }).unwrap();
            dispatch(syncCart(result.cart));
            toast.success(`${qty} item(s) added to cart!`);
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to add to cart');
        }
    };

    const handleReview = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) { toast.error('Please login to write a review'); return; }
        if (!reviewTitle.trim() || !reviewComment.trim()) { toast.error('Please fill in all fields'); return; }
        try {
            await createReview({ productId: product._id, rating: reviewRating, title: reviewTitle, comment: reviewComment }).unwrap();
            toast.success('Review submitted!');
            setReviewTitle(''); setReviewComment(''); setReviewRating(5);
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to submit review');
        }
    };

    if (isLoading) return <div className="page-wrapper"><Loader /></div>;
    if (!product) return (
        <div className="page-wrapper loader-center">
            <div className="empty-state">
                <div className="empty-state-icon">❌</div>
                <h2>Product not found</h2>
                <Link to="/shop"><button className="btn btn-primary">Back to Shop</button></Link>
            </div>
        </div>
    );

    const images = product.images?.length > 0
        ? product.images
        : [{ url: 'https://placehold.co/600x600/111118/7c3aed?text=No+Image', alt: product.name }];

    const effectivePrice = product.salePrice > 0 && product.salePrice < product.price ? product.salePrice : product.price;

    return (
        <div className="page-wrapper">
            <Meta
                title={`${product.name} | Minoxidile Shop`}
                description={product.shortDescription || product.description?.slice(0, 150)}
                keywords={`${product.category?.name || 'product'}, ${product.brand || ''}, buy ${product.name}, minoxidil shop`}
            />
            <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
                {/* Breadcrumb */}
                <div className="breadcrumb">
                    <Link to="/">Home</Link>
                    <span className="breadcrumb-sep">/</span>
                    <Link to="/shop">Shop</Link>
                    <span className="breadcrumb-sep">/</span>
                    {product.category && (
                        <>
                            <Link to={`/shop?category=${product.category._id}`}>{product.category.name}</Link>
                            <span className="breadcrumb-sep">/</span>
                        </>
                    )}
                    <span style={{ color: 'var(--text-primary)' }}>{product.name}</span>
                </div>

                {/* Main content */}
                <div className="product-detail-main" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginBottom: '4rem' }}>
                    {/* Gallery */}
                    <div className="product-gallery">
                        <div className="gallery-main">
                            <img src={images[selectedImage]?.url} alt={images[selectedImage]?.alt || product.name} loading="lazy" />
                        </div>
                        {images.length > 1 && (
                            <div className="gallery-thumbs">
                                {images.map((img, i) => (
                                    <div key={i} className={`gallery-thumb ${i === selectedImage ? 'active' : ''}`} onClick={() => setSelectedImage(i)}>
                                        <img src={img.url} alt={img.alt || `Image ${i + 1}`} loading="lazy" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="product-info" style={{ animation: 'slideUp 0.4s ease' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                            {product.category && <span className="badge badge-primary">{product.category.name}</span>}
                            {product.brand && <span className="badge badge-info">{product.brand}</span>}
                            {product.stock === 0 && <span className="badge badge-danger">Out of Stock</span>}
                            {product.stock > 0 && product.stock <= 5 && <span className="badge badge-warning">Only {product.stock} left</span>}
                        </div>

                        <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem', lineHeight: 1.3 }}>
                            {product.name}
                        </h1>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                            <Rating value={product.rating} numReviews={product.numReviews} size={18} />
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{product.numReviews} reviews</span>
                            {product.location && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.875rem', paddingLeft: '1rem', borderLeft: '1px solid var(--border-color)' }}>
                                    <FiMapPin size={14} style={{ color: 'var(--accent-secondary)' }} />
                                    <span>{product.location}</span>
                                </div>
                            )}
                        </div>

                        {/* Price */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '2rem', fontWeight: 800, color: product.onSale ? 'var(--accent-secondary)' : 'var(--text-primary)' }}>
                                ₵{effectivePrice.toFixed(2)}
                            </span>
                            {product.salePrice > 0 && product.salePrice < product.price && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <span style={{ fontSize: '1.1rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                                        ₵{product.price.toFixed(2)}
                                    </span>
                                    <span className="badge badge-danger">-{Math.round(((product.price - product.salePrice) / product.price) * 100)}%</span>
                                </div>
                            )}
                        </div>

                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                            {product.shortDescription || product.description?.slice(0, 200) + '…'}
                        </p>

                        {/* Qty + Cart */}
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                            <div className="qty-controls" style={{
                                display: 'flex', alignItems: 'center', gap: '0', border: '1px solid var(--border-color)',
                                borderRadius: 'var(--radius-full)', overflow: 'hidden',
                            }}>
                                <button onClick={() => handleQty(-1)} className="btn btn-icon" style={{ borderRadius: 0, padding: '0.65rem 1rem' }}>
                                    <FiMinus size={14} />
                                </button>
                                <span style={{ padding: '0 1rem', fontWeight: 700, minWidth: 40, textAlign: 'center' }}>{qty}</span>
                                <button onClick={() => handleQty(1)} className="btn btn-icon" style={{ borderRadius: 0, padding: '0.65rem 1rem' }}>
                                    <FiPlus size={14} />
                                </button>
                            </div>
                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock === 0 || addingToCart}
                                className="btn btn-primary btn-lg cart-btn"
                                style={{ flex: 1, minWidth: 200 }}
                            >
                                <FiShoppingCart />
                                {product.stock === 0 ? 'Out of Stock' : addingToCart ? 'Adding…' : 'Add to Cart'}
                            </button>
                            <button
                                onClick={handleWishlist}
                                className="btn btn-secondary btn-icon btn-lg wishlist-btn"
                                aria-label="Wishlist"
                                style={{
                                    background: isWishlisted ? 'var(--danger)' : 'var(--bg-card)',
                                    color: isWishlisted ? '#fff' : 'var(--text-primary)',
                                    borderColor: isWishlisted ? 'transparent' : 'var(--border-color)'
                                }}
                            >
                                <FiHeart fill={isWishlisted ? 'currentColor' : 'none'} />
                            </button>
                        </div>

                        {/* Tags */}
                        {product.tags?.length > 0 && (
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
                                {product.tags.map((tag) => (
                                    <span key={tag} style={{
                                        padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)',
                                        background: 'var(--bg-input)', border: '1px solid var(--border-color)',
                                        fontSize: '0.75rem', color: 'var(--text-muted)',
                                    }}>
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Description */}
                <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                    <h2 className="section-title-white" style={{ marginBottom: '1rem' }}>Description</h2>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                        {product.description}
                    </p>
                </div>

                {/* Reviews */}
                <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                    <h2 className="section-title-white" style={{ marginBottom: '1.5rem' }}>
                        Customer Reviews ({product.numReviews})
                    </h2>

                    {/* Write Review Form */}
                    {isAuthenticated && (
                        <form onSubmit={handleReview} style={{ background: 'var(--bg-input)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', marginBottom: '2rem' }}>
                            <h4 style={{ fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>Write a Review</h4>
                            <div style={{ marginBottom: '1rem' }}>
                                <label className="form-label">Rating</label>
                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                                    {[1, 2, 3, 4, 5].map((r) => (
                                        <button key={r} type="button" onClick={() => setReviewRating(r)}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem', color: r <= reviewRating ? 'var(--warning)' : 'var(--text-muted)' }}>
                                            ★
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Title</label>
                                <input className="form-control" value={reviewTitle} onChange={(e) => setReviewTitle(e.target.value)} placeholder="Summary of your experience" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Comment</label>
                                <textarea className="form-control" value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} placeholder="Tell others about your experience…" rows={4} style={{ resize: 'vertical' }} />
                            </div>
                            <button type="submit" className="btn btn-primary" disabled={submittingReview}>
                                {submittingReview ? 'Submitting…' : 'Submit Review'}
                            </button>
                        </form>
                    )}

                    {/* Reviews List */}
                    {reviews.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>No reviews yet. Be the first!</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            {reviews.map((review) => (
                                <div key={review._id} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                                        <div style={{
                                            width: 36, height: 36, borderRadius: '50%',
                                            background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontWeight: 700, color: '#fff', fontSize: '0.875rem',
                                        }}>
                                            {review.user?.name?.[0]?.toUpperCase()}
                                        </div>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{review.user?.name}</span>
                                                {review.isVerifiedPurchase && (
                                                    <MdVerified size={14} style={{ color: 'var(--success)' }} title="Verified Purchase" />
                                                )}
                                            </div>
                                            <Rating value={review.rating} showCount={false} size={13} />
                                        </div>
                                        <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h4 style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.25rem' }}>{review.title}</h4>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>{review.comment}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Related Products */}
                {related.length > 0 && (
                    <section style={{ marginTop: '4rem' }}>
                        <h2 className="section-title" style={{ marginBottom: '2rem' }}>You Might Also Like</h2>
                        <div className="related-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
                            {related.map((p) => <ProductCard key={p._id} product={p} />)}
                        </div>
                    </section>
                )}
            </div>

            {product?.vendor && isAuthenticated && user?._id !== product.vendor._id && (
                <ChatWidget receiverId={product.vendor._id} receiverName={product.vendor.name} />
            )}

            <style>{`
        @media (max-width: 992px) {
          .product-detail-main { grid-template-columns: 1fr !important; gap: 2rem !important; }
          .product-gallery { max-width: 600px; margin: 0 auto; width: 100%; }
          .related-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          .cart-btn { order: 2; width: 100% !important; }
          .qty-controls { order: 1; }
          .wishlist-btn { order: 3; }
          .related-grid { grid-template-columns: 1fr !important; }
          .card { padding: 1.5rem !important; }
          h1 { fontSize: 1.5rem !important; }
        }
      `}</style>
        </div>
    );
}
