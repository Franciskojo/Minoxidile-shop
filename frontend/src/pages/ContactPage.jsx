import { useState } from 'react';
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend } from 'react-icons/fi';
import Meta from '../components/Meta.jsx';
import toast from 'react-hot-toast';
import { useSubmitContactFormMutation } from '../store/slices/usersApiSlice.js';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [submitContactForm, { isLoading: submitting }] = useSubmitContactFormMutation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await submitContactForm(formData).unwrap();
            toast.success("Message sent! We'll get back to you soon.");
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to send message. Please try again.');
        }
    };

    const contactInfo = [
        { icon: <FiMail />, title: 'Email Us', content: 'support@minoxidile.com', sub: 'We reply within 24 hours' },
        { icon: <FiPhone />, title: 'Call Us', content: '+1 (555) 123-4567', sub: 'Mon-Fri, 9am - 5pm EST' },
        { icon: <FiMapPin />, title: 'Visit Us', content: '123 Commerce Way, Suite 100', sub: 'New York, NY 10001' },
        { icon: <FiClock />, title: 'Availability', content: '24/7 Support', sub: 'Online chat & Email' },
    ];

    return (
        <div className="page-wrapper animate-fadeIn">
            <Meta
                title="Contact Us | Minoxidile Shop"
                description="Get in touch with the Minoxidile Shop team. We are here to help you with any questions, orders, or feedback."
            />

            <div className="container" style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem' }}>Get in Touch</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                        Have a question? We'd love to hear from you. Send us a message and our team will respond as soon as possible.
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '4rem' }} className="contact-grid">
                    {/* Contact info list */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {contactInfo.map((info, i) => (
                            <div key={i} style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                                <div style={{
                                    width: 48, height: 48, borderRadius: '12px',
                                    background: 'var(--accent-glow)', color: 'var(--accent-secondary)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '1.25rem', flexShrink: 0
                                }}>
                                    {info.icon}
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{info.title}</h3>
                                    <p style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{info.content}</p>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{info.sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Contact Form */}
                    <div className="card" style={{ padding: '2.5rem' }}>
                        <form onSubmit={handleSubmit}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }} className="form-row">
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label className="form-label" htmlFor="name">Your Name</label>
                                    <input
                                        id="name"
                                        name="name"
                                        className="form-control"
                                        placeholder="John Doe"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label className="form-label" htmlFor="email">Email Address</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        className="form-control"
                                        placeholder="john@example.com"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="subject">Subject</label>
                                <input
                                    id="subject"
                                    name="subject"
                                    className="form-control"
                                    placeholder="How can we help?"
                                    required
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="message">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    className="form-control"
                                    rows={6}
                                    placeholder="Tell us more about your inquiry..."
                                    required
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary btn-block btn-lg"
                                disabled={submitting}
                                style={{ marginTop: '1rem' }}
                            >
                                {submitting ? 'Sending...' : 'Send Message'} <FiSend style={{ marginLeft: '0.5rem' }} />
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <style>{`
                @media (max-width: 992px) {
                    .contact-grid { grid-template-columns: 1fr !important; gap: 3rem !important; }
                }
                @media (max-width: 640px) {
                    .form-row { grid-template-columns: 1fr !important; }
                    .card { padding: 1.5rem !important; }
                    h1 { fontSize: 2rem !important; }
                }
            `}</style>
        </div>
    );
}
