import React, { useState, useRef, useEffect } from 'react';
import NumberPad from './NumberPad';
import './AnswerInput.css';

export default function AnswerInput({ onSubmit, disabled }) {
  const [value, setValue] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        window.innerWidth <= 800 || 
        ('ontouchstart' in window) || 
        navigator.maxTouchPoints > 0
      );
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!disabled && inputRef.current && !isMobile) {
      inputRef.current.focus();
    }
  }, [disabled, isMobile]);

  useEffect(() => {
    if (disabled) {
      setValue('');
    }
  }, [disabled]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (value.trim() === '' || disabled || value.trim() === '-') return;
    const numValue = parseFloat(value.trim());
    if (!isNaN(numValue)) {
      onSubmit(numValue);
      setValue('');
    }
  };

  const handleNumber = (char) => {
    setValue(prev => {
      if (char === '-' && prev.length > 0) return prev;
      return prev + char;
    });
    if (!isMobile) {
      inputRef.current?.focus();
    }
  };

  const handleBackspace = () => {
    setValue(prev => prev.slice(0, -1));
    if (!isMobile) {
      inputRef.current?.focus();
    }
  };

  const handleClear = () => {
    setValue('');
    if (!isMobile) {
      inputRef.current?.focus();
    }
  };

  return (
    <div className="answer-input-container">
      <form className="answer-input-form" onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          inputMode={isMobile ? "none" : "numeric"}
          pattern="[0-9\-]*"
          className="answer-input"
          value={value}
          onChange={e => {
            const val = e.target.value;
            if (/^-?\d*$/.test(val)) {
              setValue(val);
            }
          }}
          placeholder="Answer..."
          disabled={disabled}
          autoFocus={!isMobile}
          autoComplete="off"
        />
      </form>
      <NumberPad 
        onNumber={handleNumber}
        onBackspace={handleBackspace}
        onClear={handleClear}
        onSubmit={handleSubmit}
        disabled={disabled}
      />
    </div>
  );
}
