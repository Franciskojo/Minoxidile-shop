import { useState } from 'react';
import { useSubmitVendorApplicationMutation, useGetMyVendorApplicationQuery } from '../store/slices/vendorApplicationApiSlice.js';
import Loader from '../components/Loader.jsx';
import { FiCheckCircle, FiClock, FiXCircle, FiSend } from 'react-icons/fi';
import { MdStore } from 'react-icons/md';
import toast from 'react-hot-toast';

export default function BecomeVendorPage() {
    const { data, isLoading, refetch } = useGetMyVendorApplicationQuery();
    const [submitApplication, { isLoading: isSubmitting }] = useSubmitVendorApplicationMutation();

    const [formData, setFormData] = useState({
        storeName: '',
        storeDescription: '',
        businessEmail: '',
        businessPhone: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await submitApplication(formData).unwrap();
            toast.success('Application submitted successfully!');
            refetch();
        } catch (err) {
            toast.error(err?.data?.message || 'Submission failed');
        }
    };

    if (isLoading) return <Loader />;

    const application = data?.application;

    if (application && application.status === 'pending') {
        return (
            <div className="page-wrapper loader-center">
                <div className="card animate-slideUp" style={{ maxWidth: 600, padding: '3rem', textAlign: 'center' }}>
                    <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--warning)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                        <FiClock size={40} />
                    </div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1rem' }}>Application Pending</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.6 }}>
                        We've received your application for <strong>{application.storeName}</strong>. Our team is currently reviewing your business details. You'll receive an email once a decision is made.
                    </p>
                    <div className="badge badge-warning" style={{ fontSize: '1rem', padding: '0.75rem 1.5rem' }}>Status: Under Review</div>
                </div>
            </div>
        );
    }

    if (application && application.status === 'rejected') {
        return (
            <div className="page-wrapper loader-center">
                <div className="card animate-slideUp" style={{ maxWidth: 600, padding: '3rem', textAlign: 'center' }}>
                    <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--danger)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                        <FiXCircle size={40} />
                    </div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1rem' }}>Application Rejected</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                        Unfortunately, your application for <strong>{application.storeName}</strong> was not approved at this time.
                    </p>
                    {application.adminComment && (
                        <div style={{ background: 'var(--danger-bg)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem', color: 'var(--danger)', fontSize: '0.875rem' }}>
                            <strong>Admin Feedback:</strong> {application.adminComment}
                        </div>
                    )}
                    <button className="btn btn-primary" onClick={() => refetch()}>Try Again</button>
                </div>
            </div>
        );
    }

    return (
        <div className="page-wrapper">
            <div className="container" style={{ maxWidth: 800, paddingTop: '3rem', paddingBottom: '4rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem' }}>Sell on Minoxidile</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Join thousands of vendors and grow your grooming business today.</p>
                </div>

                <div className="grid grid-cols-2 gap-8" style={{ alignItems: 'start' }}>
                    <div className="card" style={{ padding: '2.5rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <MdStore style={{ color: 'var(--accent-primary)' }} /> Partner Application
                        </h2>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div className="form-group">
                                <label className="form-label">Store Name</label>
                                <input
                                    className="form-control" name="storeName" value={formData.storeName}
                                    onChange={handleChange} required placeholder="e.g. Premium Beard Co."
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Business Email</label>
                                <input
                                    type="email" className="form-control" name="businessEmail" value={formData.businessEmail}
                                    onChange={handleChange} required placeholder="vendor@example.com"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Business Phone</label>
                                <input
                                    className="form-control" name="businessPhone" value={formData.businessPhone}
                                    onChange={handleChange} required placeholder="+1 (555) 000-0000"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Store Description</label>
                                <textarea
                                    className="form-control" name="storeDescription" value={formData.storeDescription}
                                    onChange={handleChange} required rows="4" placeholder="Tell us about your products and brand story..."
                                />
                            </div>
                            <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting} style={{ marginTop: '1rem' }}>
                                {isSubmitting ? 'Submitting...' : 'Submit Application'} <FiSend style={{ marginLeft: '0.5rem' }} />
                            </button>
                        </form>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div className="card glass" style={{ padding: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Why sell with us?</h3>
                            <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: 0, listStyle: 'none' }}>
                                <li style={{ display: 'flex', gap: '0.75rem', fontSize: '0.875rem' }}>
                                    <FiCheckCircle style={{ color: 'var(--success)', flexShrink: 0 }} />
                                    <span>Access to a massive community of grooming enthusiasts.</span>
                                </li>
                                <li style={{ display: 'flex', gap: '0.75rem', fontSize: '0.875rem' }}>
                                    <FiCheckCircle style={{ color: 'var(--success)', flexShrink: 0 }} />
                                    <span>Low commission rates and fast weekly payouts.</span>
                                </li>
                                <li style={{ display: 'flex', gap: '0.75rem', fontSize: '0.875rem' }}>
                                    <FiCheckCircle style={{ color: 'var(--success)', flexShrink: 0 }} />
                                    <span>Professional analytics and marketing tools.</span>
                                </li>
                            </ul>
                        </div>

                        <div style={{ padding: '1.5rem', textAlign: 'center' }}>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                By submitting, you agree to our <a href="#" style={{ color: 'var(--accent-secondary)' }}>Vendor Terms of Service</a>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
