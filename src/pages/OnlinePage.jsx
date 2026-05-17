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

  useEffect(() => {
    if (!player.setupComplete) {
      navigate('/setup', { state: { returnTo: '/online' } });
      return;
    }

    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to PvP server');
    });

    newSocket.on('roomCreated', (data) => {
      setRoomCode(data.roomCode);
      setPlayers(data.players);
      setBattleState('waiting');
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
    socket.emit('createRoom', { playerName: player.name });
  };

  const handleJoinRoom = (code) => {
    socket.emit('joinRoom', { roomCode: code, playerName: player.name });
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

  if (!socket) return <div className="online-loading">Connecting to server...</div>;

  return (
    <div className="online-page">
      {errorMsg && <div className="online-error">{errorMsg}</div>}
      
      {battleState === 'lobby' && (
        <OnlineLobby 
          onCreateRoom={handleCreateRoom}
          onJoinRoom={handleJoinRoom}
          onLeave={handleLeaveOnline}
        />
      )}

      {battleState === 'waiting' && (
        <div className="waiting-room">
          <h2>Room Code: {roomCode}</h2>
          <div className="players-list">
            {Object.values(players).map(p => (
              <div key={p.id} className="player-card">
                <span className="player-name">{p.name} {p.id === socket.id && '(You)'}</span>
                <span className="player-status">{p.ready ? 'Ready!' : 'Waiting...'}</span>
              </div>
            ))}
          </div>
          
          <div className="room-actions">
            <button className="btn-leave" onClick={handleLeaveRoom}>Leave Room</button>
            {!players[socket.id]?.ready && (
              <button className="btn-ready" onClick={handleReady}>I'm Ready!</button>
            )}
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
        <div className="result-screen">
          <h2>{winnerInfo.winnerId === socket.id ? '🏆 YOU WON! 🏆' : '💀 YOU LOST! 💀'}</h2>
          <p>{winnerInfo.winnerName} is the champion!</p>
          <button className="btn-leave" onClick={handleLeaveRoom}>Return to Lobby</button>
        </div>
      )}
    </div>
  );
}
