import { FiTarget, FiUsers, FiAward, FiShield } from 'react-icons/fi';
import Meta from '../components/Meta.jsx';

export default function AboutPage() {
    const stats = [
        { label: 'Happy Customers', value: '10k+', icon: <FiUsers /> },
        { label: 'Quality Products', value: '500+', icon: <FiAward /> },
        { label: 'Success Rate', value: '99%', icon: <FiTarget /> },
        { label: 'Secure Shopping', value: '100%', icon: <FiShield /> },
    ];

    return (
        <div className="page-wrapper animate-fadeIn">
            <Meta
                title="About Us | Minoxidile Shop"
                description="Learn more about Minoxidile Shop, our mission to provide premium products, and our commitment to customer satisfaction."
            />

            {/* Hero Section */}
            <section style={{
                position: 'relative',
                height: '400px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                marginBottom: '4rem'
            }}>
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: 'url(/about-hero.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'brightness(0.5)'
                }} />
                <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                    <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', fontWeight: 900, color: '#fff', marginBottom: '1rem' }}>
                        Our Story
                    </h1>
                    <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto' }}>
                        Providing the community with premium health, lifestyle, and grooming essentials since 2020.
                    </p>
                </div>
            </section>

            <div className="container">
                {/* Mission Section */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center', marginBottom: '6rem' }} className="about-grid">
                    <div>
                        <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
                            We're on a mission to redefine <span style={{ color: 'var(--accent-secondary)' }}>Quality.</span>
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                            At Minoxidile Shop, we believe that everyone deserves access to high-quality products that actually work. What started as a small local supplier has grown into a premium digital destination for those who don't want to settle for second best.
                        </p>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1.1rem' }}>
                            We curate our catalog with extreme care, ensuring that every brand we host meets our rigorous standards for safety, effectiveness, and sustainability.
                        </p>
                    </div>
                    <div className="card" style={{ padding: '2.5rem', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                            {stats.map((stat, i) => (
                                <div key={i} style={{ textAlign: 'center' }}>
                                    <div style={{
                                        width: 50, height: 50, borderRadius: '50%',
                                        background: 'var(--accent-glow)', color: 'var(--accent-secondary)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        margin: '0 auto 1rem', fontSize: '1.5rem'
                                    }}>
                                        {stat.icon}
                                    </div>
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>{stat.value}</h3>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Values Section */}
                <section style={{ marginBottom: '6rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Why Choose Us?</h2>
                        <div style={{ width: 60, height: 4, background: 'var(--accent-primary)', margin: '1rem auto' }} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                        {[
                            { title: 'Premium Curation', desc: 'Every product is tested and verified by our team of experts before it reaches the shop.' },
                            { title: 'Global Shipping', desc: 'We deliver to over 50 countries with tracked and insured shipping for your peace of mind.' },
                            { title: 'Customer First', desc: 'Our support team is available 24/7 to help you with any questions or concerns you might have.' },
                        ].map((v, i) => (
                            <div key={i} className="card" style={{ padding: '2rem', textAlign: 'center', transition: 'var(--transition)' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>{v.title}</h3>
                                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <style>{`
                @media (max-width: 768px) {
                    .about-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
                    section { margin-bottom: 3rem !important; }
                }
            `}</style>
        </div>
    );
}
