import React, { useState } from 'react';
import Button from '../UI/Button';
import Card from '../UI/Card';
import './OnlineLobby.css';

export default function OnlineLobby({ onCreateRoom, onJoinRoom, onLeave }) {
  const [roomCode, setRoomCode] = useState('');

  return (
    <div className="online-lobby">
      <div className="lobby-header">
        <button className="lobby-back" onClick={onLeave}>← Back to Menu</button>
        <h1 className="lobby-title">Online PvP Arena</h1>
      </div>

      <div className="lobby-content">
        <Card glow className="lobby-action-card">
          <h3>Create a Room</h3>
          <p>Host a private room and share the code with your opponent.</p>
          <Button onClick={onCreateRoom} size="large">
            ⚔️ Create Room
          </Button>
        </Card>

        <Card className="lobby-action-card">
          <h3>Join a Room</h3>
          <p>Enter an existing room code.</p>
          <div className="join-code-form">
            <input
              type="text"
              className="join-code-input"
              value={roomCode}
              onChange={e => setRoomCode(e.target.value.toUpperCase())}
              placeholder="ROOM CODE"
              maxLength={6}
            />
            <Button 
              onClick={() => onJoinRoom(roomCode.trim())} 
              disabled={!roomCode.trim()} 
              variant="secondary"
            >
              Join
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
