import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'var(--bg-primary)', color: 'var(--text-primary)', padding: '2rem', textAlign: 'center'
                }}>
                    <div className="card" style={{ maxWidth: 500, padding: '3rem 2rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
                        <h1 style={{ fontWeight: 800, marginBottom: '1rem' }}>Oops! Something went wrong.</h1>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.6 }}>
                            We encountered an unexpected error. Please try refreshing the page or navigating back home.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <button className="btn btn-secondary" onClick={() => window.location.reload()}>
                                Refresh Page
                            </button>
                            <button className="btn btn-primary" onClick={() => window.location.href = '/'}>
                                Go Home
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
