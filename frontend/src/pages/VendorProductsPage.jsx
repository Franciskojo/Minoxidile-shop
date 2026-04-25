import { useNavigate, Link } from 'react-router-dom';
import { useGetVendorProductsQuery } from '../store/slices/vendorApiSlice.js';
import { useDeleteProductMutation } from '../store/slices/productsApiSlice.js';
import Loader from '../components/Loader.jsx';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiPackage, FiShoppingBag, FiSearch } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useState } from 'react';

export default function VendorProductsPage() {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const { data, isLoading, refetch } = useGetVendorProductsQuery({ page, limit: 10 });
    const [deleteProduct] = useDeleteProductMutation();

    const products = data?.products || [];

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteProduct(id).unwrap();
                toast.success('Product deleted successfully');
                refetch();
            } catch (err) {
                toast.error(err?.data?.message || 'Failed to delete product');
            }
        }
    };

    if (isLoading) return <Loader />;

    return (
        <div className="animate-fadeIn vendor-products-page">
            <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', gap: '1rem', flexWrap: 'wrap' }}>
                <div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>My Products</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Manage your inventory and product listings</p>
                </div>
                <Link to="/vendor/products/create" style={{ marginLeft: 'auto' }}>
                    <button className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
                        <FiPlus /> <span className="hide-mobile">Add New Product</span><span className="show-mobile">Add</span>
                    </button>
                </Link>
            </div>

            <div className="card table-wrapper" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Rating</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                                    <div style={{ marginBottom: '1rem', fontSize: '3rem', opacity: 0.2 }}><FiPackage /></div>
                                    <p>No products found. Start by adding your first product.</p>
                                </td>
                            </tr>
                        ) : (
                            products.map((product) => (
                                <tr key={product._id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <img
                                                src={product.images[0]?.url || 'https://placehold.co/40x40'}
                                                alt={product.name}
                                                style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                                            />
                                            <div>
                                                <div style={{ fontWeight: 700 }}>{product.name}</div>
                                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ID: {product._id.slice(-6)}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="badge badge-info">{product.category?.name || 'N/A'}</span>
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>₵{product.price.toFixed(2)}</div>
                                        {product.salePrice > 0 && (
                                            <div style={{ fontSize: '0.75rem', color: 'var(--accent-secondary)' }}>Sale: ₵{product.salePrice.toFixed(2)}</div>
                                        )}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            <div style={{
                                                width: 8, height: 8, borderRadius: '50%',
                                                background: product.stock > 10 ? 'var(--success)' : product.stock > 0 ? 'var(--warning)' : 'var(--danger)'
                                            }} />
                                            <span style={{ fontWeight: 600 }}>{product.stock}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--warning)' }}>
                                            ★ <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{product.rating}</span>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({product.numReviews})</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <Link to={`/product/${product.slug}`} target="_blank">
                                                <button className="btn btn-icon btn-secondary btn-sm" title="View in Shop"><FiEye size={14} /></button>
                                            </Link>
                                            <button
                                                className="btn btn-icon btn-secondary btn-sm"
                                                onClick={() => navigate(`/vendor/products/edit/${product._id}`)}
                                                style={{ color: 'var(--accent-primary)' }}
                                            >
                                                <FiEdit2 size={14} />
                                            </button>
                                            <button
                                                className="btn btn-icon btn-secondary btn-sm"
                                                onClick={() => handleDelete(product._id)}
                                                style={{ color: 'var(--danger)' }}
                                            >
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

            {data?.pages > 1 && (
                <div className="pagination">
                    <button
                        className="btn btn-secondary btn-sm"
                        disabled={page === 1}
                        onClick={() => setPage(prev => prev - 1)}
                    >
                        Previous
                    </button>
                    {[...Array(data.pages).keys()].map((p) => (
                        <button
                            key={p + 1}
                            className={`btn btn-sm ${page === p + 1 ? 'btn-primary' : 'btn-secondary'}`}
                            onClick={() => setPage(p + 1)}
                        >
                            {p + 1}
                        </button>
                    ))}
                    <button
                        className="btn btn-secondary btn-sm"
                        disabled={page === data.pages}
                        onClick={() => setPage(prev => prev + 1)}
                    >
                        Next
                    </button>
                </div>
            )}

            <style>{`
                .show-mobile { display: none; }
                @media (max-width: 640px) {
                    .hide-mobile { display: none; }
                    .show-mobile { display: inline; }
                    .page-header h1 { fontSize: 1.5rem !important; }
                    .page-header p { fontSize: 0.75rem !important; }
                    .table th, .table td { padding: 0.75rem 0.5rem !important; font-size: 0.825rem; }
                }
            `}</style>
        </div>
    );
}
