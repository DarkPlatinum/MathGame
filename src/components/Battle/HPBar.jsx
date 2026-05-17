import React from 'react';
import './HPBar.css';

export default function HPBar({ current, max, name, isEnemy = false, color }) {
  const percentage = Math.max(0, (current / max) * 100);
  
  let barColor = '#2d6a4f';
  if (percentage < 50) barColor = '#e9c46a';
  if (percentage < 25) barColor = '#e63946';

  return (
    <div className={`hp-bar-container ${isEnemy ? 'hp-enemy' : 'hp-player'}`}>
      <div className="hp-info">
        <div className="hp-avatar" style={{ background: color || (isEnemy ? '#e63946' : '#4cc9f0') }}>
          <span className="hp-avatar-icon">{isEnemy ? '👾' : '⚔️'}</span>
        </div>
        <div className="hp-details">
          <span className="hp-name">{name}</span>
          <div className="hp-bar-track">
            <div
              className="hp-bar-fill"
              style={{ width: `${percentage}%`, background: barColor }}
            />
          </div>
          <span className="hp-text">{current} / {max} HP</span>
        </div>
      </div>
    </div>
  );
}
