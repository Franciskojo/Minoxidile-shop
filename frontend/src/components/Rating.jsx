import { FiStar } from 'react-icons/fi';
import { MdStar, MdStarHalf, MdStarOutline } from 'react-icons/md';

export default function Rating({ value = 0, numReviews, size = 16, showCount = true }) {
    const stars = Array.from({ length: 5 }, (_, i) => {
        if (value >= i + 1) return 'full';
        if (value >= i + 0.5) return 'half';
        return 'empty';
    });

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <div style={{ display: 'flex', gap: '1px' }}>
                {stars.map((type, i) => (
                    <span key={i} style={{ color: type === 'empty' ? 'var(--text-muted)' : 'var(--warning)', fontSize: size }}>
                        {type === 'full' ? <MdStar /> : type === 'half' ? <MdStarHalf /> : <MdStarOutline />}
                    </span>
                ))}
            </div>
            {showCount && numReviews !== undefined && (
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.25rem' }}>
                    ({numReviews})
                </span>
            )}
        </div>
    );
}
