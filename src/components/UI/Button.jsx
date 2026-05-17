import React from 'react';
import './Button.css';

export default function Button({ children, onClick, variant = 'primary', size = 'medium', disabled = false, className = '' }) {
  return (
    <button
      className={`btn btn-${variant} btn-${size} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
