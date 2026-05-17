import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import OnlineLobby from '../components/Online/OnlineLobby';
import PvPBattle from '../components/Online/PvPBattle';
import { loadPlayer } from '../utils/storage';
import './OnlinePage.css';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000';

export default function OnlinePage() {
  const navigate = useNavigate();
  const player = loadPlayer();
  
  const [socket, setSocket] = useState(null);
  const [roomCode, setRoomCode] = useState(null);
  const [players, setPlayers] = useState({});
  const [battleState, setBattleState] = useState('lobby'); // lobby, waiting, battling, result
  const [winnerInfo, setWinnerInfo] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('connecting'); // connecting, connected, disconnected
  const [isCreating, setIsCreating] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!player.setupComplete) {
      navigate('/setup', { state: { returnTo: '/online' } });
      return;
    }

    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to PvP server');
      setConnectionStatus('connected');
    });

    newSocket.on('disconnect', () => {
      setConnectionStatus('disconnected');
    });

    newSocket.on('connect_error', () => {
      setConnectionStatus('disconnected');
    });

    newSocket.on('roomCreated', (data) => {
      setRoomCode(data.roomCode);
      setPlayers(data.players);
      setBattleState('waiting');
      setIsCreating(false);
    });

    newSocket.on('roomJoined', (data) => {
      setRoomCode(data.roomCode);
      setPlayers(data.players);
      setBattleState('waiting');
    });

    newSocket.on('playerJoined', (data) => {
      setPlayers(data.players);
    });

    newSocket.on('errorMessage', (msg) => {
      setErrorMsg(msg);
      setIsCreating(false);
      setTimeout(() => setErrorMsg(''), 3000);
    });

    newSocket.on('battleStart', () => {
      setBattleState('battling');
    });

    newSocket.on('battleEnd', (data) => {
      setWinnerInfo(data);
      setBattleState('result');
    });

    newSocket.on('opponentDisconnected', (data) => {
      setErrorMsg(`${data.playerName} disconnected.`);
      setBattleState('lobby');
      setRoomCode(null);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [navigate, player.setupComplete]);

  const handleCreateRoom = () => {
    if (socket && connectionStatus === 'connected') {
      setIsCreating(true);
      socket.emit('createRoom', { playerName: player.name });
    }
  };

  const handleJoinRoom = (code) => {
    if (socket && connectionStatus === 'connected' && code.trim()) {
      socket.emit('joinRoom', { roomCode: code.trim(), playerName: player.name });
    }
  };

  const handleReady = () => {
    socket.emit('playerReady', { roomCode });
    // Update local UI immediately for ready state
    setPlayers(prev => ({
      ...prev,
      [socket.id]: { ...prev[socket.id], ready: true }
    }));
  };

  const handleLeaveRoom = () => {
    if (roomCode) {
      socket.emit('leaveRoom', { roomCode });
      setRoomCode(null);
    }
    setBattleState('lobby');
  };

  const handleLeaveOnline = () => {
    handleLeaveRoom();
    navigate('/');
  };

  const handleCopyCode = () => {
    if (roomCode) {
      navigator.clipboard.writeText(roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!socket) return <div className="online-loading">Connecting to server...</div>;

  return (
    <div className="online-page">
      {errorMsg && <div className="online-error">⚠️ {errorMsg}</div>}
      
      {battleState === 'lobby' && (
        <OnlineLobby 
          onCreateRoom={handleCreateRoom}
          onJoinRoom={handleJoinRoom}
          onLeave={handleLeaveOnline}
          connectionStatus={connectionStatus}
          isCreating={isCreating}
        />
      )}

      {battleState === 'waiting' && (
        <div className="waiting-room-container">
          <div className="waiting-room-card">
            <h2 className="waiting-title">Room Established</h2>
            
            <div className="code-box-container">
              <span className="code-label">SHARE ROOM CODE</span>
              <div className="code-box">
                <span className="code-text">{roomCode}</span>
                <button 
                  className={`code-copy-btn ${copied ? 'copied' : ''}`} 
                  onClick={handleCopyCode}
                >
                  {copied ? 'COPIED!' : 'COPY CODE'}
                </button>
              </div>
              <span className="code-hint">Waiting for challenger to connect...</span>
            </div>

            <div className="players-vs-container">
              <div className="players-vs-grid">
                {Object.values(players).map(p => {
                  const isMe = p.id === socket.id;
                  return (
                    <div key={p.id} className={`player-slot-card ${p.ready ? 'ready' : 'waiting'}`}>
                      <div className="slot-avatar" style={{ background: isMe ? player.avatarColor : '#f72585' }}>
                        <span>👤</span>
                      </div>
                      <div className="slot-info">
                        <span className="slot-name">
                          {p.name} {isMe && <span className="slot-you-tag">(YOU)</span>}
                        </span>
                        <span className={`slot-status-badge ${p.ready ? 'status-ready' : 'status-waiting'}`}>
                          {p.ready ? 'READY!' : 'PREPARING...'}
                        </span>
                      </div>
                    </div>
                  );
                })}
                {Object.keys(players).length < 2 && (
                  <div className="player-slot-card empty">
                    <div className="slot-avatar empty">
                      <span>🤖</span>
                    </div>
                    <div className="slot-info">
                      <span className="slot-name empty">Challenger</span>
                      <span className="slot-status-badge empty">Awaiting entry...</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="room-actions">
              <button className="btn-leave" onClick={handleLeaveRoom}>Leave Room</button>
              {!players[socket.id]?.ready && (
                <button className="btn-ready" onClick={handleReady}>READY UP</button>
              )}
            </div>
          </div>
        </div>
      )}

      {battleState === 'battling' && (
        <PvPBattle 
          socket={socket} 
          roomCode={roomCode} 
          initialPlayers={players} 
        />
      )}

      {battleState === 'result' && (
        <div className="result-screen-container">
          <div className="result-card">
            <h2>{winnerInfo.winnerId === socket.id ? '🏆 VICTORY! 🏆' : '💀 DEFEATED! 💀'}</h2>
            <p className="result-desc">{winnerInfo.winnerName} ruled the battlefield!</p>
            <button className="btn-leave" onClick={handleLeaveRoom}>Return to Lobby</button>
          </div>
        </div>
      )}
    </div>
  );
}
