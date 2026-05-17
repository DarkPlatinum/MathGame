import React from 'react';
import './Card.css';

export default function Card({ children, className = '', glow = false }) {
  return (
    <div className={`card ${glow ? 'card-glow' : ''} ${className}`}>
      {children}
    </div>
  );
}
