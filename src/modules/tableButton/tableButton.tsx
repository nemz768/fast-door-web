import './tableButton.scss'

interface TableButtonProps {
    src: string;
    alt: string;
    disabled?: boolean;
    onClick?: () => void;
    title?: string;
    className?: string;
}

export default function TableButton({ src, disabled = false, alt = "", onClick, title, className = "" }: TableButtonProps) {
    return (
        <button disabled={disabled} onClick={onClick} className={`table-btn${className ? ` ${className}` : ""}`} title={title}>
            <img src={src} alt={alt} />
        </button>
    );
}