import { useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { usePayOrderMutation } from '../store/slices/ordersApiSlice.js';
import { FiCheckCircle, FiArrowRight } from 'react-icons/fi';
import Loader from '../components/Loader.jsx';

export default function OrderSuccessPage() {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id'); // If using Stripe success {CHECKOUT_SESSION_ID}
    // For this simple implementation, we might just use the order ID if we passed it in URL
    const { id } = useParams();

    const [payOrder, { isLoading }] = usePayOrderMutation();

    useEffect(() => {
        // In a real production app, you'd use a Stripe Webhook to mark order as paid.
        // Here we'll simulate the update on the success page for demonstration.
        if (id) {
            payOrder({ id, paymentResult: { status: 'COMPLETED', id: sessionId || 'stripe_success' } });
        }
    }, [id, sessionId, payOrder]);

    if (isLoading) return <Loader />;

    return (
        <div className="page-wrapper loader-center">
            <div className="card animate-slideUp" style={{ maxWidth: 500, padding: '3rem', textAlign: 'center' }}>
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--success)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                    <FiCheckCircle size={40} />
                </div>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>Payment Received!</h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem', lineHeight: 1.6 }}>
                    Thank you for your purchase. Your order is being processed and you will receive an email confirmation shortly.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <Link to={`/order/${id}`}>
                        <button className="btn btn-primary btn-block">
                            View Order Details <FiArrowRight />
                        </button>
                    </Link>
                    <Link to="/shop">
                        <button className="btn btn-secondary btn-block">Continue Shopping</button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
