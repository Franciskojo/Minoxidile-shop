import { useState } from 'react';
import {
    useGetAllCouponsQuery,
    useCreateCouponMutation,
    useUpdateCouponMutation,
    useDeleteCouponMutation
} from '../store/slices/categoriesApiSlice.js';
import Loader from '../components/Loader.jsx';
import { FiEdit, FiTrash2, FiPlus, FiX, FiTag, FiCalendar } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminCouponPage() {
    const { data, isLoading, refetch } = useGetAllCouponsQuery();
    const [createCoupon, { isLoading: isCreating }] = useCreateCouponMutation();
    const [updateCoupon, { isLoading: isUpdating }] = useUpdateCouponMutation();
    const [deleteCoupon, { isLoading: isDeleting }] = useDeleteCouponMutation();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        code: '',
        discountType: 'percentage',
        discountValue: '',
        minPurchase: '',
        expiryDate: '',
        usageLimit: '',
        active: true,
    });

    const coupons = data?.coupons || [];

    const handleOpenModal = (coupon = null) => {
        if (coupon) {
            setEditingId(coupon._id);
            setFormData({
                code: coupon.code,
                discountType: coupon.discountType,
                discountValue: coupon.discountValue,
                minPurchase: coupon.minPurchase || '',
                expiryDate: coupon.expiryDate ? new Date(coupon.expiryDate).toISOString().split('T')[0] : '',
                usageLimit: coupon.usageLimit || '',
                active: coupon.active,
            });
        } else {
            setEditingId(null);
            setFormData({
                code: '',
                discountType: 'percentage',
                discountValue: '',
                minPurchase: '',
                expiryDate: '',
                usageLimit: '',
                active: true,
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dataToSubmit = {
                ...formData,
                discountValue: Number(formData.discountValue),
                minPurchase: formData.minPurchase ? Number(formData.minPurchase) : undefined,
                usageLimit: formData.usageLimit ? Number(formData.usageLimit) : undefined,
            };

            if (editingId) {
                await updateCoupon({ id: editingId, ...dataToSubmit }).unwrap();
                toast.success('Coupon updated');
            } else {
                await createCoupon(dataToSubmit).unwrap();
                toast.success('Coupon created');
            }
            handleCloseModal();
            refetch();
        } catch (err) {
            toast.error(err?.data?.message || 'Action failed');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this coupon?')) {
            try {
                await deleteCoupon(id).unwrap();
                toast.success('Coupon removed');
                refetch();
            } catch (err) {
                toast.error(err?.data?.message || 'Delete failed');
            }
        }
    };

    if (isLoading) return <Loader />;

    return (
        <div className="animate-fadeIn">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Marketing Coupons</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Create and manage discount codes</p>
                </div>
                <button className="btn btn-primary" onClick={() => handleOpenModal()}>
                    <FiPlus /> Create Coupon
                </button>
            </div>

            <div className="card table-wrapper">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Code</th>
                            <th>Discount</th>
                            <th>Min. Purchase</th>
                            <th>Expiry</th>
                            <th>Limit</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {coupons.length === 0 ? (
                            <tr><td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No coupons available</td></tr>
                        ) : (
                            coupons.map((coupon) => (
                                <tr key={coupon._id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-sm)', background: 'var(--accent-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-secondary)' }}>
                                                <FiTag size={16} />
                                            </div>
                                            <span style={{ fontWeight: 800, letterSpacing: '0.05em', color: 'var(--text-primary)' }}>{coupon.code}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span style={{ fontWeight: 700 }}>
                                            {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `$${coupon.discountValue}`}
                                        </span>
                                    </td>
                                    <td>{coupon.minPurchase ? `$${coupon.minPurchase}` : 'None'}</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem' }}>
                                            <FiCalendar size={14} />
                                            {coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString() : 'Never'}
                                        </div>
                                    </td>
                                    <td>{coupon.usageLimit || '∞'}</td>
                                    <td>
                                        <span className={`status-badge status-${coupon.active ? 'delivered' : 'cancelled'}`}>
                                            {coupon.active ? 'Active' : 'Disabled'}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button className="btn btn-icon btn-secondary btn-sm" onClick={() => handleOpenModal(coupon)}>
                                                <FiEdit size={14} />
                                            </button>
                                            <button className="btn btn-icon btn-secondary btn-sm" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(coupon._id)}>
                                                <FiTrash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
                    <div className="card animate-slideUp" style={{ width: '100%', maxWidth: 500, padding: '2rem', position: 'relative' }}>
                        <button onClick={handleCloseModal} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                            <FiX size={20} />
                        </button>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>
                            {editingId ? 'Edit Coupon' : 'New Discount Code'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Coupon Code</label>
                                <input
                                    className="form-control" name="code" value={formData.code}
                                    onChange={handleChange} placeholder="SUMMER25" required style={{ textTransform: 'uppercase' }}
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div className="form-group">
                                    <label className="form-label">Discount Type</label>
                                    <select className="form-control" name="discountType" value={formData.discountType} onChange={handleChange}>
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="fixed">Fixed Amount ($)</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Discount Value</label>
                                    <input type="number" className="form-control" name="discountValue" value={formData.discountValue} onChange={handleChange} required />
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div className="form-group">
                                    <label className="form-label">Min Purchase ($)</label>
                                    <input type="number" className="form-control" name="minPurchase" value={formData.minPurchase} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Expiry Date</label>
                                    <input type="date" className="form-control" name="expiryDate" value={formData.expiryDate} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Usage Limit</label>
                                <input type="number" className="form-control" name="usageLimit" value={formData.usageLimit} onChange={handleChange} placeholder="Unlimited if empty" />
                            </div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', margin: '1rem 0' }}>
                                <input type="checkbox" name="active" checked={formData.active} onChange={handleChange} style={{ width: 18, height: 18 }} />
                                <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Set as Active</span>
                            </label>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button type="button" className="btn btn-secondary btn-block" onClick={handleCloseModal}>Cancel</button>
                                <button type="submit" className="btn btn-primary btn-block" disabled={isCreating || isUpdating}>
                                    {editingId ? 'Save Changes' : 'Generate Coupon'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
