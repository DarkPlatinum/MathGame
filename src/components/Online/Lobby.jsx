import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import Button from '../UI/Button';
import Card from '../UI/Card';
import { loadPlayer } from '../../utils/storage';
import './Lobby.css';

const SOCKET_URL = 'http://localhost:3001';

export default function Lobby({ onStartPvP, onBack }) {
  const player = loadPlayer();
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [waiting, setWaiting] = useState(false);
  const [error, setError] = useState('');
  const [roomCode, setRoomCode] = useState('');

  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket'],
      timeout: 5000,
      reconnection: true,
      reconnectionAttempts: 3,
    });

    newSocket.on('connect', () => {
      setConnected(true);
      setError('');
      newSocket.emit('joinLobby', { playerName: player.name, level: player.level });
    });

    newSocket.on('connect_error', () => {
      setConnected(false);
      setError('Cannot connect to server. Make sure the server is running on port 3001.');
    });

    newSocket.on('roomCreated', (data) => {
      setCurrentRoom(data.roomId);
      setWaiting(true);
    });

    newSocket.on('playerJoined', (data) => {
      setWaiting(false);
    });

    newSocket.on('battleStart', (data) => {
      onStartPvP(newSocket, data);
    });

    newSocket.on('roomList', (data) => {
      setRooms(data.rooms || []);
    });

    newSocket.on('errorMessage', (data) => {
      setError(data.message);
      setWaiting(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const createRoom = () => {
    if (socket && connected) {
      socket.emit('createRoom', { playerName: player.name, level: player.level });
    }
  };

  const joinRoom = (roomId) => {
    if (socket && connected) {
      socket.emit('joinRoom', { roomId, playerName: player.name, level: player.level });
    }
  };

  const joinByCode = () => {
    if (roomCode.trim()) {
      joinRoom(roomCode.trim());
    }
  };

  return (
    <div className="lobby-screen">
      <div className="lobby-header">
        <button className="lobby-back" onClick={onBack}>← Back</button>
        <h1 className="lobby-title">Online Arena</h1>
        <div className={`lobby-status ${connected ? 'status-connected' : 'status-disconnected'}`}>
          {connected ? '● Connected' : '○ Disconnected'}
        </div>
      </div>

      {error && (
        <div className="lobby-error">
          <span>⚠️ {error}</span>
        </div>
      )}

      <div className="lobby-content">
        {waiting ? (
          <Card glow className="lobby-waiting-card">
            <div className="waiting-content">
              <div className="waiting-spinner" />
              <h2>Waiting for opponent...</h2>
              <p className="room-code">Room Code: <strong>{currentRoom}</strong></p>
              <p className="waiting-hint">Share this code with your friend!</p>
              <Button variant="outline" onClick={() => { setWaiting(false); setCurrentRoom(null); }}>
                Cancel
              </Button>
            </div>
          </Card>
        ) : (
          <>
            <div className="lobby-actions">
              <Card glow className="lobby-action-card">
                <h3>Create a Room</h3>
                <p>Start a new battle room and wait for an opponent.</p>
                <Button onClick={createRoom} disabled={!connected} size="large">
                  ⚔️ Create Room
                </Button>
              </Card>

              <Card className="lobby-action-card">
                <h3>Join by Code</h3>
                <p>Enter a room code to join a friend's room.</p>
                <div className="join-code-form">
                  <input
                    type="text"
                    className="join-code-input"
                    value={roomCode}
                    onChange={e => setRoomCode(e.target.value.toUpperCase())}
                    placeholder="Enter room code"
                    maxLength={6}
                  />
                  <Button onClick={joinByCode} disabled={!connected || !roomCode.trim()} variant="secondary">
                    Join
                  </Button>
                </div>
              </Card>
            </div>

            {rooms.length > 0 && (
              <div className="lobby-rooms">
                <h3 className="rooms-title">Open Rooms</h3>
                <div className="rooms-list">
                  {rooms.map(room => (
                    <div key={room.id} className="room-item" onClick={() => joinRoom(room.id)}>
                      <span className="room-host">{room.hostName}</span>
                      <span className="room-level">Lv.{room.hostLevel}</span>
                      <Button size="small" variant="outline">Join</Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
