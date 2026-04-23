import Meta from '../components/Meta.jsx';
import { FiShield, FiEye, FiLock, FiFileText } from 'react-icons/fi';

export default function PrivacyPolicyPage() {
    const sections = [
        {
            icon: <FiEye />,
            title: 'Information We Collect',
            content: 'We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support. This includes your name, email address, shipping address, and payment information.'
        },
        {
            icon: <FiShield />,
            title: 'How We Use Your Information',
            content: 'We use the information we collect to provide, maintain, and improve our services, to process your transactions, and to communicate with you about your orders and promotional offers.'
        },
        {
            icon: <FiLock />,
            title: 'Data Security',
            content: 'We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction. We use industry-standard encryption for all sensitive data.'
        },
        {
            icon: <FiFileText />,
            title: 'Your Choices',
            content: 'You may update or correct your account information at any time by logging into your account or by contacting us. You can also opt out of receiving promotional communications from us.'
        }
    ];

    return (
        <div className="page-wrapper animate-fadeIn">
            <Meta
                title="Privacy Policy | Minoxidile Shop"
                description="Read our privacy policy to understand how we collect, use, and protect your personal information."
            />

            <div className="container" style={{ paddingBottom: '5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem', paddingTop: '3rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem' }}>Privacy Policy</h1>
                    <div style={{ width: 60, height: 4, background: 'var(--accent-primary)', margin: '1rem auto' }} />
                    <p style={{ color: 'var(--text-muted)' }}>Last updated: March 2024</p>
                </div>

                <div className="card" style={{ padding: '3rem', maxWidth: '900px', margin: '0 auto' }}>
                    <div style={{ marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>Introduction</h2>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                            At Minoxidile Shop, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make a purchase. Please read this policy carefully.
                        </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                        {sections.map((section, i) => (
                            <div key={i} style={{ display: 'flex', gap: '1.5rem' }}>
                                <div style={{
                                    width: 48, height: 48, borderRadius: '12px',
                                    background: 'var(--accent-glow)', color: 'var(--accent-secondary)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '1.25rem', flexShrink: 0
                                }}>
                                    {section.icon}
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>{section.title}</h3>
                                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{section.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: '4rem', padding: '2rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Contact Us</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                            If you have any questions about this Privacy Policy, please contact us at:
                        </p>
                        <p style={{ fontWeight: 800, color: 'var(--accent-secondary)' }}>privacy@minoxidile.com</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
