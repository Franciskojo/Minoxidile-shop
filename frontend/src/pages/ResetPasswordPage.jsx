import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useResetPasswordMutation } from '../store/slices/usersApiSlice.js';
import toast from 'react-hot-toast';
import { FiLock, FiArrowRight, FiCheckCircle, FiEye, FiEyeOff } from 'react-icons/fi';

export default function ResetPasswordPage() {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const [resetPassword, { isLoading }] = useResetPasswordMutation();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            return toast.error('Passwords do not match');
        }

        if (password.length < 6) {
            return toast.error('Password must be at least 6 characters');
        }

        try {
            await resetPassword({ token, password }).unwrap();
            setIsSuccess(true);
            toast.success('Password updated successfully');
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            toast.error(err?.data?.message || 'Token is invalid or has expired');
        }
    };

    if (isSuccess) {
        return (
            <div className="auth-page">
                <div className="auth-card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '4rem', color: 'var(--success)', marginBottom: '1.5rem' }}>
                        <FiCheckCircle />
                    </div>
                    <h1 className="auth-title">Success!</h1>
                    <p className="auth-subtitle">
                        Your password has been reset successfully. You will be redirected to the login page shortly.
                    </p>
                    <div style={{ marginTop: '2rem' }}>
                        <Link to="/login" className="btn btn-primary btn-block">
                            Go to Login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1 className="auth-title">Set New Password</h1>
                <p className="auth-subtitle">Please enter your new password below.</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">New Password</label>
                        <div style={{ position: 'relative' }}>
                            <FiLock style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="form-control"
                                style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)',
                                    background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0
                                }}
                            >
                                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Confirm New Password</label>
                        <div style={{ position: 'relative' }}>
                            <FiLock style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="form-control"
                                style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)',
                                    background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0
                                }}
                            >
                                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-block btn-lg"
                        style={{ marginTop: '1.5rem' }}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Updating...' : 'Reset Password'} <FiArrowRight />
                    </button>
                </form>
            </div>
        </div>
    );
}
