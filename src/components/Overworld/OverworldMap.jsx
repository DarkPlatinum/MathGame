import React, { useState, useEffect, useCallback } from 'react';
import PlayerSprite from './PlayerSprite';
import NPCComponent from './NPC';
import DialogueBox from './DialogueBox';
import { mapData, TILE_SIZE, MAP_COLS, MAP_ROWS, TILE_TYPES, isTileWalkable } from '../../data/maps';
import { npcs } from '../../data/npcs';
import { loadPlayer } from '../../utils/storage';
import './OverworldMap.css';

export default function OverworldMap({ onStartBattle }) {
  const player = loadPlayer();
  const [playerPos, setPlayerPos] = useState({ x: 3, y: 2 });
  const [direction, setDirection] = useState('down');
  const [activeDialogue, setActiveDialogue] = useState(null);
  const [dialogueStep, setDialogueStep] = useState(0);
  const [nearbyNPC, setNearbyNPC] = useState(null);

  // Check if NPC is adjacent
  const findNearbyNPC = useCallback((px, py) => {
    return npcs.find(npc => {
      const dx = Math.abs(npc.position.x - px);
      const dy = Math.abs(npc.position.y - py);
      return (dx + dy) === 1;
    });
  }, []);

  // Check if an NPC occupies a tile
  const isNPCTile = useCallback((x, y) => {
    return npcs.some(npc => npc.position.x === x && npc.position.y === y);
  }, []);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (activeDialogue) return;

      const key = e.key.toLowerCase();
      let newX = playerPos.x;
      let newY = playerPos.y;

      switch (key) {
        case 'arrowup':
        case 'w':
          newY -= 1;
          setDirection('up');
          break;
        case 'arrowdown':
        case 's':
          newY += 1;
          setDirection('down');
          break;
        case 'arrowleft':
        case 'a':
          newX -= 1;
          setDirection('left');
          break;
        case 'arrowright':
        case 'd':
          newX += 1;
          setDirection('right');
          break;
        case 'e':
          // Interact with nearby NPC
          const nearby = findNearbyNPC(playerPos.x, playerPos.y);
          if (nearby) {
            const isDefeated = player.npcsDefeated.includes(nearby.id);
            setActiveDialogue(nearby);
            setDialogueStep(isDefeated ? 'defeated' : 0);
          }
          return;
        default:
          return;
      }

      e.preventDefault();

      // Check collision
      if (isTileWalkable(newX, newY) && !isNPCTile(newX, newY)) {
        setPlayerPos({ x: newX, y: newY });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playerPos, activeDialogue, findNearbyNPC, isNPCTile, player.npcsDefeated]);

  // Update nearby NPC detection
  useEffect(() => {
    const nearby = findNearbyNPC(playerPos.x, playerPos.y);
    setNearbyNPC(nearby);
  }, [playerPos, findNearbyNPC]);

  const handleDialogueContinue = () => {
    if (dialogueStep === 0) {
      setDialogueStep(1);
    } else {
      setActiveDialogue(null);
      setDialogueStep(0);
    }
  };

  const handleBattle = () => {
    setActiveDialogue(null);
    onStartBattle(activeDialogue);
  };

  // Render tile decorations
  const renderTileDecoration = (tileId, x, y) => {
    const type = TILE_TYPES[tileId];
    if (!type) return null;

    switch (tileId) {
      case 1: // Tree
        return (
          <div className="tile-tree" key={`deco-${x}-${y}`}>
            <div className="tree-top" />
            <div className="tree-trunk" />
          </div>
        );
      case 2: // Water
        return <div className="tile-water-anim" key={`deco-${x}-${y}`} />;
      case 6: // Flowers
        return (
          <div className="tile-flowers" key={`deco-${x}-${y}`}>
            <span className="flower f1">✿</span>
            <span className="flower f2">❀</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="overworld-wrapper">
      <div className="overworld-hud">
        <div className="hud-player-info">
          <div className="hud-avatar" style={{ background: player.avatarColor }}>
            <span>⚔️</span>
          </div>
          <div className="hud-details">
            <span className="hud-name">{player.name}</span>
            <span className="hud-level">Lv. {player.level}</span>
          </div>
        </div>
        <div className="hud-stats">
          <span className="hud-coins">🪙 {player.coins}</span>
          <span className="hud-xp">⭐ {player.xp} XP</span>
        </div>
      </div>

      <div className="overworld-viewport">
        <div
          className="overworld-map"
          style={{
            width: MAP_COLS * TILE_SIZE,
            height: MAP_ROWS * TILE_SIZE,
            transform: `translate(${-(playerPos.x * TILE_SIZE - window.innerWidth / 2 + TILE_SIZE / 2)}px, ${-(playerPos.y * TILE_SIZE - window.innerHeight / 2 + TILE_SIZE / 2)}px)`
          }}
        >
          {/* Render tiles */}
          {mapData.map((row, y) =>
            row.map((tile, x) => (
              <div
                key={`tile-${x}-${y}`}
                className={`map-tile tile-${TILE_TYPES[tile]?.name || 'grass'}`}
                style={{
                  left: x * TILE_SIZE,
                  top: y * TILE_SIZE,
                  width: TILE_SIZE,
                  height: TILE_SIZE,
                  background: TILE_TYPES[tile]?.color || '#2d6a4f',
                }}
              >
                {renderTileDecoration(tile, x, y)}
              </div>
            ))
          )}

          {/* Render NPCs */}
          {npcs.map(npc => (
            <NPCComponent
              key={npc.id}
              npc={npc}
              isDefeated={player.npcsDefeated.includes(npc.id)}
              isNearby={nearbyNPC?.id === npc.id}
            />
          ))}

          {/* Render Player */}
          <PlayerSprite
            x={playerPos.x}
            y={playerPos.y}
            color={player.avatarColor}
            direction={direction}
          />
        </div>
      </div>

      {/* Controls hint */}
      <div className="controls-hint">
        <span>WASD / Arrow Keys to move</span>
        <span>E to interact</span>
      </div>

      {/* Dialogue */}
      {activeDialogue && (
        <DialogueBox
          npcName={activeDialogue.name}
          text={
            dialogueStep === 'defeated'
              ? "You've already defeated me. Well played!"
              : dialogueStep === 0
              ? activeDialogue.dialogue
              : 'Do you want to battle?'
          }
          onContinue={handleDialogueContinue}
          showBattleOption={dialogueStep === 1}
          onBattle={handleBattle}
        />
      )}
    </div>
  );
}
