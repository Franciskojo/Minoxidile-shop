import Meta from '../components/Meta.jsx';
import { FiFileText, FiAlertCircle, FiShield, FiExternalLink } from 'react-icons/fi';

export default function TermsPage() {
    return (
        <div className="page-wrapper animate-fadeIn">
            <Meta
                title="Terms of Service | Minoxidile Shop"
                description="Our terms of service outline the rules and regulations for using our platform."
            />

            <div className="container" style={{ paddingBottom: '5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem', paddingTop: '3rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem' }}>Terms of Service</h1>
                    <div style={{ width: 60, height: 4, background: 'var(--accent-primary)', margin: '1rem auto' }} />
                    <p style={{ color: 'var(--text-muted)' }}>Last updated: March 2024</p>
                </div>

                <div className="card" style={{ padding: '3rem', maxWidth: '900px', margin: '0 auto' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                        <section>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <FiFileText className="text-accent" /> 1. Agreement to Terms
                            </h2>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                                By accessing or using our website, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access our service.
                            </p>
                        </section>

                        <section>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <FiShield className="text-accent" /> 2. Intellectual Property
                            </h2>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                                The service and its original content, features, and functionality are and will remain the exclusive property of Minoxidile Shop and its licensors.
                            </p>
                        </section>

                        <section>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <FiAlertCircle className="text-accent" /> 3. Limitation of Liability
                            </h2>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                                In no event shall Minoxidile Shop be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                            </p>
                        </section>

                        <section>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <FiExternalLink className="text-accent" /> 4. Links To Other Web Sites
                            </h2>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                                Our Service may contain links to third-party web sites or services that are not owned or controlled by Minoxidile Shop. We have no control over, and assume no responsibility for the content, privacy policies, or practices of any third party web sites or services.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
