interface ButtonProps {
    text: string;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    className?: string; 
}

export default function Button({ text, onClick, disabled = false, type = 'button', className }: ButtonProps) {
    return (
        <button className={className} type={type} onClick={onClick} disabled={disabled}>{text}</button>
    )
}