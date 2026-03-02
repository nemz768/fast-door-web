'use client';

import './input.scss';

interface InputProps {
  placeholder: string;
  name: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  type?: 'text' | 'password' | 'email' | 'date';
  error?: string;
  className?: string;
}

export default function Input({ 
  placeholder, 
  name, 
  onChange, 
  value, 
  type = 'text', 
  error,
  className
}: InputProps) {
  return (
    <div className="input-field">
      <input 
        onChange={onChange} 
        value={value} 
        name={name} 
        placeholder={placeholder}
        type={type}
        className={`${className} ${error ? 'input-error' : ''}`}
        aria-invalid={!!error}
      />
     <span
  className="input-error-message"
  aria-live="polite"
  style={{ visibility: error ? 'visible' : 'hidden' }}
>
  {error || '\u00A0'}
</span>

    </div>
  );
}
