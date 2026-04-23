import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function Pagination({ page, pages, onPageChange }) {
    if (pages <= 1) return null;

    const getPageNums = () => {
        const pages_list = [];
        let start = Math.max(1, page - 2);
        let end = Math.min(pages, page + 2);
        if (page <= 3) end = Math.min(5, pages);
        if (page >= pages - 2) start = Math.max(1, pages - 4);
        for (let i = start; i <= end; i++) pages_list.push(i);
        return pages_list;
    };

    return (
        <div className="pagination">
            <button
                className="pagination-btn"
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
                aria-label="Previous page"
            >
                <FiChevronLeft />
            </button>

            {getPageNums().map((num) => (
                <button
                    key={num}
                    className={`pagination-btn ${num === page ? 'active' : ''}`}
                    onClick={() => onPageChange(num)}
                >
                    {num}
                </button>
            ))}

            <button
                className="pagination-btn"
                onClick={() => onPageChange(page + 1)}
                disabled={page === pages}
                aria-label="Next page"
            >
                <FiChevronRight />
            </button>
        </div>
    );
}
