import React, { useState, useRef, useEffect } from 'react';
import './AnswerInput.css';

export default function AnswerInput({ onSubmit, disabled }) {
  const [value, setValue] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim() === '' || disabled) return;
    const numValue = parseFloat(value.trim());
    if (!isNaN(numValue)) {
      onSubmit(numValue);
      setValue('');
    }
  };

  return (
    <form className="answer-input-form" onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        type="number"
        className="answer-input"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Your answer..."
        disabled={disabled}
        autoFocus
      />
      <button type="submit" className="answer-submit" disabled={disabled}>
        ⚡ Submit
      </button>
    </form>
  );
}
