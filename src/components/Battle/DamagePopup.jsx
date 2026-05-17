import React, { useEffect, useState } from 'react';
import './DamagePopup.css';

export default function DamagePopup({ damage, position, attackName, onComplete }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onComplete) onComplete();
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className={`damage-popup ${position}`}>
      <span className="damage-number">-{damage}</span>
      {attackName && <span className="damage-attack-name">{attackName}</span>}
    </div>
  );
}
