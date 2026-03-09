'use client';

import { InputMask } from '@react-input/mask';

interface MaskedInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  className?: string;
}

export default function MaskedInput({ value, onChange, placeholder, error, className }: MaskedInputProps) {
  return (
    <div className="input-field">
      <InputMask
        value={value || ''}
        onChange={onChange}
        mask="+7 (___) ___-__-__"
        replacement={{ _: /\d/ }}
        placeholder={placeholder}
        className={`${className || ''} ${error ? 'input-error' : ''}`}
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