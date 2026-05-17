import React, { useState } from 'react';
import Button from '../UI/Button';
import Card from '../UI/Card';
import './OnlineLobby.css';

export default function OnlineLobby({ onCreateRoom, onJoinRoom, onLeave, connectionStatus, isCreating }) {
  const [roomCode, setRoomCode] = useState('');

  return (
    <div className="online-lobby">
      <div className="lobby-header">
        <button className="lobby-back" onClick={onLeave}>← Back to Menu</button>
        <h1 className="lobby-title">Online PvP Arena</h1>
        <div className={`lobby-connection status-${connectionStatus}`}>
          <span className="status-dot"></span>
          <span className="status-text">
            {connectionStatus === 'connected' ? 'Connected' : 
             connectionStatus === 'connecting' ? 'Connecting...' : 'Disconnected'}
          </span>
        </div>
      </div>

      <div className="lobby-content">
        <Card glow className="lobby-action-card">
          <h3>Create a Room</h3>
          <p>Host a private room and share the code with your opponent.</p>
          <Button 
            onClick={onCreateRoom} 
            disabled={isCreating || connectionStatus !== 'connected'} 
            size="large"
          >
            {isCreating ? 'Creating Room...' : '⚔️ Create Room'}
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
              disabled={connectionStatus !== 'connected'}
            />
            <Button 
              onClick={() => onJoinRoom(roomCode.trim())} 
              disabled={!roomCode.trim() || connectionStatus !== 'connected'} 
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
