import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { usePlaceOrderMutation } from '../store/slices/ordersApiSlice.js';
import { useGetCartQuery } from '../store/slices/categoriesApiSlice.js';
import { clearCartLocal } from '../store/slices/cartSlice.js';
import Loader from '../components/Loader.jsx';
import toast from 'react-hot-toast';
import { FiMapPin, FiCreditCard, FiCheckCircle, FiArrowRight } from 'react-icons/fi';

export default function CheckoutPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const { data: cartData, isLoading: cartLoading } = useGetCartQuery();
    const [placeOrder, { isLoading: isPlacing }] = usePlaceOrderMutation();

    const [address, setAddress] = useState({
        fullName: user?.name || '',
        phone: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'US',
    });

    const [paymentMethod, setPaymentMethod] = useState('stripe');

    const cart = cartData?.cart || { items: [], subTotal: 0 };

    const handleInputChange = (e) => {
        setAddress({ ...address, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const order = await placeOrder({
                shippingAddress: address,
                paymentMethod,
            }).unwrap();
            dispatch(clearCartLocal());
            toast.success('Order placed successfully!');
            navigate(`/order/${order.order._id}`);
        } catch (err) {
            toast.error(err?.data?.message || 'Checkout failed');
        }
    };

    if (cartLoading) return <div className="page-wrapper"><Loader /></div>;
    if (cart.items.length === 0) return <div className="page-wrapper loader-center"><h2>Cart is empty</h2></div>;

    const subtotal = cart.subTotal;
    const shipping = subtotal >= 100 ? 0 : 9.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    return (
        <div className="page-wrapper">
            <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>Checkout</h1>

                <form onSubmit={handleSubmit} className="checkout-layout">
                    <div className="checkout-main">
                        {/* Shipping Address */}
                        <div className="card checkout-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                <FiMapPin size={24} style={{ color: 'var(--accent-primary)' }} />
                                <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Shipping Address</h2>
                            </div>
                            <div className="address-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                    <label className="form-label">Full Name</label>
                                    <input className="form-control" name="fullName" value={address.fullName} onChange={handleInputChange} required />
                                </div>
                                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                    <label className="form-label">Phone Number</label>
                                    <input className="form-control" name="phone" value={address.phone} onChange={handleInputChange} required />
                                </div>
                                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                    <label className="form-label">Street Address</label>
                                    <input className="form-control" name="street" value={address.street} onChange={handleInputChange} required placeholder="Apartment, suite, unit, etc." />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">City</label>
                                    <input className="form-control" name="city" value={address.city} onChange={handleInputChange} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">State / Province</label>
                                    <input className="form-control" name="state" value={address.state} onChange={handleInputChange} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Zip Code</label>
                                    <input className="form-control" name="zipCode" value={address.zipCode} onChange={handleInputChange} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Country</label>
                                    <input className="form-control" name="country" value={address.country} onChange={handleInputChange} required />
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="card checkout-card" style={{ padding: '2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                <FiCreditCard size={24} style={{ color: 'var(--accent-primary)' }} />
                                <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Payment Method</h2>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {[
                                    { id: 'stripe', label: 'Credit Card (Stripe)', icon: '💳' },
                                    { id: 'paypal', label: 'PayPal', icon: '🅿️' },
                                    { id: 'cash_on_delivery', label: 'Cash on Delivery', icon: '💵' },
                                ].map((m) => (
                                    <label key={m.id} style={{
                                        display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem',
                                        borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)',
                                        background: paymentMethod === m.id ? 'var(--bg-input)' : 'transparent',
                                        borderColor: paymentMethod === m.id ? 'var(--accent-primary)' : 'var(--border-color)',
                                        cursor: 'pointer', transition: 'var(--transition)',
                                    }}>
                                        <input type="radio" name="payment" value={m.id} checked={paymentMethod === m.id} onChange={(e) => setPaymentMethod(e.target.value)} />
                                        <span style={{ fontSize: '1.25rem' }}>{m.icon}</span>
                                        <span style={{ fontWeight: 600 }}>{m.label}</span>
                                        {paymentMethod === m.id && <FiCheckCircle style={{ marginLeft: 'auto', color: 'var(--accent-primary)' }} />}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Summary */}
                    <aside className="checkout-sidebar">
                        <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Order Summary</h3>
                            <div className="flex flex-col gap-3">
                                {cart.items.map((item) => (
                                    <div key={item._id} style={{ display: 'flex', gap: '0.75rem', fontSize: '0.875rem' }}>
                                        <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-sm)', background: 'var(--bg-input)', flexShrink: 0, overflow: 'hidden' }}>
                                            <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div className="truncate" style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{item.name}</div>
                                            <div style={{ color: 'var(--text-muted)' }}>Qty: {item.qty}</div>
                                        </div>
                                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>${(item.price * item.qty).toFixed(2)}</div>
                                    </div>
                                ))}
                            </div>
                            <hr className="divider" style={{ margin: '1.25rem 0' }} />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
                                <div className="justify-between flex">
                                    <span className="text-secondary">Subtotal</span>
                                    <span className="text-primary">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="justify-between flex">
                                    <span className="text-secondary">Shipping</span>
                                    <span className="text-primary">{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                                </div>
                                <div className="justify-between flex">
                                    <span className="text-secondary">Tax (8%)</span>
                                    <span className="text-primary">${tax.toFixed(2)}</span>
                                </div>
                                <hr className="divider" />
                                <div className="justify-between flex" style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                                    <span className="text-primary">Total</span>
                                    <span className="text-accent">${total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                        <button type="submit" disabled={isPlacing} className="btn btn-primary btn-block btn-lg place-order-btn">
                            {isPlacing ? 'Placing Order...' : 'Place Order'} <FiArrowRight />
                        </button>
                    </aside>
                </form>
            </div>

            <style>{`
        /* Mobile-first: default single column */
        .checkout-layout {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          width: 100%;
          box-sizing: border-box;
        }
        .checkout-main, .checkout-sidebar {
          width: 100%;
          min-width: 0;
        }
        .checkout-card,
        .checkout-sidebar .card {
          overflow: visible;
        }
        .checkout-card:hover, .checkout-sidebar .card:hover {
          transform: none;
          box-shadow: none;
        }
        .address-grid {
          grid-template-columns: 1fr !important;
        }
        .form-group {
          grid-column: span 1 !important;
        }
        .place-order-btn {
          position: sticky;
          bottom: 1rem;
          z-index: 10;
        }

        /* Tablet: slightly more room */
        @media (min-width: 577px) {
          .checkout-layout { gap: 2rem; }
          .address-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          .form-group {
            grid-column: unset !important;
          }
        }

        /* Desktop: two-column layout */
        @media (min-width: 993px) {
          .checkout-layout {
            display: grid;
            grid-template-columns: 1fr 360px;
            gap: 3rem;
            align-items: start;
          }
          .place-order-btn {
            position: static;
          }
        }
      `}</style>
        </div>
    );
}
