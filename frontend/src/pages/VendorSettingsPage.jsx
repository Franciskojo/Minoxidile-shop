import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser } from '../store/slices/authSlice.js';
import { useUpdateVendorSettingsMutation } from '../store/slices/vendorApiSlice.js';
import { updateUser } from '../store/slices/authSlice.js';
import Loader from '../components/Loader.jsx';
import { FiMail, FiPhone, FiFileText, FiSave } from 'react-icons/fi';
import { MdStore } from 'react-icons/md';
import toast from 'react-hot-toast';

export default function VendorSettingsPage() {
    const user = useSelector(selectCurrentUser);
    const dispatch = useDispatch();
    const [updateSettings, { isLoading: isUpdating }] = useUpdateVendorSettingsMutation();

    const [formData, setFormData] = useState({
        storeName: '',
        storeDescription: '',
        businessEmail: '',
        businessPhone: '',
    });

    useEffect(() => {
        if (user) {
            setFormData({
                storeName: user.storeName || '',
                storeDescription: user.storeDescription || '',
                businessEmail: user.businessEmail || '',
                businessPhone: user.businessPhone || '',
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await updateSettings(formData).unwrap();
            dispatch(updateUser(res.user));
            toast.success('Store settings updated successfully!');
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to update settings');
        }
    };

    if (!user) return <Loader />;

    return (
        <div className="animate-fadeIn">
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Store Settings</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Update your public store profile and contact information</p>
            </div>

            <div className="card settings-card" style={{ maxWidth: 800, padding: '2.5rem' }}>
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="settings-split-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div className="form-group">
                            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <MdStore size={14} /> Store Name
                            </label>
                            <input
                                className="form-control"
                                name="storeName"
                                value={formData.storeName}
                                onChange={handleChange}
                                required
                                placeholder="e.g. Premium Beard Co."
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <FiMail size={14} /> Business Email
                            </label>
                            <input
                                type="email"
                                className="form-control"
                                name="businessEmail"
                                value={formData.businessEmail}
                                onChange={handleChange}
                                required
                                placeholder="vendor@example.com"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FiPhone size={14} /> Business Phone
                        </label>
                        <input
                            className="form-control"
                            name="businessPhone"
                            value={formData.businessPhone}
                            onChange={handleChange}
                            required
                            placeholder="+1 (555) 000-0000"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FiFileText size={14} /> Store Description
                        </label>
                        <textarea
                            className="form-control"
                            name="storeDescription"
                            value={formData.storeDescription}
                            onChange={handleChange}
                            required
                            rows="5"
                            placeholder="Tell customers about your brand and what makes your products special..."
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                        <button type="submit" className="btn btn-primary btn-lg save-btn" disabled={isUpdating} style={{ minWidth: 200 }}>
                            {isUpdating ? 'Saving...' : (
                                <>
                                    <FiSave style={{ marginRight: '0.5rem' }} /> Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            <div style={{ marginTop: '2.5rem' }}>
                <div className="card glass pro-tip-card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent-primary)' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Pro Tip</h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                        A detailed and professional store description helps build trust with potential buyers.
                        Make sure your business email is monitored for customer inquiries.
                    </p>
                </div>
            </div>

            <style>{`
                @media (max-width: 640px) {
                    .settings-card { padding: 1.5rem !important; }
                    .settings-split-grid { grid-template-columns: 1fr !important; gap: 0 !important; }
                    .save-btn { width: 100% !important; }
                    h1 { fontSize: 1.5rem !important; }
                }
            `}</style>
        </div>
    );
}
