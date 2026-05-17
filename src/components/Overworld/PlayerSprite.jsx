import React from 'react';
import { TILE_SIZE } from '../../data/maps';
import './PlayerSprite.css';

export default function PlayerSprite({ x, y, color, direction }) {
  return (
    <div
      className="player-container"
      style={{
        left: x * TILE_SIZE,
        top: y * TILE_SIZE,
        width: TILE_SIZE,
        height: TILE_SIZE,
      }}
    >
      <div className={`player-sprite-char player-dir-${direction}`} style={{ background: color }}>
        <div className="player-face">
          <div className="player-eyes">
            <span className="player-eye-left" />
            <span className="player-eye-right" />
          </div>
          <div className="player-mouth-char" />
        </div>
      </div>
      <div className="player-shadow" />
    </div>
  );
}
