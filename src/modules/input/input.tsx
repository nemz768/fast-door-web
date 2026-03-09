'use client';

import './input.scss';

interface InputProps {
  placeholder?: string;
  name: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string | number;
  type?: 'text' | 'password' | 'email' | 'date' | 'number';
  error?: string;
  className?: string;
  maxLength?: number;
  min?: number;
  max?: number;
}

export default function Input({
  placeholder,
  name,
  onChange,
  value,
  type = 'text',
  error,
  className,
  maxLength,
  min,
  max
}: InputProps) {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;

    if (type === "number") {
      if (newValue.length > 1 && newValue.startsWith("0")) {
        newValue = newValue.replace(/^0+/, "");
      }

      e.target.value = newValue;
    }

    onChange(e);
  };

  return (
    <div className="input-field">
      <input
        onChange={handleChange}
        value={value}
        name={name}
        placeholder={placeholder}
        type={type}
        className={`${className || ''} ${error ? 'input-error' : ''}`}
        aria-invalid={!!error}
        maxLength={maxLength}
        min={min}
        max={max}
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