import { Link } from 'react-router-dom';
import { useGetProductsQuery, useDeleteProductMutation } from '../store/slices/productsApiSlice.js';
import Loader from '../components/Loader.jsx';
import Pagination from '../components/Pagination.jsx';
import { useSearchParams } from 'react-router-dom';
import { FiEdit, FiTrash2, FiPlus, FiImage, FiPackage } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminProductListPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const page = searchParams.get('page') || 1;
    const { data, isLoading, refetch } = useGetProductsQuery({ page, limit: 10 });
    const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

    const products = data?.products || [];
    const pages = data?.pages || 1;

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteProduct(id).unwrap();
                toast.success('Product deleted successfully');
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
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Product Management</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>View, add, and manage your product catalog</p>
                </div>
                <Link to="/admin/products/create">
                    <button className="btn btn-primary">
                        <FiPlus /> Add New Product
                    </button>
                </Link>
            </div>

            <div className="card table-wrapper">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product._id}>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: 'var(--bg-input)', flexShrink: 0 }}>
                                            {product.images?.[0] ? (
                                                <img src={product.images[0].url} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                                                    <FiImage size={18} />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 600, color: 'var(--text-primary)', maxWidth: 200 }} className="truncate">{product.name}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>SKU: {product._id.slice(-8).toUpperCase()}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span className="badge badge-info" style={{ textTransform: 'uppercase', fontSize: '0.7rem' }}>
                                        {product.category?.name || 'Uncategorized'}
                                    </span>
                                </td>
                                <td>
                                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>₵{product.price.toFixed(2)}</div>
                                    {product.onSale && (
                                        <div style={{ fontSize: '0.75rem', color: 'var(--danger)', textDecoration: 'line-through' }}>
                                            ₵{product.price.toFixed(2)}
                                        </div>
                                    )}
                                </td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <FiPackage size={14} color={product.stock > 10 ? 'var(--success)' : product.stock > 0 ? 'var(--warning)' : 'var(--danger)'} />
                                        <span style={{ fontWeight: 600, color: product.stock > 10 ? 'var(--success)' : product.stock > 0 ? 'var(--warning)' : 'var(--danger)' }}>
                                            {product.stock}
                                        </span>
                                    </div>
                                </td>
                                <td>
                                    {product.isFeatured ? (
                                        <span className="badge badge-primary">Featured</span>
                                    ) : (
                                        <span className="badge badge-secondary">Standard</span>
                                    )}
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <Link to={`/admin/products/edit/${product._id}`}>
                                            <button className="btn btn-icon btn-secondary btn-sm" title="Edit Product">
                                                <FiEdit size={14} />
                                            </button>
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(product._id)}
                                            className="btn btn-icon btn-secondary btn-sm"
                                            style={{ color: 'var(--danger)' }}
                                            title="Delete Product"
                                        >
                                            <FiTrash2 size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Pagination page={Number(page)} pages={pages} onPageChange={(p) => setSearchParams({ page: p })} />
        </div>
    );
}
