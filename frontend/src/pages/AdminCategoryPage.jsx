import { useState } from 'react';
import {
    useGetCategoriesQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation
} from '../store/slices/categoriesApiSlice.js';
import Loader from '../components/Loader.jsx';
import { FiEdit, FiTrash2, FiPlus, FiX, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminCategoryPage() {
    const { data, isLoading, refetch } = useGetCategoriesQuery();
    const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
    const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
    const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const categories = data?.categories || [];

    const handleOpenModal = (cat = null) => {
        if (cat) {
            setEditingId(cat._id);
            setName(cat.name);
            setDescription(cat.description || '');
        } else {
            setEditingId(null);
            setName('');
            setDescription('');
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setName('');
        setDescription('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await updateCategory({ id: editingId, name, description }).unwrap();
                toast.success('Category updated');
            } else {
                await createCategory({ name, description }).unwrap();
                toast.success('Category created');
            }
            handleCloseModal();
            refetch();
        } catch (err) {
            toast.error(err?.data?.message || 'Action failed');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure? This may affect products in this category.')) {
            try {
                await deleteCategory(id).unwrap();
                toast.success('Category deleted');
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
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Categories</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Organize products into groups</p>
                </div>
                <button className="btn btn-primary" onClick={() => handleOpenModal()}>
                    <FiPlus /> Add Category
                </button>
            </div>

            <div className="grid-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                {categories.map((cat) => (
                    <div key={cat._id} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--accent-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-secondary)' }}>
                                    🏷️
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button className="btn btn-icon btn-secondary btn-sm" onClick={() => handleOpenModal(cat)}>
                                        <FiEdit size={14} />
                                    </button>
                                    <button className="btn btn-icon btn-secondary btn-sm" style={{ color: 'var(--danger)' }} onClick={() => handleDelete(cat._id)}>
                                        <FiTrash2 size={14} />
                                    </button>
                                </div>
                            </div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>{cat.name}</h3>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                                {cat.description || 'No description provided.'}
                            </p>
                        </div>
                        <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', fontSize: '0.75rem', color: 'var(--accent-secondary)', fontWeight: 600 }}>
                            {/* In a real app we'd fetch product count per category here */}
                            View Products
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal Overlay */}
            {isModalOpen && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
                    <div className="card animate-slideUp" style={{ width: '100%', maxWidth: 450, padding: '2rem', position: 'relative' }}>
                        <button
                            onClick={handleCloseModal}
                            style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                        >
                            <FiX size={20} />
                        </button>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>
                            {editingId ? 'Edit Category' : 'New Category'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Category Name</label>
                                <input
                                    className="form-control"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Skin Care"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Description (Optional)</label>
                                <textarea
                                    className="form-control"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="What's inside this category?"
                                    rows={4}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                <button type="button" className="btn btn-secondary btn-block" onClick={handleCloseModal}>Cancel</button>
                                <button type="submit" className="btn btn-primary btn-block" disabled={isCreating || isUpdating}>
                                    {editingId ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
