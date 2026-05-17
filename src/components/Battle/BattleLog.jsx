import React from 'react';
import './BattleLog.css';

export default function BattleLog({ messages }) {
  return (
    <div className="battle-log">
      {messages.slice(-4).map((msg, i) => (
        <div
          key={i}
          className={`battle-log-msg battle-log-${msg.type || 'info'}`}
          style={{ animationDelay: `${i * 0.05}s` }}
        >
          {msg.text}
        </div>
      ))}
    </div>
  );
}
