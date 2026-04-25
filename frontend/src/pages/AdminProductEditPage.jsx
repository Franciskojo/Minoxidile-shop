import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
    useGetProductsQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useGetProductBySlugQuery
} from '../store/slices/productsApiSlice.js';
import { useGetCategoriesQuery } from '../store/slices/categoriesApiSlice.js';
import { useUploadImageMutation, useDeleteImageMutation } from '../store/slices/uploadApiSlice.js';
import Loader from '../components/Loader.jsx';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiSave, FiUploadCloud, FiX, FiCheckCircle, FiImage } from 'react-icons/fi';

export default function AdminProductEditPage() {
    const { id } = useParams(); // For edit mode
    const isEditMode = Boolean(id);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // State
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        shortDescription: '',
        brand: '',
        category: '',
        price: '',
        salePrice: '',
        stock: '',
        isFeatured: false,
        tags: '',
        location: '',
    });
    const [images, setImages] = useState([]); // [{url, public_id}]
    const [uploading, setUploading] = useState(false);

    // Queries/Mutations
    const { data: categoriesData } = useGetCategoriesQuery();
    const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
    const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
    const [uploadImage] = useUploadImageMutation();
    const [deleteImage] = useDeleteImageMutation();

    // If edit mode, fetch product (Need to handle slug vs ID. The API currently has getProductBySlug. 
    // Let's assume we can fetch by ID or slug in a real scenario, or we'll fetch all and find if ID is used).
    // Actually, let's fix the API or just fetch all for now if it's simpler, or check if getProductBySlug works with ID.
    const { data: productData, isLoading: isProductLoading } = useGetProductsQuery({ id }, { skip: !isEditMode });

    useEffect(() => {
        if (isEditMode && productData?.products) {
            const product = productData.products.find(p => p._id === id);
            if (product) {
                setFormData({
                    name: product.name,
                    description: product.description,
                    shortDescription: product.shortDescription || '',
                    brand: product.brand || '',
                    category: product.category?._id || product.category || '',
                    price: product.price,
                    salePrice: product.salePrice || '',
                    stock: product.stock,
                    isFeatured: product.isFeatured || false,
                    tags: product.tags?.join(', ') || '',
                    location: product.location || '',
                });
                setImages(product.images || []);
            }
        }
    }, [isEditMode, productData, id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (images.length >= 5) {
            return toast.error('Max 5 images allowed');
        }

        const uploadFormData = new FormData();
        uploadFormData.append('image', file);

        setUploading(true);
        try {
            const res = await uploadImage(uploadFormData).unwrap();
            setImages(prev => [...prev, { url: res.url, public_id: res.public_id }]);
            toast.success('Image uploaded!');
        } catch (err) {
            toast.error(err?.data?.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveImage = async (publicId) => {
        try {
            // Opt-in: remove from UI immediately for better UX
            setImages(prev => prev.filter(img => img.public_id !== publicId));
            await deleteImage(publicId).unwrap();
            toast.success('Image deleted');
        } catch (err) {
            toast.error('Failed to delete image from Cloudinary');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (images.length === 0) return toast.error('Please upload at least one image');

        const cleanData = {
            ...formData,
            price: Number(formData.price),
            salePrice: formData.salePrice ? Number(formData.salePrice) : undefined,
            stock: Number(formData.stock),
            images,
            tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
        };

        try {
            if (isEditMode) {
                await updateProduct({ id, ...cleanData }).unwrap();
                toast.success('Product updated!');
            } else {
                await createProduct(cleanData).unwrap();
                toast.success('Product created!');
            }
            navigate('/admin/products');
        } catch (err) {
            toast.error(err?.data?.message || 'Save failed');
        }
    };

    if (isEditMode && isProductLoading) return <Loader />;

    return (
        <div className="animate-fadeIn">
            <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Link to="/admin/products" className="btn btn-icon btn-secondary">
                    <FiArrowLeft />
                </Link>
                <div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
                        {isEditMode ? 'Edit Product' : 'Create New Product'}
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                        {isEditMode ? `Editing ID: ${id}` : 'Fill in the details below to add a product'}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                <div className="flex flex-col gap-6">
                    {/* Basic Info */}
                    <div className="card" style={{ padding: '2rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem' }}>Basic Information</h3>
                        <div className="form-group">
                            <label className="form-label">Product Name</label>
                            <input
                                className="form-control" name="name" value={formData.name} onChange={handleChange}
                                placeholder="e.g. Premium Wireless Headphones" required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Short Description</label>
                            <input
                                className="form-control" name="shortDescription" value={formData.shortDescription}
                                onChange={handleChange} placeholder="A brief one-sentence summary"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Full Description</label>
                            <textarea
                                className="form-control" name="description" value={formData.description}
                                onChange={handleChange} rows={6} placeholder="Detailed product specifications..." required
                            />
                        </div>
                    </div>

                    {/* Pricing & Stock */}
                    <div className="card" style={{ padding: '2rem' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem' }}>Pricing & Inventory</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div className="form-group">
                                <label className="form-label">Regular Price (₵)</label>
                                <input
                                    type="number" step="0.01" className="form-control" name="price"
                                    value={formData.price} onChange={handleChange} placeholder="0.00" required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Sale Price (₵) - Optional</label>
                                <input
                                    type="number" step="0.01" className="form-control" name="salePrice"
                                    value={formData.salePrice} onChange={handleChange} placeholder="Leave empty if no sale"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Stock Quantity</label>
                                <input
                                    type="number" className="form-control" name="stock"
                                    value={formData.stock} onChange={handleChange} placeholder="0" required
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Brand Name</label>
                                <input
                                    className="form-control" name="brand" value={formData.brand}
                                    onChange={handleChange} placeholder="e.g. Sony"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <aside className="flex flex-col gap-6">
                    {/* Organization */}
                    <div className="card" style={{ padding: '1.5rem' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Organization</h3>
                        <div className="form-group">
                            <label className="form-label">Category</label>
                            <select className="form-control" name="category" value={formData.category} onChange={handleChange} required>
                                <option value="">Select a category</option>
                                {categoriesData?.categories?.map(cat => (
                                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Tags (comma separated)</label>
                            <input
                                className="form-control" name="tags" value={formData.tags}
                                onChange={handleChange} placeholder="wireless, audio, headphones"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Location (e.g. New York, USA)</label>
                            <input
                                className="form-control" name="location" value={formData.location}
                                onChange={handleChange} placeholder="City, Country"
                            />
                        </div>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', marginTop: '1rem' }}>
                            <input
                                type="checkbox" name="isFeatured" checked={formData.isFeatured}
                                onChange={handleChange} style={{ width: 18, height: 18 }}
                            />
                            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Feature on Homepage</span>
                        </label>
                    </div>

                    {/* Media */}
                    <div className="card" style={{ padding: '1.5rem' }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Product Media</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
                            {images.map((img, i) => (
                                <div key={i} style={{ position: 'relative', aspectRatio: '1', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                                    <img src={img.url} alt="Upload" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    <button
                                        type="button" onClick={() => handleRemoveImage(img.public_id)}
                                        style={{ position: 'absolute', top: 5, right: 5, background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', borderRadius: '50%', width: 20, height: 20, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    >
                                        <FiX size={12} />
                                    </button>
                                </div>
                            ))}
                            {images.length < 5 && (
                                <label style={{
                                    aspectRatio: '1', borderRadius: 'var(--radius-md)', border: '2px dashed var(--border-color)',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                    cursor: uploading ? 'not-allowed' : 'pointer', transition: 'var(--transition)',
                                    color: 'var(--text-muted)'
                                }}
                                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
                                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
                                >
                                    {uploading ? <Loader size="sm" /> : (
                                        <>
                                            <FiUploadCloud size={24} />
                                            <span style={{ fontSize: '0.7rem', marginTop: '5px' }}>Upload</span>
                                        </>
                                    )}
                                    <input type="file" hidden accept="image/*" onChange={handleUpload} disabled={uploading} />
                                </label>
                            )}
                        </div>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                            Up to 5 images. Max 5MB each.
                        </p>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-block btn-lg"
                        disabled={isCreating || isUpdating}
                        style={{ marginTop: 'auto' }}
                    >
                        <FiSave /> {isEditMode ? (isUpdating ? 'Updating...' : 'Save Changes') : (isCreating ? 'Creating...' : 'Publish Product')}
                    </button>
                </aside>
            </form>
        </div>
    );
}
