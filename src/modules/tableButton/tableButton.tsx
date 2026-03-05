import './tableButton.scss'

interface TableButtonProps {
    src: string; 
    alt: string; 
    disabled?:boolean;
    onClick?: () => void; 
}

export default function TableButton({ src, disabled = false, alt = "", onClick }: TableButtonProps) {
    return (
        <button disabled={disabled} onClick={onClick} className='table-btn'>
            <img  src={src} alt={alt} />
        </button>
    );
}