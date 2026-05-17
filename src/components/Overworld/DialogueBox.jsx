import React from 'react';
import './DialogueBox.css';

export default function DialogueBox({ npcName, text, onContinue, showBattleOption, onBattle }) {
  return (
    <div className="dialogue-overlay">
      <div className="dialogue-box">
        <div className="dialogue-name">{npcName}</div>
        <div className="dialogue-text">{text}</div>
        <div className="dialogue-actions">
          {showBattleOption ? (
            <>
              <button className="dialogue-btn dialogue-btn-battle" onClick={onBattle}>
                ⚔️ Battle!
              </button>
              <button className="dialogue-btn dialogue-btn-cancel" onClick={onContinue}>
                ← Leave
              </button>
            </>
          ) : (
            <button className="dialogue-btn" onClick={onContinue}>
              Continue ▼
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
