
'use client';
import './installerCommentInput.scss';
import '@/modules/customTable/customTable.scss';
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
                placeholder='Комментарий...'
            />
    );
};

export default CommentInput;