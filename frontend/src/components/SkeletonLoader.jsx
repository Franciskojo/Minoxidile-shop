import React from 'react';

// A single animated Product Card Skeleton
export const ProductSkeleton = () => (
    <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Image Placeholder */}
        <div className="skeleton animate-pulse" style={{ aspectRatio: '1', width: '100%', background: 'var(--bg-input)' }} />

        {/* Content Placeholders */}
        <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div className="skeleton animate-pulse" style={{ height: '12px', width: '30%', borderRadius: '4px', background: 'var(--bg-input)' }} />
            <div className="skeleton animate-pulse" style={{ height: '16px', width: '85%', borderRadius: '4px', background: 'var(--bg-input)' }} />
            <div className="skeleton animate-pulse" style={{ height: '16px', width: '50%', borderRadius: '4px', background: 'var(--bg-input)' }} />

            <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                <div className="skeleton animate-pulse" style={{ height: '20px', width: '40%', borderRadius: '4px', background: 'var(--bg-input)', marginBottom: '0.75rem' }} />
                <div className="skeleton animate-pulse" style={{ height: '36px', width: '100%', borderRadius: 'var(--radius-md)', background: 'var(--bg-input)' }} />
            </div>
        </div>
    </div>
);

// A Grid of Product Skeletons to completely fill out the loading spaces
export default function SkeletonLoader({ count = 8 }) {
    return (
        <div className="products-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '1.5rem',
            width: '100%'
        }}>
            {Array.from({ length: count }).map((_, i) => (
                <ProductSkeleton key={i} />
            ))}
        </div>
    );
}

// Add CSS keyframes for pulse animation to document head (done only once)
if (typeof document !== 'undefined') {
    const styleId = 'skeleton-keyframes';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = `
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: .4; }
            }
            .animate-pulse {
                animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
            }
        `;
        document.head.appendChild(style);
    }
}
