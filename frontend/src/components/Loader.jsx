export default function Loader({ size = 'md', center = true }) {
    const spinner = (
        <div className={`spinner spinner-${size}`} />
    );
    if (center) {
        return <div className="loader-center">{spinner}</div>;
    }
    return spinner;
}
