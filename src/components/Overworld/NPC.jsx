import React from 'react';
import { TILE_SIZE } from '../../data/maps';
import './NPC.css';

export default function NPC({ npc, isDefeated, isNearby }) {
  return (
    <div
      className={`npc-container ${isDefeated ? 'npc-defeated' : ''} ${isNearby ? 'npc-nearby' : ''}`}
      style={{
        left: npc.position.x * TILE_SIZE,
        top: npc.position.y * TILE_SIZE,
        width: TILE_SIZE,
        height: TILE_SIZE,
      }}
    >
      <div className="npc-name-label">{npc.name}</div>
      {isNearby && !isDefeated && (
        <div className="npc-interact-hint">[E]</div>
      )}
      <div
        className="npc-sprite"
        style={{ background: isDefeated ? '#555' : npc.color }}
      >
        <div className="npc-face">
          <div className="npc-eyes">
            <span className="npc-eye" />
            <span className="npc-eye" />
          </div>
          <div className={`npc-mouth ${isDefeated ? 'npc-mouth-sad' : ''}`} />
        </div>
        {isDefeated && <div className="npc-defeated-mark">✓</div>}
      </div>
      <div className="npc-shadow" />
    </div>
  );
}
