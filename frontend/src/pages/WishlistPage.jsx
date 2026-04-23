import { useGetProfileQuery } from '../store/slices/usersApiSlice.js';
import ProductCard from '../components/ProductCard.jsx';
import Loader from '../components/Loader.jsx';
import { FiHeart } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function WishlistPage() {
    const { data: profileData, isLoading } = useGetProfileQuery();

    const wishlist = profileData?.user?.wishlist || [];

    if (isLoading) return <div className="page-wrapper"><Loader /></div>;

    return (
        <div className="page-wrapper">
            <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                    <div style={{
                        width: 48, height: 48, borderRadius: 'var(--radius-md)',
                        background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <FiHeart size={24} fill="currentColor" />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>My Wishlist</h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Items you've saved for later</p>
                    </div>
                </div>

                {wishlist.length === 0 ? (
                    <div className="empty-state card" style={{ padding: '4rem 2rem' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1.5rem', opacity: 0.3 }}>
                            <FiHeart />
                        </div>
                        <h2 style={{ marginBottom: '1rem' }}>Your wishlist is empty</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: 400 }}>
                            Looks like you haven't added anything to your wishlist yet. Explore our shop and save your favorite items!
                        </p>
                        <Link to="/shop">
                            <button className="btn btn-primary">Start Shopping</button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid-4">
                        {wishlist.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
