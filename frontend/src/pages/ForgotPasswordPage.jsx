import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForgotPasswordMutation } from '../store/slices/usersApiSlice.js';
import toast from 'react-hot-toast';
import { FiMail, FiArrowRight, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await forgotPassword({ email }).unwrap();
            setIsSubmitted(true);
            toast.success('Reset link sent to your email');
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to send reset link');
        }
    };

    if (isSubmitted) {
        return (
            <div className="auth-page">
                <div className="auth-card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '4rem', color: 'var(--success)', marginBottom: '1.5rem' }}>
                        <FiCheckCircle />
                    </div>
                    <h1 className="auth-title">Check Your Email</h1>
                    <p className="auth-subtitle">
                        We have sent a password reset link to <strong>{email}</strong>.
                        Please check your inbox and follow the instructions.
                    </p>
                    <div style={{ marginTop: '2rem' }}>
                        <Link to="/login" className="btn btn-primary btn-block">
                            Back to Login
                        </Link>
                    </div>
                    <p style={{ marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                        Didn't receive the email?{' '}
                        <button
                            onClick={() => setIsSubmitted(false)}
                            style={{ background: 'none', border: 'none', color: 'var(--accent-secondary)', fontWeight: 600, cursor: 'pointer' }}
                        >
                            Try again
                        </button>
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem', textDecoration: 'none' }}>
                    <FiArrowLeft /> Back to Login
                </Link>
                <h1 className="auth-title">Forgot Password?</h1>
                <p className="auth-subtitle">Enter your email address and we'll send you a link to reset your password.</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <FiMail style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="email"
                                className="form-control"
                                style={{ paddingLeft: '2.5rem' }}
                                placeholder="email@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-block btn-lg"
                        style={{ marginTop: '1rem' }}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Sending...' : 'Send Reset Link'} <FiArrowRight />
                    </button>
                </form>
            </div>
        </div>
    );
}
