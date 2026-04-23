import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiInstagram, FiFacebook } from 'react-icons/fi';

export default function Footer() {
    const links = {
        Shop: [['Shop All', '/shop'], ['Featured', '/shop?featured=true'], ['New Arrivals', '/shop?sort=newest']],
        Account: [['My Account', '/account/profile'], ['My Orders', '/account/orders'], ['Wishlist', '/account/wishlist']],
        Company: [['About Us', '/about'], ['Contact', '/contact'], ['Privacy Policy', '/privacy'], ['Terms', '/terms']],
    };

    return (
        <footer style={{
            background: 'var(--bg-secondary)',
            borderTop: '1px solid var(--border-color)',
            padding: '4rem 0 2rem',
            marginTop: 'auto',
        }}>
            <div className="container">
                <div className="footer-grid">
                    {/* Brand */}
                    <div>
                        <div style={{
                            fontWeight: 900, fontSize: '1.5rem',
                            background: 'var(--gradient-primary)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                            marginBottom: '1rem',
                        }}>
                            Minoxidile
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.7, maxWidth: 280 }}>
                            Premium e-commerce experience. Discover products that elevate your lifestyle.
                        </p>
                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
                            {[FiTwitter, FiInstagram, FiFacebook, FiGithub].map((Icon, i) => (
                                <a key={i} href="#"
                                    style={{
                                        width: 36, height: 36, borderRadius: 'var(--radius-md)',
                                        background: 'var(--bg-card)', border: '1px solid var(--border-color)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: 'var(--text-muted)', transition: 'var(--transition)',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-primary)'; e.currentTarget.style.color = 'var(--accent-secondary)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                                >
                                    <Icon size={15} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    {Object.entries(links).map(([heading, rows]) => (
                        <div key={heading}>
                            <h4 style={{ fontWeight: 700, fontSize: '0.825rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
                                {heading}
                            </h4>
                            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {rows.map(([label, to]) => (
                                    <li key={label}>
                                        <Link to={to} style={{ color: 'var(--text-muted)', fontSize: '0.875rem', transition: 'var(--transition)' }}
                                            onMouseEnter={e => e.target.style.color = 'var(--accent-secondary)'}
                                            onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
                                        >
                                            {label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="footer-bottom">
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center' }}>
                        © {new Date().getFullYear()} Minoxidile Shop. All rights reserved.
                    </p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center' }}>
                        Built with MERN Stack ⚡
                    </p>
                </div>
            </div>

            <style>{`
        /* Default mobile-first styles */
        .footer-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          margin-bottom: 2rem;
        }
        .footer-bottom {
          border-top: 1px solid var(--border-color);
          padding-top: 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }
        
        /* Tablet & Desktop Layouts */
        @media (min-width: 577px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 2.5rem;
          }
          .footer-bottom {
            flex-direction: row;
            justify-content: space-between;
          }
        }
        @media (min-width: 993px) {
          .footer-grid {
            grid-template-columns: 2fr 1fr 1fr 1fr;
            gap: 3rem;
            margin-bottom: 3rem;
          }
        }
      `}</style>
        </footer>
    );
}
