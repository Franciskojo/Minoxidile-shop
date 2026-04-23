import { useGetContactMessagesQuery, useMarkContactMessageReadMutation } from '../store/slices/usersApiSlice.js';
import { FiMail, FiUser, FiCalendar, FiCheckCircle, FiClock, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function AdminMessagesPage() {
    const { data: response, isLoading, error } = useGetContactMessagesQuery();
    const [markAsRead] = useMarkContactMessageReadMutation();

    const handleMarkRead = async (id) => {
        try {
            await markAsRead(id).unwrap();
            toast.success('Message marked as read');
        } catch (err) {
            toast.error('Failed to update status');
        }
    };

    if (isLoading) return <div className="loader-center"><div className="loader"></div></div>;
    if (error) return <div className="error-state">Error loading messages</div>;

    const messages = response?.data || [];

    return (
        <div className="animate-fadeIn">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>Customer Messages</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Manage inquiries from the contact form</p>
                </div>
                <div className="badge badge-accent">
                    {messages.filter(m => !m.isRead).length} New
                </div>
            </div>

            {messages.length === 0 ? (
                <div className="card" style={{ padding: '4rem', textAlign: 'center' }}>
                    <FiMail size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>No Messages Yet</h3>
                    <p style={{ color: 'var(--text-muted)' }}>When customers contact you, their messages will appear here.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {messages.map((msg) => (
                        <div key={msg._id} className="card animate-slideUp" style={{
                            padding: '1.5rem',
                            borderLeft: msg.isRead ? '4px solid transparent' : '4px solid var(--accent-primary)',
                            background: msg.isRead ? 'var(--bg-card)' : 'var(--bg-hover)',
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <div style={{
                                        width: 40, height: 40, borderRadius: '50%',
                                        background: 'var(--accent-glow)', color: 'var(--accent-secondary)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '1rem', fontWeight: 700
                                    }}>
                                        {msg.name[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{msg.subject}</h3>
                                        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                <FiUser size={12} /> {msg.name} ({msg.email})
                                            </span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                <FiCalendar size={12} /> {new Date(msg.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                {!msg.isRead && (
                                    <button
                                        onClick={() => handleMarkRead(msg._id)}
                                        className="btn btn-icon btn-sm"
                                        title="Mark as read"
                                        style={{ color: 'var(--success)' }}
                                    >
                                        <FiCheck />
                                    </button>
                                )}
                            </div>
                            <div style={{
                                padding: '1rem',
                                background: 'var(--bg-secondary)',
                                borderRadius: 'var(--radius-md)',
                                color: 'var(--text-secondary)',
                                lineHeight: 1.6,
                                fontSize: '0.925rem',
                                whiteSpace: 'pre-wrap'
                            }}>
                                {msg.message}
                            </div>
                            {msg.isRead && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--success)', fontSize: '0.75rem', marginTop: '0.75rem', fontWeight: 600 }}>
                                    <FiCheckCircle size={12} /> Marked as read
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
