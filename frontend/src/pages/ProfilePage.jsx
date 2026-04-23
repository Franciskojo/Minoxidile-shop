import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useUpdateProfileMutation, useChangePasswordMutation } from '../store/slices/usersApiSlice.js';
import { updateUser } from '../store/slices/authSlice.js';
import Loader from '../components/Loader.jsx';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiPhone, FiSave, FiEye, FiEyeOff } from 'react-icons/fi';

export default function ProfilePage() {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);

    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phone, setPhone] = useState(user?.phone || '');

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();
    const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await updateProfile({ name, email, phone }).unwrap();
            dispatch(updateUser(res.user));
            toast.success('Profile updated successfully');
        } catch (err) {
            toast.error(err?.data?.message || 'Update failed');
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) return toast.error('Passwords do not match');
        try {
            await changePassword({ currentPassword, newPassword }).unwrap();
            toast.success('Password changed successfully');
            setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
        } catch (err) {
            toast.error(err?.data?.message || 'Password change failed');
        }
    };

    return (
        <div className="page-wrapper">
            <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2.5rem' }}>Account Settings</h1>

                <div className="profile-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    {/* Profile Info */}
                    <div className="card profile-card" style={{ padding: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                            <FiUser size={24} style={{ color: 'var(--accent-primary)' }} />
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Profile Information</h2>
                        </div>

                        <form onSubmit={handleProfileSubmit}>
                            <div className="form-group">
                                <label className="form-label" htmlFor="profile-name">Full Name</label>
                                <div style={{ position: 'relative' }}>
                                    <FiUser style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <input id="profile-name" name="name" className="form-control" style={{ paddingLeft: '2.5rem' }} value={name} onChange={(e) => setName(e.target.value)} required />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="profile-email">Email Address</label>
                                <div style={{ position: 'relative' }}>
                                    <FiMail style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <input id="profile-email" name="email" className="form-control" style={{ paddingLeft: '2.5rem' }} value={email} onChange={(e) => setEmail(e.target.value)} required />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="profile-phone">Phone Number</label>
                                <div style={{ position: 'relative' }}>
                                    <FiPhone style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <input id="profile-phone" name="phone" className="form-control" style={{ paddingLeft: '2.5rem' }} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 234 567 890" />
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary profile-btn" disabled={isUpdatingProfile} style={{ marginTop: '1rem' }}>
                                <FiSave /> {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
                            </button>
                        </form>
                    </div>

                    {/* Password Change */}
                    <div className="card profile-card" style={{ padding: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                            <FiLock size={24} style={{ color: 'var(--accent-primary)' }} />
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Security</h2>
                        </div>

                        <form onSubmit={handlePasswordSubmit}>
                            <div className="form-group">
                                <label className="form-label" htmlFor="currentPassword">Current Password</label>
                                <div style={{ position: 'relative' }}>
                                    <FiLock style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <input
                                        id="currentPassword"
                                        name="currentPassword"
                                        className="form-control"
                                        type={showPassword ? 'text' : 'password'}
                                        style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
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
                                <label className="form-label" htmlFor="newPassword">New Password</label>
                                <div style={{ position: 'relative' }}>
                                    <FiLock style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <input
                                        id="newPassword"
                                        name="newPassword"
                                        className="form-control"
                                        type={showPassword ? 'text' : 'password'}
                                        style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        minLength={6}
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
                                <label className="form-label" htmlFor="confirmPassword">Confirm New Password</label>
                                <div style={{ position: 'relative' }}>
                                    <FiLock style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        className="form-control"
                                        type={showPassword ? 'text' : 'password'}
                                        style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
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
                            <button type="submit" className="btn btn-outline password-btn" disabled={isChangingPassword} style={{ marginTop: '1rem', width: '100%' }}>
                                {isChangingPassword ? 'Changing...' : 'Change Password'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <style>{`
        @media (max-width: 992px) {
          .profile-grid { grid-template-columns: 1fr !important; gap: 1.5rem !important; }
          .profile-card { padding: 1.5rem !important; }
          h1 { fontSize: 1.5rem !important; marginBottom: 1.5rem !important; }
          .profile-btn { width: 100% !important; }
        }
      `}</style>
        </div>
    );
}
