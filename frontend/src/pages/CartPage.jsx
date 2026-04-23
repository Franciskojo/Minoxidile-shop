import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiMinus, FiPlus, FiTrash2, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { useGetCartQuery, useUpdateCartItemMutation, useRemoveFromCartMutation } from '../store/slices/categoriesApiSlice.js';
import { syncCart } from '../store/slices/cartSlice.js';
import { selectIsAuthenticated } from '../store/slices/authSlice.js';
import Loader from '../components/Loader.jsx';
import toast from 'react-hot-toast';

export default function CartPage() {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const { data, isLoading } = useGetCartQuery(undefined, { skip: !isAuthenticated });
    const [updateCartItem, { isLoading: isUpdating }] = useUpdateCartItemMutation();
    const [removeFromCart] = useRemoveFromCartMutation();

    const cart = data?.cart || { items: [], subTotal: 0 };

    const handleQtyChange = async (itemId, currentQty, delta) => {
        const newQty = currentQty + delta;
        if (newQty < 1) return;
        try {
            const result = await updateCartItem({ itemId, qty: newQty }).unwrap();
            dispatch(syncCart(result.cart));
        } catch (err) {
            toast.error(err?.data?.message || 'Update failed');
        }
    };

    const handleRemove = async (itemId) => {
        try {
            const result = await removeFromCart(itemId).unwrap();
            dispatch(syncCart(result.cart));
            toast.success('Item removed');
        } catch (err) {
            toast.error(err?.data?.message || 'Removal failed');
        }
    };

    if (isLoading) return <div className="page-wrapper"><Loader /></div>;

    if (!isAuthenticated) return (
        <div className="page-wrapper loader-center">
            <div className="empty-state">
                <FiShoppingBag className="empty-state-icon" />
                <h2>Your cart is waiting</h2>
                <p>Please log in to see your items and continue shopping.</p>
                <Link to="/login"><button className="btn btn-primary">Login Now</button></Link>
            </div>
        </div>
    );

    if (cart.items.length === 0) return (
        <div className="page-wrapper loader-center">
            <div className="empty-state">
                <FiShoppingBag className="empty-state-icon" />
                <h2>Your cart is empty</h2>
                <p>Looks like you haven't added anything to your cart yet.</p>
                <Link to="/shop"><button className="btn btn-primary">Browse Shop</button></Link>
            </div>
        </div>
    );

    return (
        <div className="page-wrapper">
            <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>Shopping Cart</h1>

                <div className="cart-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>
                    {/* Cart Items */}
                    <div className="cart-items flex flex-col gap-4">
                        {cart.items.map((item) => (
                            <div key={item._id} className="card cart-item-card" style={{ padding: '1.25rem', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                <Link to={`/product/${item.product?.slug}`} className="cart-item-image" style={{ width: 100, height: 100, flexShrink: 0, borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--bg-input)' }}>
                                    <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </Link>
                                <div className="cart-item-info" style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', gap: '1rem' }}>
                                        <Link to={`/product/${item.product?.slug}`} style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '1rem' }}>{item.name}</Link>
                                        <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>${(item.price * item.qty).toFixed(2)}</span>
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                                        Unit Price: ${item.price.toFixed(2)}
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div className="qty-picker" style={{ display: 'flex', alignItems: 'center', gap: '0', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                                            <button onClick={() => handleQtyChange(item._id, item.qty, -1)} className="btn btn-icon btn-sm" disabled={isUpdating || item.qty === 1} style={{ padding: '0.5rem 0.75rem' }}>
                                                <FiMinus />
                                            </button>
                                            <span style={{ padding: '0 0.75rem', fontSize: '0.875rem', fontWeight: 600, minWidth: 30, textAlign: 'center' }}>{item.qty}</span>
                                            <button onClick={() => handleQtyChange(item._id, item.qty, 1)} className="btn btn-icon btn-sm" disabled={isUpdating} style={{ padding: '0.5rem 0.75rem' }}>
                                                <FiPlus />
                                            </button>
                                        </div>
                                        <button onClick={() => handleRemove(item._id)} className="btn btn-icon btn-secondary btn-sm" style={{ color: 'var(--danger)', borderRadius: '10px' }}>
                                            <FiTrash2 />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary */}
                    <aside className="cart-summary card" style={{ padding: '1.5rem', position: 'sticky', top: 'calc(var(--navbar-height) + 1rem)' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Order Summary</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                                <span>Subtotal</span>
                                <span>${cart.subTotal?.toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                                <span>Estimated Shipping</span>
                                <span>{cart.subTotal >= 100 ? 'FREE' : '$9.99'}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                                <span>Estimated Tax (8%)</span>
                                <span>${(cart.subTotal * 0.08).toFixed(2)}</span>
                            </div>
                            <hr className="divider" />
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                                <span>Total</span>
                                <span>${(cart.subTotal * 1.08 + (cart.subTotal >= 100 ? 0 : 9.99)).toFixed(2)}</span>
                            </div>
                            <Link to="/checkout" style={{ marginTop: '1rem' }}>
                                <button className="btn btn-primary btn-block btn-lg checkout-btn">
                                    Proceed to Checkout <FiArrowRight />
                                </button>
                            </Link>
                            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                                <Link to="/shop" style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Continue Shopping</Link>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            <style>{`
        @media (max-width: 992px) {
          .cart-layout { grid-template-columns: 1fr !important; }
          .cart-summary { position: static !important; }
        }
        @media (max-width: 576px) {
          .cart-item-card { flex-direction: column !important; align-items: flex-start !important; gap: 1rem !important; }
          .cart-item-image { width: 100% !important; height: 180px !important; }
          h1 { fontSize: 1.5rem !important; }
        }
      `}</style>
        </div>
    );
}
