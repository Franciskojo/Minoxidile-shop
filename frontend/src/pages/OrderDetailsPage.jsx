import { useParams, Link, useLocation } from 'react-router-dom';
import { useGetOrderByIdQuery, usePayOrderMutation, useGetStripeSessionMutation } from '../store/slices/ordersApiSlice.js';
import Loader from '../components/Loader.jsx';
import { FiPackage, FiTruck, FiCheck, FiMapPin, FiCreditCard, FiClock } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function OrderDetailsPage() {
    const { id } = useParams();
    const { data: orderData, isLoading, refetch } = useGetOrderByIdQuery(id);
    const [payOrder, { isLoading: isPaying }] = usePayOrderMutation();
    const [getStripeSession, { isLoading: isStripeLoading }] = useGetStripeSessionMutation();

    const order = orderData?.order;
    const location = useLocation();

    // Determine the correct back link based on the current URL
    let backLink = '/account/orders';
    let backText = 'My Orders';
    if (location.pathname.startsWith('/admin')) {
        backLink = '/admin/orders';
        backText = 'All Orders';
    } else if (location.pathname.startsWith('/vendor')) {
        backLink = '/vendor/orders';
        backText = 'Vendor Orders';
    }

    const handlePay = async () => {
        try {
            const { url } = await getStripeSession(id).unwrap();
            if (url) {
                window.location.href = url; // Redirect to Stripe
            }
        } catch (err) {
            toast.error(err?.data?.message || 'Payment failed to initiate');
        }
    };

    if (isLoading) return <div className="page-wrapper"><Loader /></div>;
    if (!order) return <div className="page-wrapper loader-center"><h2>Order not found</h2></div>;

    const statusColors = {
        pending: 'var(--warning)',
        processing: 'var(--info)',
        shipped: 'var(--accent-secondary)',
        delivered: 'var(--success)',
        cancelled: 'var(--danger)',
    };

    return (
        <div className="page-wrapper">
            <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                            <Link to={backLink} style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{backText}</Link>
                            <span className="breadcrumb-sep">/</span>
                            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{order.orderNumber}</span>
                        </div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Order Details</h1>
                    </div>
                    <div style={{
                        padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)',
                        background: `rgba(${statusColors[order.status]}, 0.1)`,
                        border: `1px solid ${statusColors[order.status]}`,
                        color: statusColors[order.status],
                        fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem',
                    }}>
                        {order.status}
                    </div>
                </div>

                <div className="order-details-layout">
                    <div className="order-details-main flex flex-col gap-6">
                        {/* Status Steps */}
                        <div className="card status-stepper-card" style={{ padding: '2rem' }}>
                            <div className="status-stepper" style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
                                {[
                                    { id: 'pending', label: 'Placed', icon: FiPackage },
                                    { id: 'processing', label: 'Processing', icon: FiClock },
                                    { id: 'shipped', label: 'Shipped', icon: FiTruck },
                                    { id: 'delivered', label: 'Delivered', icon: FiCheck },
                                ].map((step, i, arr) => {
                                    const isActive = order.status === step.id || (
                                        (order.status === 'processing' && i === 0) ||
                                        (order.status === 'shipped' && i <= 1) ||
                                        (order.status === 'delivered')
                                    );
                                    const isCurrent = order.status === step.id;

                                    return (
                                        <div key={step.id} className="status-step" style={{
                                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem',
                                            zIndex: 1, flex: 1, position: 'relative',
                                        }}>
                                            <div style={{
                                                width: 40, height: 40, borderRadius: '50%',
                                                background: isCurrent ? 'var(--gradient-primary)' : isActive ? 'var(--accent-glow)' : 'var(--bg-input)',
                                                border: `2px solid ${isCurrent ? 'transparent' : isActive ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                color: isCurrent ? '#fff' : isActive ? 'var(--accent-secondary)' : 'var(--text-muted)',
                                                transition: 'var(--transition)',
                                            }}>
                                                <step.icon size={18} />
                                            </div>
                                            <span className="step-label" style={{ fontSize: '0.75rem', fontWeight: 600, color: isActive ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                                                {step.label}
                                            </span>
                                        </div>
                                    );
                                })}
                                {/* Connector Line */}
                                <div className="stepper-line" style={{
                                    position: 'absolute', top: 20, left: '12.5%', right: '12.5%', height: 2,
                                    background: 'var(--border-color)', zIndex: 0,
                                }} />
                            </div>
                        </div>

                        {/* Items */}
                        <div className="card" style={{ padding: '2rem' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Order Items</h3>
                            <div className="flex flex-col gap-4">
                                {order.items.map((item) => (
                                    <div key={item._id} className="order-item-row" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                        <div style={{ width: 80, height: 80, borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--bg-input)', flexShrink: 0 }}>
                                            <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{item.name}</div>
                                            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>${item.price.toFixed(2)} x {item.qty}</div>
                                        </div>
                                        <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>${(item.price * item.qty).toFixed(2)}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Information Grid */}
                        <div className="order-info-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div className="card" style={{ padding: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                    <FiMapPin size={18} style={{ color: 'var(--accent-primary)' }} />
                                    <h4 style={{ fontWeight: 700 }}>Shipping to</h4>
                                </div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                    <strong>{order.shippingAddress.fullName}</strong><br />
                                    {order.shippingAddress.street}<br />
                                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                                    {order.shippingAddress.country}<br />
                                    <span style={{ color: 'var(--text-muted)' }}>Phone: {order.shippingAddress.phone}</span>
                                </div>
                            </div>
                            <div className="card" style={{ padding: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                                    <FiCreditCard size={18} style={{ color: 'var(--accent-primary)' }} />
                                    <h4 style={{ fontWeight: 700 }}>Payment Method</h4>
                                </div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                    <div style={{ textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.5rem' }}>{order.paymentMethod.replace(/_/g, ' ')}</div>
                                    {order.isPaid ? (
                                        <div className="badge badge-success" style={{ gap: '0.4rem', justifyContent: 'flex-start' }}><FiCheck /> Paid at {new Date(order.paidAt).toLocaleDateString()}</div>
                                    ) : (
                                        <div className="badge badge-danger" style={{ justifyContent: 'flex-start' }}>Not Paid</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pricing Column */}
                    <aside className="order-summary-sidebar">
                        <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Price Details</h3>
                            <div className="flex flex-col gap-3" style={{ fontSize: '0.875rem' }}>
                                <div className="justify-between flex">
                                    <span className="text-secondary">Items Subtotal</span>
                                    <span className="text-primary">${order.itemsPrice.toFixed(2)}</span>
                                </div>
                                <div className="justify-between flex">
                                    <span className="text-secondary">Shipping</span>
                                    <span className="text-primary">${order.shippingPrice.toFixed(2)}</span>
                                </div>
                                <div className="justify-between flex">
                                    <span className="text-secondary">Tax</span>
                                    <span className="text-primary">${order.taxPrice.toFixed(2)}</span>
                                </div>
                                {order.discountAmount > 0 && (
                                    <div className="justify-between flex text-success">
                                        <span>Discount</span>
                                        <span>-${order.discountAmount.toFixed(2)}</span>
                                    </div>
                                )}
                                <hr className="divider" />
                                <div className="justify-between flex" style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                                    <span className="text-primary">Total Paid</span>
                                    <span className="text-accent">${order.totalPrice.toFixed(2)}</span>
                                </div>
                            </div>

                            {!order.isPaid && (
                                <button
                                    onClick={handlePay}
                                    disabled={isStripeLoading}
                                    className="btn btn-primary btn-block"
                                    style={{ marginTop: '1.5rem' }}
                                >
                                    {isStripeLoading ? 'Preparing Checkout...' : 'Pay with Stripe'}
                                </button>
                            )}
                        </div>

                        <div className="card" style={{ padding: '1.25rem', textAlign: 'center' }}>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                Need help with your order?<br />
                                <Link to="/contact" style={{ color: 'var(--accent-secondary)' }}>Contact Support</Link>
                            </p>
                        </div>
                    </aside>
                </div>
            </div>

            <style>{`
        /* Mobile-first: default single column */
        .order-details-layout {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          width: 100%;
          box-sizing: border-box;
        }
        
        @media (min-width: 577px) {
          .order-details-layout { gap: 2rem; }
        }

        /* Desktop: two-column layout */
        @media (min-width: 993px) {
          .order-details-layout {
            display: grid;
            grid-template-columns: 1fr 340px;
            gap: 2rem;
            align-items: start;
          }
        }

        @media (max-width: 992px) {
          .order-summary-sidebar { order: -1; }
        }
        @media (max-width: 640px) {
          .order-info-grid { grid-template-columns: 1fr !important; }
          .step-label { display: none; }
          .stepper-line { left: 15% !important; right: 15% !important; }
          .status-stepper-card { padding: 1.5rem !important; }
          .order-item-row { gap: 1rem !important; }
          h1 { font-size: 1.5rem !important; }
        }
      `}</style>
        </div>
    );
}
