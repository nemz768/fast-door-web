
'use client';
import React from 'react';

interface CommentInputProps {
    value: string;
    onChange: (value: string) => void;
}

const CommentInput: React.FC<CommentInputProps> = ({ value, onChange }) => {
    return (
        <input
            maxLength={55}
            type="text"
            className="comment-input"
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    );
};

export default CommentInput;